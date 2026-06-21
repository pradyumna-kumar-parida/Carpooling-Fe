"use client";

import { useState, useEffect, useCallback } from "react";
import { findRidesApi } from "../../../../services/rideService";
import { getDepartSlot, groupByDate } from "../utils/rideHelpers";
import { DEFAULT_AMENITY_CHECKS } from "../constants/filterOptions";

export function useRides({ from, to, date, passengers }) {
  const [rides, setRides] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [sortBy, setSortBy] = useState("earliest");
  const [departSlot, setDepartSlot] = useState("");
  const [amenityChecks, setAmenityChecks] = useState({
    ...DEFAULT_AMENITY_CHECKS,
  });
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (!from || !to || !date) return;

    const fetchRides = async () => {
      setApiLoading(true);
      setApiError("");

      try {
        const payload = {
          source_address: from,
          destination_address: to,
          ride_date: date,
          no_of_seats: passengers,
        };

        const response = await findRidesApi(payload);

        setRides(
          Array.isArray(response?.data?.rides)
            ? response.data.rides
            : []
        );
      } catch (err) {
        console.error("Fetch rides error:", err);
        setApiError("Failed to load rides. Please try again.");
        setRides([]);
      } finally {
        setApiLoading(false);
      }
    };

    fetchRides();
  }, [from, to, date, passengers]);

  const triggerFilterLoad = useCallback(() => {
    setFilterLoading(true);

    const timer = setTimeout(() => {
      setFilterLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSetSortBy = (value) => {
    setSortBy(value);
    triggerFilterLoad();
  };

  const handleSetDepartSlot = (value) => {
    setDepartSlot(value);
    triggerFilterLoad();
  };

  const handleSetVerifiedOnly = () => {
    setVerifiedOnly((prev) => !prev);
    triggerFilterLoad();
  };

  const handleSetAmenityChecks = (updater) => {
    setAmenityChecks(updater);
    triggerFilterLoad();
  };

  const clearAll = () => {
    setSortBy("earliest");
    setDepartSlot("");
    setAmenityChecks({ ...DEFAULT_AMENITY_CHECKS });
    setVerifiedOnly(false);
    triggerFilterLoad();
  };

  const filtered = rides.filter((ride) => {
    if (
      verifiedOnly &&
      ride.driver_is_verified !== "1"
    )
      return false;

    if (
      departSlot &&
      getDepartSlot(ride.departure_time) !== departSlot
    )
      return false;

    if (
      amenityChecks.instant_booking &&
      ride.instant_booking !== "yes"
    )
      return false;

    if (
      amenityChecks.smoking_allowed &&
      ride.smoking_allowed !== "yes"
    )
      return false;

    if (
      amenityChecks.pet_allowed &&
      ride.pet_allowed !== "yes"
    )
      return false;

    if (
      amenityChecks.max_two_in_back &&
      ride.max_two_in_back !== "yes"
    )
      return false;

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "lowest") {
      return (
        Number(a.price_per_seat) -
        Number(b.price_per_seat)
      );
    }

    if (sortBy === "shortest") {
      return (
        a.duration_seconds -
        b.duration_seconds
      );
    }

    return (a.departure_time || "").localeCompare(
      b.departure_time || ""
    );
  });

  const groups = groupByDate(
    sorted.slice(0, visibleCount)
  );

  return {
    apiLoading,
    filterLoading,
    apiError,

    sortBy,
    departSlot,
    amenityChecks,
    verifiedOnly,
    visibleCount,

    sorted,
    groups,

    isLoading:
      apiLoading || filterLoading,

    handleSetSortBy,
    handleSetDepartSlot,
    handleSetVerifiedOnly,
    handleSetAmenityChecks,

    clearAll,
    setVisibleCount,
  };
}