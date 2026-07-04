"use client";
// components/search/LocationDropdown.jsx

import { useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoLocationOutline } from "react-icons/io5";
import { useClickOutside } from "../hooks/Useclickoutside";
import { useDebouncedLocationSearch } from "../hooks/Usedebouncedlocationsearch";

type LocationItem = {
  name: string;
  fullAddress?: string;
  [key: string]: unknown;
};

type LocationDropdownProps = {
  placeholder: string;
  icon: ReactElement;
  onSelectAction: (item: LocationItem | null) => void;
  storageKey?: string;
  value?: LocationItem | null;
};

export default function LocationDropdown({
  placeholder,
  icon,
  onSelectAction,
  storageKey,
  value,
}: LocationDropdownProps) {
  const [query, setQuery] = useState<string>(value?.name || "");
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(!!value);
  const { suggestions, loading, search, clear } = useDebouncedLocationSearch();

  const ref = useClickOutside(() => setOpen(false));

  // Keep the input text in sync if the parent changes `value` externally
  // (e.g. user clears the field, or the search bar resets from the URL).
  useEffect(() => {
    setQuery(value?.name || "");
    setSelected(!!value);
  }, [value]);

  const saveToStorage = (data: LocationItem) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (err) {
      console.error("localStorage error:", err);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(false);
    setOpen(true);
    search(val);
  };

  const handleSelect = (item: LocationItem) => {
    setQuery(item.name);
    setOpen(false);
    setSelected(true);
    clear();
    saveToStorage(item);
    onSelectAction(item);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setQuery("");
    setSelected(false);
    clear();
    onSelectAction(null);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.error("localStorage error:", err);
      }
    }
  };

  const showDropdown = open && query.trim().length >= 2;

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
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
      />
      {selected && query && (
        <button className="fr-field-clear" onMouseDown={handleClear} tabIndex={-1}>
          <RxCross2 size={15} />
        </button>
      )}
      {showDropdown && (
        <div className="fr-loc-dropdown">
          {loading && <div className="fr-loc-empty">Searching...</div>}
          {!loading &&
            suggestions.map((item, i) => (
              <div
                key={`${item.fullAddress}-${i}`}
                className="fr-loc-item"
                onMouseDown={() => handleSelect(item)}
              >
                <span className="fr-loc-pin">
                  <IoLocationOutline />
                </span>
                <span className="fr-loc-name">{item.name}</span>
              </div>
            ))}
          {!loading && suggestions.length === 0 && (
            <div className="fr-loc-empty">No places found</div>
          )}
        </div>
      )}
    </div>
  );
}