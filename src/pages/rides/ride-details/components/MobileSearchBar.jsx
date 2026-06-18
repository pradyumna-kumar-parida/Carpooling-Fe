// src/pages/Rides/find-ride/components/MobileSearchBar.jsx

import { useState }           from "react";
import { BiSolidLocationPlus } from "react-icons/bi";
import { LuFilter }            from "react-icons/lu";
import SearchRide              from "../SearchRide";

export default function MobileSearchBar({
  from,
  to,
  date,
  passengers,
  onFilterClick,
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="mobile-search-bar">
        <button
          className="mobile-search-summary"
          onClick={() => setSearchOpen(true)}
        >
          <span className="mobile-search-icon">
            <BiSolidLocationPlus />
          </span>
          <span className="mobile-search-text">
            <span className="mobile-search-route">
              {from
                ? `${from.split(",")[0]} → ${to ? to.split(",")[0] : "..."}`
                : "Where are you going?"}
            </span>
            <span className="mobile-search-sub">
              {date || "Select date"}
              {passengers
                ? `, ${passengers} passenger${Number(passengers) > 1 ? "s" : ""}`
                : ""}
            </span>
          </span>
        </button>

        <button className="mobile-filter-btn" onClick={onFilterClick}>
          <LuFilter /> Filter
        </button>
      </div>

      {/* ── Search drawer ── */}
      {searchOpen && (
        <>
          <div
            className="ridetail-overlay"
            style={{ zIndex: 200 }}
            onClick={() => setSearchOpen(false)}
          />
          <div className="mobile-search-drawer">
            <div className="mobile-search-drawer-head">
              <span className="mobile-search-drawer-title">Search rides</span>
              <button
                className="ridetail-mobile-close"
                onClick={() => setSearchOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6"  x2="6"  y2="18" />
                  <line x1="6"  y1="6"  x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="mobile-search-drawer-body">
              <SearchRide
                initialFrom={from}
                initialTo={to}
                initialDate={date}
                initialPassengers={passengers}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}