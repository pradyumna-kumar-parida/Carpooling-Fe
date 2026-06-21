"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import "../../../styles/find-ride.css";

import ArcLoader from "../../../components/Loader";

import rideNotFound from "../../../assets/images/no-ride.png";

import { useRides } from "./hooks/useRides";

import SearchRide from "../../../components/SearchRide";
import RideCard from "./components/RideCard";
import FilterPanel from "./components/FilterPanel";
import MobileSearchBar from "./components/MobileSearchBar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";

export default function RideDetails() {
  const searchParams = useSearchParams();

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
  } = useRides({
    from,
    to,
    date,
    passengers,
  });

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
            {apiLoading
              ? "Searching for rides..."
              : "Applying filters..."}
          </p>
        </div>
      );
    }

    if (apiError) {
      return (
        <div className="ridetail-empty ridetail-empty--error">
          {apiError}
        </div>
      );
    }

    if (groups.length === 0) {
      return (
        <div className="notfoundride">
          <Image
            src={rideNotFound}
            alt="No rides available"
            priority
            style={{ height: "auto", width: "100%" }}
          />
        </div>
      );
    }

    return groups.map((group) => (
      <div
        key={group.date}
        className="ridetail-date-group"
      >
        <div className="ridetail-date-header">
          <span className="ridetail-date-label">
            {group.date}
          </span>

          <span className="ridetail-date-route">
            {group.route}
          </span>
        </div>

        {group.rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            noOfSIt={passengers}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="ridetail-page">
      {/* Desktop Search */}
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

      {/* Mobile Search */}
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
        <aside className="ridetail-sidebar">
          <div className="ridetail-sidebar-head">
            <span className="ridetail-sidebar-title">
              Filter
            </span>

            <button
              type="button"
              className="ridetail-clear-btn"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>

          <FilterPanel {...filterProps} />
        </aside>

        <main>
          <MobileFilterDrawer
            open={filterOpen}
            setOpen={setFilterOpen}
            clearAll={clearAll}
            {...filterProps}
          />

          <div className="ridetail-results">
            {renderResults()}
          </div>

          {!isLoading &&
            visibleCount < sorted.length && (
              <div className="ridetail-load-wrap">
                <button
                  type="button"
                  className="ridetail-load-btn"
                  onClick={() =>
                    setVisibleCount(
                      (prev) => prev + 4
                    )
                  }
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