"use client";

import { useMemo, useState } from "react";

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
  console.log("ride details", booking);

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
    departureTime: formatTime(booking.departure_time),
    arrivalTime: formatTime(booking.estimated_reach_time),
    duration: formatDuration(booking.duration_seconds),

    // status — shown exactly as received from the API
    status: booking.ride_status || "",
    bookingStatus: booking.booking_status || "",
    paymentStatus: booking.payment_status || "",

    // booking
    seats: booking.seats,
    passengers: booking.seats,
    pricePerSeat: booking.price_per_seat,
    price: booking.total_price ?? booking.price_per_seat,
    bookedAt: booking.booked_at,
// schedule
    date: formatDate(booking.ride_date),
    rawDate: booking.ride_date, // <-- ADD THIS: raw ISO date, needed for Track button logic
    departureTime: formatTime(booking.departure_time),
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
      // API sample has no driver rating field — guard for it if it's added later
      rating: booking.driver_rating ?? null,
    },
  };
}

/**
 * Buckets normalized rides into tabs.
 * Adjust the status strings here if your backend uses different values.
 */
function groupRidesIntoTabs(rides) {
  const groups = { upcoming: [], completed: [], cancelled: [] };

  rides.forEach((ride) => {
    const bookingStatus = (ride.bookingStatus || "").toLowerCase();
    const rideStatus = (ride.status || "").toLowerCase();

    if (bookingStatus === "cancelled" || rideStatus === "cancelled") {
      groups.cancelled.push(ride);
    } else if (bookingStatus === "pending") {
      groups.requests.push(ride);
    } else if (rideStatus === "completed") {
      groups.completed.push(ride);
    } else {
      // scheduled / ongoing / confirmed etc.
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
    case "approved":
      return "#9500ff";
    case "scheduled":
      return "#15803d";
    case "ongoing":
    case "in_progress":
      return "#1b70ff";
    case "completed":
      return " #2563eb";
    case "cancelled":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export function useMyRides(userRides = []) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRide, setSelectedRide] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const normalizedRides = useMemo(
    () => (userRides || []).map(mapBookingToRide).filter(Boolean),
    [userRides],
  );

  const groupedRides = useMemo(
    () => groupRidesIntoTabs(normalizedRides),
    [normalizedRides],
  );

  const getRidesData = () => groupedRides[activeTab] || [];

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedRide(null);
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
  };
}
