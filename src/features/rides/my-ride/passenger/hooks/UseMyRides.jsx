"use client";

import { showAlert } from "@/lib/toast";
import { cancelBookingApi } from "@/services/client/rideService";
import { useEffect, useMemo, useState } from "react";

/* ---------- helpers ---------- */

// "Jaydev Vihar, Bhubaneswar, Odisha, India" -> "Jaydev Vihar"
function getFirstLocationPart(address) {
  if (!address) return "";
  return address.split(",")[0].trim();
}

// "2026-08-27T18:30:00.000Z" -> "27 August 2026"
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "05:55:00" -> "5:55 AM"
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return "";
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${ampm}`;
}

// 828 -> "13m", 5400 -> "1h 30m"
function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "";
  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Normalizes a raw booking object from the API into the shape
 * used by RideCard / RideDetailsModal.
 */
export function mapBookingToRide(booking) {
  if (!booking) return null;

  return {
    id: booking.booking_id,
    bookingCode: booking.booking_code,
    rideId: booking.ride_id,

    // locations
    from: getFirstLocationPart(booking.ride_source),
    to: getFirstLocationPart(booking.ride_destination),
    fromAddress: booking.ride_source || "",
    toAddress: booking.ride_destination || "",
    fromLat: booking.ride_source_lat,
    fromLng: booking.ride_source_lng,
    toLat: booking.ride_destination_lat,
    toLng: booking.ride_destination_lng,

    // schedule
    date: formatDate(booking.ride_date),
    rawDate: booking.ride_date, // raw ISO date, needed for Track button logic
    departureTime: formatTime(booking.departure_time),
    arrivalTime: formatTime(booking.estimated_reach_time),
    duration: formatDuration(booking.duration_seconds),

    // status — shown exactly as received from the API
    status: booking.ride_status || "",
    bookingStatus: booking.booking_status || "",
    paymentStatus: booking.payment_status || "",
    cancelReason: booking?.reason_of_cancel || "",

    // booking
    seats: booking.seats,
    passengers: booking.seats,
    pricePerSeat: booking.price_per_seat,
    price: booking.total_price ?? booking.price_per_seat,
    bookedAt: booking.booked_at,

    // driver + vehicle
    driver: {
      id: booking.driver_id,
      name: booking.driver_name || "N/A",
      phone: booking.driver_phone || "",
      avatar: booking.driver_profile_picture || "/default-avatar.png",
      car: [booking.vehicle_brand, booking.vehicle_model]
        .filter(Boolean)
        .join(" "),
      registrationNumber: booking.vehicle_registration_number || "",
      color: booking.vehicle_color || "",
      fuelType: booking.vehicle_fuel_type || "",
      vehicleType: booking.vehicle_type || "",
      rating: booking.driver_rating ?? null,
    },
  };
}

/**
 * Buckets normalized rides into tabs.
 * "all" holds every ride; the rest are mutually exclusive,
 * driven off ride_status (with a booking_status cancelled override).
 */
function groupRidesIntoTabs(rides) {
  const groups = {
    all: [],
    upcoming: [],
    ongoing: [],
    expired: [],
    cancelled: [],
    completed: [],
  };

  rides.forEach((ride) => {
    groups.all.push(ride);

    const bookingStatus = (ride.bookingStatus || "").toLowerCase();
    const rideStatus = (ride.status || "").toLowerCase();

    if (bookingStatus === "cancelled" || rideStatus === "cancelled") {
      groups.cancelled.push(ride);
    } else if (bookingStatus === "completed") {
      groups.completed.push(ride);
    } else if (bookingStatus === "expired") {
      groups.expired.push(ride);
    } else if (bookingStatus === "ongoing") {
      groups.ongoing.push(ride);
    } else {
      // scheduled / confirmed / anything else pending departure
      groups.upcoming.push(ride);
    }
  });

  return groups;
}

export function getStatusColor(status) {
  switch ((status || "").toLowerCase()) {
    case "pending":
    case "waiting for approval":
      return "#ff9d00";
    case "confirmed":
      return "#16a34a";
    case "ongoing":
      return "rgb(194, 65, 12);";
    case "expired":
      return "#57534e";
    case "completed":
      return "#64748b";
    case "cancelled":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}

export function useMyRides(userRides = []) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRide, setSelectedRide] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // ride currently in the cancel-confirmation modal
  const [rideToCancel, setRideToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  // local, mutable copy so a successful cancel reflects immediately
  // in the UI without needing the parent to refetch
  const [rides, setRides] = useState(() =>
    (userRides || []).map(mapBookingToRide).filter(Boolean),
  );

  useEffect(() => {
    setRides((userRides || []).map(mapBookingToRide).filter(Boolean));
  }, [userRides]);

  const groupedRides = useMemo(() => groupRidesIntoTabs(rides), [rides]);

  const getRidesData = () => groupedRides[activeTab] || [];

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedRide(null);
  };

  const handleOpenCancel = (ride) => {
    setCancelError("");
    setRideToCancel(ride);
  };

  const handleCloseCancel = () => {
    if (isCancelling) return; // don't let the overlay close mid-request
    setRideToCancel(null);
    setCancelError("");
  };

const handleConfirmCancel = async (reason) => {
  if (!rideToCancel) return;

  setIsCancelling(true);
  setCancelError("");

  try {
    await cancelBookingApi({
      bookingId: rideToCancel.id,
      cancelReason: reason,
    });

    console.log("CANCEL API SUCCESS");

    setRides((prev) =>
      prev.map((r) =>
        r.id === rideToCancel.id
          ? {
              ...r,
              status: "cancelled",
              bookingStatus: "cancelled",
              cancelReason: reason,
            }
          : r,
      ),
    );

    setRideToCancel(null);

    // IMPORTANT: call toast after closing the modal
    setTimeout(() => {
      console.log("SHOWING CANCEL TOAST");
      showAlert("success", "Ride cancelled successfully.");
    }, 100);

  } catch (err) {
    console.error("CANCEL API ERROR:", err);

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Something went wrong while cancelling this ride. Please try again.";

    setCancelError(message);

    setTimeout(() => {
      showAlert("error", message);
    }, 100);
  } finally {
    setIsCancelling(false);
  }
};

  return {
    activeTab,
    setActiveTab,
    selectedRide,
    openDetailsModal,
    groupedRides,
    getRidesData,
    handleViewDetails,
    handleCloseDetails,
    rideToCancel,
    isCancelling,
    cancelError,
    handleOpenCancel,
    handleCloseCancel,
    handleConfirmCancel,
  };
}
