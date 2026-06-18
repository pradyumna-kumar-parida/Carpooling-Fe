"use client";
import "../styles/find-ride.css"
import React, { useState, useRef, useEffect } from "react";
import { MdMyLocation } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import axios from "axios";
import { searchLocationsApi } from "../services/rideService";
import { IoLocationOutline } from "react-icons/io5";
import { TbLocationShare } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
// ── Icons ─────────────────────────────────────────────────────────────────────

const PinIcon = () => <IoLocationOutline />;
const DestIcon = () => <TbLocationShare />;
const CalIcon = () => <SlCalender />;
const UserIcon = () => <FiUser />;
const MinusIcon = () => <FiMinus />;
const PlusIcon = () => <FiPlus />;
const SearchIcon = () => <IoSearchOutline />;

// ── Location Dropdown ─────────────────────────────────────────────────────────

function LocationDropdown({
  placeholder,
  icon,
  onSelect,
  showCurrentLocation = false,
  value,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);

  const debounceRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    setQuery(value?.name || "");
    setSelected(!!value);
  }, [value]);

  const storageKey =
    placeholder === "Leaving from" ? "from_location" : "to_location";

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveToStorage = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (err) {
      console.error("localStorage error:", err);
    }
  };

  const fetchSuggestions = (input) => {
    clearTimeout(debounceRef.current);
    if (!input || input.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const payload = { keyword: input.trim() };
      try {
        const token = localStorage.getItem("token");
        const response = await searchLocationsApi(payload);
        const results = Array.isArray(response.data) ? response.data : [];
        setSuggestions(results);
      } catch (err) {
        console.error("Location search error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(false);
    setOpen(true);
    fetchSuggestions(val);
  };

  const handleSelect = (item) => {
    const name =
      typeof item === "string"
        ? item
        : item.name || item.city || item.label || "";
    setQuery(name);
    setSuggestions([]);
    setOpen(false);
    setSelected(true);
    const data = {
      name,
      fullAddress:
        item.full_address || item.address || item.description || name,
      lat: item.lat || item.latitude || null,
      lng: item.lng || item.longitude || null,
    };
    saveToStorage(data);
    onSelect(data);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery("");
    setSelected(false);
    setSuggestions([]);
    onSelect(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error("localStorage error:", err);
    }
  };

  const showDropdown =
    open &&
    query.trim().length >= 2 &&
    (loading || suggestions.length > 0 || (query.length >= 2 && !loading));

  return (
    <div className="fr-field" ref={ref}>
      <span className="fr-field-icon">{icon}</span>
      <input
        type="text"
        className="fr-field-input"
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onChange={handleInputChange}
      />
      {selected && query && (
        <button
          className="fr-field-clear"
          onMouseDown={handleClear}
          tabIndex={-1}
        >
          <RxCross2 size={15} />
        </button>
      )}
      {showDropdown && (
        <div className="fr-loc-dropdown">
          {loading && <div className="fr-loc-empty">Searching...</div>}
          {!loading &&
            suggestions.map((item, i) => {
              const name =
                typeof item === "string" ? item : item.name || item.city || "";
              return (
                <div
                  key={i}
                  className="fr-loc-item"
                  onMouseDown={() => handleSelect(item)}
                >
                  <span className="fr-loc-pin">
                    <PinIcon />
                  </span>
                  <span className="fr-loc-name">{name}</span>
                </div>
              );
            })}
          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="fr-loc-empty">No places found</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Passenger Selector ────────────────────────────────────────────────────────

function PassengerField({ count, setCount }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className="fr-field fr-field-passenger"
      ref={ref}
      onClick={() => setOpen((o) => !o)}
    >
      <span className="fr-field-icon">
        <UserIcon />
      </span>
      <span className="fr-field-value">
        {count} {count === 1 ? "passenger" : "passengers"}
      </span>
      {open && (
        <div className="fr-pax-popup" onClick={(e) => e.stopPropagation()}>
          <div className="fr-pax-row">
            <span className="fr-pax-label">Passengers</span>
            <div className="fr-pax-counter">
              <button
                className="fr-pax-btn"
                onClick={() => setCount((n) => Math.max(1, n - 1))}
                disabled={count <= 1}
              >
                <MinusIcon />
              </button>
              <span className="fr-pax-count">{count}</span>
              <button
                className="fr-pax-btn"
                onClick={() => setCount((n) => Math.min(8, n + 1))}
                disabled={count >= 8}
              >
                <PlusIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Date Field ────────────────────────────────────────────────────────────────
function DateField({ name, value, onChange, icon }) {
  const pickerRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fr-field" onClick={() => pickerRef.current?.showPicker?.()}>
      <span className="fr-field-icon">{icon}</span>

      <input
        type="text"
        placeholder="yyyy-mm-dd"
        name={name}
        className="fr-field-input fr-date-input"
        value={value || ""}
        readOnly
      />
      <input
        ref={pickerRef}
        type="date"
        value={value || ""}
        min={today}
        onChange={onChange}
        className="date-picker-format"
      />
    </div>
  );
}
// ── Main Component ────────────────────────────────────────────────────────────

const toLocationObj = (val) => {
  if (!val) return null;
  if (typeof val === "string")
    return { name: val, fullAddress: val, lat: null, lng: null };
  return val;
};

const FRSearchBar = ({
  initialFrom,
  initialTo,
  initialDate,
  initialPassengers,
}) => {
  const [leaving, setLeaving] = useState(() => toLocationObj(initialFrom));
  const [going, setGoing] = useState(() => toLocationObj(initialTo));
  const [date, setDate] = useState(initialDate || "");
  const [passengers, setPassengers] = useState(Number(initialPassengers) || 1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialFrom) setLeaving(toLocationObj(initialFrom));
  }, [initialFrom]);

  useEffect(() => {
    if (initialTo) setGoing(toLocationObj(initialTo));
  }, [initialTo]);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    if (initialPassengers) setPassengers(Number(initialPassengers));
  }, [initialPassengers]);

  const router = useRouter();

  const handleSearch = () => {
    if (!leaving || !going) {
      setError("Please select both departure and destination cities.");
      return;
    }

    if (!date) {
      setError("Please select a travel date.");
      return;
    }

    setError("");

    const url = `/all-rides?from=${encodeURIComponent(leaving.name)}&to=${encodeURIComponent(going.name)}&date=${date}&passengers=${passengers}`;

    if (window.location.pathname === "/all-rides") {
      router.replace(url);
      window.location.reload();
    } else {
      router.push(url);
    }
  };

  return (
    <section className="fr-search-section">
      <div className="fr-search-wrapper">
        <div className="fr-search-container">
          <div className="fr-search-bar">
            <LocationDropdown
              placeholder="Leaving from"
              icon={<PinIcon />}
              onSelect={setLeaving}
              showCurrentLocation={true}
              value={leaving}
            />
            <LocationDropdown
              placeholder="Going to"
              icon={<DestIcon />}
              onSelect={setGoing}
              showCurrentLocation={false}
              value={going}
            />
            <DateField
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon={<CalIcon />}
            />
            <PassengerField count={passengers} setCount={setPassengers} />
            <button
              className="fr-search-btn"
              type="button"
              onClick={handleSearch}
            >
              <SearchIcon />
              Search
            </button>
          </div>
          {error && <p className="fr-error">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default FRSearchBar;
