// src/pages/Rides/find-ride/RideDetails.jsx

import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import "../../styles/FindRide.css";
import ArcLoader from "../../components/Loader";
import rideNotFound from "../../assets/Images/no-ride.png";

import { useRides } from "./find-ride/hooks/useRides";
import SearchRide from "./find-ride/SearchRide";
import RideCard from "./find-ride/components/RideCard";
import FilterPanel from "./find-ride/components/FilterPanel";
import MobileSearchBar from "./find-ride/components/MobileSearchBar";
import MobileFilterDrawer from "./find-ride/components/MobileFilterDrawer";

export default function RideDetails() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const passengers = searchParams.get("passengers");

  const [filterOpen, setFilterOpen] = useState(false);

  const {
    isLoading,
    apiLoading,
    apiError,
    sortBy,
    departSlot,
    amenityChecks,
    verifiedOnly,
    sorted,
    groups,
    visibleCount,
    handleSetSortBy,
    handleSetDepartSlot,
    handleSetVerifiedOnly,
    handleSetAmenityChecks,
    clearAll,
    setVisibleCount,
  } = useRides({ from, to, date, passengers });

  // ── Shared filter props ─────────────────────────────────────────────────
  const filterProps = {
    sortBy,
    setSortBy: handleSetSortBy,
    departSlot,
    setDepartSlot: handleSetDepartSlot,
    verifiedOnly,
    setVerifiedOnly: handleSetVerifiedOnly,
    amenityChecks,
    setAmenityChecks: handleSetAmenityChecks,
  };

  // ── Results area ────────────────────────────────────────────────────────
  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="ridetail-loader-wrap">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArcLoader />
          </div>
          <p className="ridetail-loader-text">
            {apiLoading ? "Searching for rides…" : "Applying filters…"}
          </p>
        </div>
      );
    }
    if (apiError) {
      return (
        <div className="ridetail-empty ridetail-empty--error">{apiError}</div>
      );
    }
    if (groups.length === 0) {
      return (
        <div className="notfoundride">
          <img src={rideNotFound} alt="No rides available" loading="lazy" />
        </div>
      );
    }
    return groups.map((group) => (
      <div key={group.date} className="ridetail-date-group">
        <div className="ridetail-date-header">
          <span className="ridetail-date-label">{group.date}</span>
          <span className="ridetail-date-route">{group.route}</span>
        </div>
        {group.rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} noOfSIt={passengers} />
        ))}
      </div>
    ));
  };

  // ───────────────────────────────────────────────────────────────────────
  return (
    <div className="ridetail-page">
      {/* Desktop topbar */}
      <div className="ridetail-topbar ridetail-topbar--desktop">
        <div className="ridetail-topbar-inner">
          <SearchRide
            initialFrom={from}
            initialTo={to}
            initialDate={date}
            initialPassengers={passengers}
          />
        </div>
      </div>

      {/* Mobile compact bar */}
      <div className="ridetail-topbar--mobile">
        <MobileSearchBar
          from={from}
          to={to}
          date={date}
          passengers={passengers}
          onFilterClick={() => setFilterOpen(true)}
        />
      </div>

      <div className="ridetail-body">
        {/* Desktop sidebar */}
        <aside className="ridetail-sidebar">
          <div className="ridetail-sidebar-head">
            <span className="ridetail-sidebar-title">Filter</span>
            <button className="ridetail-clear-btn" onClick={clearAll}>
              Clear all
            </button>
          </div>
          <FilterPanel {...filterProps} />
        </aside>

        {/* Results */}
        <main>
          <MobileFilterDrawer
            open={filterOpen}
            setOpen={setFilterOpen}
            clearAll={clearAll}
            {...filterProps}
          />

          <div className="ridetail-results">{renderResults()}</div>

          {!isLoading && visibleCount < sorted.length && (
            <div className="ridetail-load-wrap">
              <button
                type="button"
                className="ridetail-load-btn"
                onClick={() => setVisibleCount((n) => n + 4)}
              >
                Load more results
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
