"use client";

import "../styles/find-ride.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { TbLocationShare } from "react-icons/tb";
import LocationDropdown from "./SearchRide/components/Locationdropdown";
import PassengerField from "./SearchRide/components/Passengerfield";
import DateField from "./SearchRide/components/Datefield";
import { toLocationObj } from "./SearchRide/utils/Location";

type LocationValue = {
  name: string;
  [key: string]: unknown;
} | null;

type FRSearchBarProps = {
  defaultFrom?: string | null;
  defaultTo?: string | null;
  defaultDate?: string;
  defaultPassengers?: number;
};

const FRSearchBar = ({
  defaultFrom,
  defaultTo,
  defaultDate,
  defaultPassengers,
}: FRSearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leaving, setLeaving] = useState<LocationValue>(null);
  const [going, setGoing] = useState<LocationValue>(null);
  const [date, setDate] = useState<string>("");
  const [passengers, setPassengers] = useState<number>(1);
  const [error, setError] = useState<string>("");

  // Single source of truth: re-derive everything from the URL whenever it
  // changes. `searchParams` is a new object on every navigation, so this
  // effect reliably re-runs after every search, on every page.
  useEffect(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const dateParam = searchParams.get("date");
    const paxParam = searchParams.get("passengers");

    setLeaving(toLocationObj(fromParam) ?? toLocationObj(defaultFrom) ?? null);
    setGoing(toLocationObj(toParam) ?? toLocationObj(defaultTo) ?? null);
    setDate(dateParam || defaultDate || "");
    setPassengers(Number(paxParam) || Number(defaultPassengers) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

    const params = new URLSearchParams({
      from: leaving.name,
      to: going.name,
      date,
      passengers: String(passengers),
    });

    // Just navigate. No reload. Next.js re-renders any component reading
    // useSearchParams() — including this one and the results page —
    // with the fresh values.
    router.push(`/all-rides?${params.toString()}`);
  };

  return (
    <section className="fr-search-section">
      <div className="fr-search-wrapper">
        <div className="fr-search-container">
          <div className="fr-search-bar">
            <LocationDropdown
              placeholder="Leaving from"
              icon={<IoLocationOutline />}
              onSelectAction={setLeaving}
              storageKey="from_location"
              value={leaving}
            />
            <LocationDropdown
              placeholder="Going to"
              icon={<TbLocationShare />}
              onSelectAction={setGoing}
              storageKey="to_location"
              value={going}
            />
            <DateField
              name="date"
              value={date}
              onChangeAction={(e) => setDate(e.target.value)}
            />
            <PassengerField count={passengers} setCountAction={setPassengers} />
            <button
              className="fr-search-btn"
              type="button"
              onClick={handleSearch}
            >
              <IoSearchOutline />
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
