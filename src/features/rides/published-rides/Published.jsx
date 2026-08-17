"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Alert, Snackbar } from "@mui/material";
import "../../../styles/ride-published.css";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";

import { BsCheck2Circle } from "react-icons/bs";
import { FaHourglassEnd } from "react-icons/fa";
import { FiAlertTriangle, FiPhone } from "react-icons/fi";
import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/lib/socket";
import { FaAngleRight } from "react-icons/fa6";
import Link from "next/link";
import { cancelRideApi, startRideApi } from "@/services/client/rideService";

const STATUS_FILTERS = [
  "All",
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Expired",
];

const STATUS_META = {
  upcoming: { label: "Upcoming", color: "blue" },
  ongoing: { label: "Ongoing", color: "orange" },
  completed: { label: "Completed", color: "grey" },
  cancelled: { label: "Cancelled", color: "red" },
  expired: { label: "Expired", color: "slate" }, // new
};

/* ─── API → UI mapping helpers ──────────────────────────────────────── */
function formatDuration(seconds) {
  if (seconds === undefined || seconds === null) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
function getInitials(name) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function extractCityFromAddress(address) {
  if (!address) return "";
  return address.split(",")[0].trim();
}

function formatApiDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatApiTime(timeStr) {
  if (!timeStr) return "";
  const [hStr, m] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${period}`;
}

// Status now comes straight from the API — no derived/guessed values.
// "scheduled" is normalized to "upcoming" for the UI; anything else the
// API sends (ongoing / completed / cancelled) is used as-is.
function normalizeApiStatus(apiStatus) {
  const s = String(apiStatus || "").toLowerCase();
  if (s === "scheduled") return "upcoming";
  if (
    ["upcoming", "ongoing", "completed", "cancelled", "expired"].includes(s)
  ) {
    return s;
  }
  return "upcoming";
}

// Start Ride is only enabled once today's date is on/after the ride's
// date (time of day is ignored — the button unlocks the moment the date
// rolls over, e.g. ride on 13-08-2026 09:50 AM becomes startable as soon
// as it's 13-08-2026, not 5 minutes before departure).
function canStartToday(rideDateStr) {
  if (!rideDateStr) return false;
  const rideDate = new Date(rideDateStr);
  if (isNaN(rideDate.getTime())) return false;

  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const rideDateOnly = new Date(
    rideDate.getFullYear(),
    rideDate.getMonth(),
    rideDate.getDate(),
  );
  return todayOnly >= rideDateOnly;
}

function mapApiPassengers(bookingDetails) {
  if (!Array.isArray(bookingDetails)) return [];
  let seatCursor = 0;
  return bookingDetails.map((b) => {
    const seatsBooked = b.booked_seats || 1;
    const seat = seatCursor + 1;
    seatCursor += seatsBooked;
    return {
      name: b.passenger_name,
      seat,
      seatsBooked,
      phone: b.passenger_phone,
      amount: b.total_price,
      paid: b.payment_status === "paid",
      avatar: getInitials(b.passenger_name),
    };
  });
}

function mapApiRideToUIRide(apiRide) {
  return {
    id: apiRide.id,
    from: extractCityFromAddress(apiRide.source_address),
    fromAddress: apiRide.source_address,
    to: extractCityFromAddress(apiRide.destination_address),
    toAddress: apiRide.destination_address,
    date: formatApiDate(apiRide.ride_date),
    rideDateRaw: apiRide.ride_date,
    time: formatApiTime(apiRide.departure_time),
    arrivalTime: formatApiTime(apiRide.estimated_reach_time), // ← new
    duration: formatDuration(apiRide.duration_seconds), // ← new
    totalSeats: apiRide.total_seats,
    bookedSeats: apiRide.total_seats - apiRide.available_seats,
    pricePerSeat: Number(apiRide.price_per_seat),
    status: normalizeApiStatus(apiRide.status),
    vehicle: `${apiRide.model} – ${apiRide.registration_number}`,
    passengers: mapApiPassengers(apiRide.bookingDetails),
  };
}

function buildRidesFromApi(apiData) {
  const apiRides = apiData?.rides;
  if (!Array.isArray(apiRides)) return [];
  return apiRides.map(mapApiRideToUIRide);
}

/* ─── Helpers ────────────────────────────────────────────── */

function SeatMap({ total, booked }) {
  return (
    <div className="ride-publish-seat-map">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`ride-publish-seat-dot ${i < booked ? "ride-publish-seat-dot-filled" : "ride-publish-seat-dot-empty"}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function PassengerAvatar({ initials, paid }) {
  return (
    <div className="ride-publish-avatar-wrap">
      <div className="ride-publish-avatar">{initials}</div>
      <span
        className={`ride-publish-avatar-dot ${paid ? "ride-publish-avatar-dot-paid" : "ride-publish-avatar-dot-unpaid"}`}
      />
    </div>
  );
}

/* ─── Detail Modal ───────────────────────────────────────── */

// onStart here is a *request* to confirm, not the actual start call —
// the parent shows a confirm dialog and only calls the API after "Yes".
function RideDetailModal({ ride, onClose, onRequestCancel, onRequestStart }) {
  const [expandedPax, setExpandedPax] = useState(null);
  console.log("ride datassss alll", ride);

  const earned =
    ride.passengers.filter((p) => p.paid).length * ride.pricePerSeat;
  const startEnabled = canStartToday(ride.rideDateRaw);

  return (
    <div className="ride-publish-modal-backdrop" onClick={onClose}>
      <div className="ride-publish-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ride-publish-modal-header">
          <div>
            {/* <p className="ride-publish-modal-id">{ride.id}</p> */}
            <h2 className="ride-publish-modal-title">
              {ride.from} → {ride.to}
            </h2>
          </div>
          <button className="ride-publish-modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ride-publish-modal-body">
          {/* Route */}
          <div className="ride-publish-modal-route">
            <div className="ride-publish-modal-stop">
              <IoLocationOutline className="step-icon start" />
              <div>
                <p className="ride-publish-modal-city">{ride.from}</p>
                <p className="ride-publish-modal-addr">{ride.fromAddress}</p>
                <p className="ride-publish-modal-time-tag">{ride.duration}</p>
              </div>
            </div>
            <div className="ride-publish-modal-route-line" />
            <div className="ride-publish-modal-stop">
              <FaLocationDot className="step-icon end" />
              <div>
                <p className="ride-publish-modal-city">{ride.to}</p>
                <p className="ride-publish-modal-addr">{ride.toAddress}</p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="ride-publish-modal-info-grid">
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">Date</span>
              <span className="ride-publish-modal-info-val">{ride.date}</span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">Vehicle</span>
              <span className="ride-publish-modal-info-val">
                {ride.vehicle}
              </span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">
                Price / Seat
              </span>
              <span className="ride-publish-modal-info-val">
                ₹{ride.pricePerSeat}
              </span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">
                Seats Filled
              </span>
              <span className="ride-publish-modal-info-val">
                {ride.bookedSeats} / {ride.totalSeats}
              </span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">
                Departure Time
              </span>
              <span className="ride-publish-modal-info-val">{ride.time}</span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">
                Estimated Arrival
              </span>
              <span className="ride-publish-modal-info-val">
                {ride.arrivalTime}
              </span>
            </div>
            <div className="ride-publish-modal-info-item">
              <span className="ride-publish-modal-info-label">Duration</span>
              <span className="ride-publish-modal-info-val">
                {ride.duration}
              </span>
            </div>
          </div>

          {/* Passengers */}
          <div className="ride-publish-modal-section">
            <h3 className="ride-publish-modal-section-title">
              Booked Passengers
            </h3>

            {ride.passengers.length === 0 ? (
              <p className="ride-publish-modal-empty">No passengers yet.</p>
            ) : (
              <div className="ride-publish-modal-pax-list">
                {ride.passengers.map((p, i) => {
                  const expanded = expandedPax === i;

                  return (
                    <div
                      key={i}
                      className="ride-publish-modal-pax-row ride-details-things-pax-row"
                    >
                      <div
                        className="ride-details-things-pax-header"
                        onClick={() => setExpandedPax(expanded ? null : i)}
                      >
                        <div className="ride-publish-avatar">{p.avatar}</div>

                        <div className="ride-publish-modal-pax-info">
                          <span className="ride-publish-modal-pax-name">
                            {p.name}
                          </span>
                        </div>

                        <Link
                          className="ride-publish-modal-pax-seat"
                          href="/driver/chats"
                        >
                          Chat
                        </Link>

                        <span
                          className={`ride-publish-pax-paid ${
                            p.paid
                              ? "ride-publish-pax-paid-yes"
                              : "ride-publish-pax-paid-no"
                          }`}
                        >
                          {p.paid ? (
                            <>
                              <BsCheck2Circle />
                              <span>Paid</span>
                            </>
                          ) : (
                            <>
                              <FaHourglassEnd />
                              <span>Pending</span>
                            </>
                          )}
                        </span>

                        <FaAngleRight
                          className={`ride-details-things-arrow ${
                            expanded ? "ride-details-things-arrow-expanded" : ""
                          }`}
                        />
                      </div>

                      {expanded && (
                        <div className="ride-details-things-expanded">
                          <div className="ride-details-things-info">
                            <span className="ride-details-things-label">
                              Phone
                            </span>

                            <span className="ride-details-things-value">
                              {/* <FiPhone size={13} color="#1e40af" /> */}
                              {p.phone}
                            </span>
                          </div>

                          <div className="ride-details-things-info">
                            <span className="ride-details-things-label">
                              Seats Booked
                            </span>

                            <span className="ride-details-things-value">
                              {p.seatsBooked}
                            </span>
                          </div>

                          <div className="ride-details-things-info">
                            <span className="ride-details-things-label">
                              Amount Received
                            </span>

                            <span className="ride-details-things-value">
                              {p.amount}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Earnings summary */}
          <div className="ride-publish-modal-earn-box">
            <span className="ride-publish-modal-earn-label">
              Confirmed Earnings
            </span>
            <span className="ride-publish-modal-earn-val">
              ₹{earned.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="ride-publish-modal-footer">
          {ride.status === "upcoming" && (
            <>
              <button
                className="ride-publish-modal-btn-cancel"
                onClick={() => onRequestCancel(ride.id)}
              >
                Cancel Ride
              </button>
              <button
                className="ride-publish-modal-btn-start"
                disabled={!startEnabled}
                title={
                  startEnabled
                    ? ""
                    : "You can start this ride on the scheduled date"
                }
                onClick={() => onRequestStart(ride.id)}
              >
                Start Ride
              </button>
              {/* <button className="ride-publish-modal-btn-edit">Edit Ride</button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function PublishedRides({ publishedRide }) {
  console.log("published ride", publishedRide);
  useSocket();
  const router = useRouter();

  const [rides, setRides] = useState(() => buildRidesFromApi(publishedRide));
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRide, setSelectedRide] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [confirmStart, setConfirmStart] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const toastTimerRef = useRef(null);

  useEffect(() => {
    setRides(buildRidesFromApi(publishedRide));
  }, [publishedRide]);

  // Join a socket room for every ride this driver is viewing
  useEffect(() => {
    const joinAll = () => {
      rides.forEach((ride) => {
        socket.emit("join_ride", ride.id);
      });
    };

    if (socket.connected) joinAll();
    socket.on("connect", joinAll);
    return () => socket.off("connect", joinAll);
  }, [rides]);

  // Live seat updates: patch the matching ride in place, no refetch needed
  useEffect(() => {
    const handleRideUpdate = (data) => {
      console.log("🔥 ride-seat-updated payload:", data);
      setRides((prev) =>
        prev.map((r) => {
          if (String(r.id) !== String(data.id)) return r;
          const booked = r.totalSeats - data.available_seats;
          return { ...r, bookedSeats: booked };
        }),
      );
    };

    socket.on("ride-seat-updated", handleRideUpdate);
    return () => {
      socket.off("ride-seat-updated", handleRideUpdate);
    };
  }, []);

  const filtered = rides.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return r.status === "upcoming";
    if (activeFilter === "Ongoing") return r.status === "ongoing";
    if (activeFilter === "Completed") return r.status === "completed";
    if (activeFilter === "Cancelled") return r.status === "cancelled";
    if (activeFilter === "Expired") return r.status === "expired";
    return true;
  });

  // Close toast helper
  const closeToast = () => setToast((p) => ({ ...p, open: false }));

  // Show toast helper
  const showToast = (message, type = "success") => {
    clearTimeout(toastTimerRef.current);
    setToast({ open: true, message, type });
  };

  // Actual API call — only fires after the cancel confirm dialog says "Yes"
  // Now shows toast first, then executes after 2 seconds
  const handleCancel = (id) => {
    // Show toast immediately
    showToast("Ride cancelled", "error");

    // Close the confirm dialog immediately
    setConfirmCancel(null);

    // Execute the API call after 2 seconds
    toastTimerRef.current = setTimeout(async () => {
      try {
        await cancelRideApi(id, { reason: cancelReason });
        setRides((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
        );
      } catch (err) {
        console.error("Failed to cancel ride:", err);
        showToast("Failed to cancel ride", "error");
      } finally {
        setSelectedRide(null);
        setCancelReason("");
      }
    }, 2000);
  };

  // Actual API call — only fires after the start confirm dialog says "Yes"
  // Now shows toast first, then executes after 2 seconds
  const handleStart = (id) => {
    // Show toast immediately
    showToast("Ride started", "success");

    // Close the confirm dialog immediately
    setConfirmStart(null);

    // Execute the API call after 2 seconds
    toastTimerRef.current = setTimeout(async () => {
      try {
        await startRideApi(id);
        router.push("/driver/tracking");
      } catch (err) {
        console.error("Failed to start ride:", err);
        showToast("Failed to start ride", "error");
      }
    }, 2000);
  };

  // counts for tabs
  const counts = {
    All: rides.length,
    Upcoming: rides.filter((r) => r.status === "upcoming").length,
    Ongoing: rides.filter((r) => r.status === "ongoing").length,
    Completed: rides.filter((r) => r.status === "completed").length,
    Cancelled: rides.filter((r) => r.status === "cancelled").length,
    Expired: rides.filter((r) => r.status === "expired").length, // new
  };
  const rideBeingCancelled = rides.find((r) => r.id === confirmCancel);
  const rideBeingStarted = rides.find((r) => r.id === confirmStart);

  return (
    <div className="ride-publish-root">
      {/* ── Toast Alert ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          onClose={closeToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* ── Page Header ── */}
      <div className="ride-publish-header">
        <div className="ride-publish-header-inner">
          <div className="ride-publish-header-left">
            <span className="ride-publish-header-eyebrow">
              Driver Dashboard
            </span>
            <h1 className="ride-publish-header-title">My Rides</h1>
            <p className="ride-publish-header-sub">
              Manage all your posted rides, track seat bookings and earnings in
              real time
            </p>
          </div>
          <a href="/offer-ride" className="ride-publish-post-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Post a New Ride
          </a>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="ride-publish-summary-strip">
        <div className="ride-publish-summary-inner">
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val">
              {publishedRide?.total_rides}
            </span>
            <span className="ride-publish-summary-label">Total Published</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val">
              {publishedRide?.total_seat_booked}
            </span>
            <span className="ride-publish-summary-label">Seats Booked</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val ride-publish-summary-val-green">
              ₹{Number(publishedRide?.total_earning).toLocaleString("en-IN")}
            </span>
            <span className="ride-publish-summary-label">Total Earned</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val ride-publish-summary-val-orange">
              {counts.Ongoing}
            </span>
            <span className="ride-publish-summary-label">Active Rides</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ride-publish-body">
        <div className="ride-publish-wrapper">
          {/* ── Filter tabs ── */}
          <div className="ride-publish-filter-bar">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`ride-publish-filter-tab ${activeFilter === f ? "ride-publish-filter-tab-active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                <span
                  className={`ride-publish-filter-count ${activeFilter === f ? "ride-publish-filter-count-active" : ""}`}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* ── Ride cards ── */}
          {filtered.length === 0 ? (
            <div className="ride-publish-empty">
              <div className="ride-publish-empty-icon">
                <FiAlertCircle />
              </div>
              <h3 className="ride-publish-empty-title">No rides found</h3>
              <p className="ride-publish-empty-sub">
                You haven't published any{" "}
                {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} rides
                yet.
              </p>
            </div>
          ) : (
            <div className="ride-publish-grid">
              {filtered.map((ride) => {
                const remainingSeats = ride.totalSeats - ride.bookedSeats;
                const fillPercent = (ride.bookedSeats / ride.totalSeats) * 100;
                const earned =
                  ride.passengers.filter((p) => p.paid).length *
                  ride.pricePerSeat;
                const meta = STATUS_META[ride.status];
                const startEnabled = canStartToday(ride.rideDateRaw);

                return (
                  <div
                    key={ride.id}
                    className={`ride-publish-card ride-publish-card-${meta.color}`}
                  >
                    {/* Card top bar */}
                    <div className="ride-publish-card-topbar">
                      <span className="ride-publish-card-id">{ride.date}</span>
                      <span
                        className={`ride-publish-status-badge ride-publish-status-badge-${meta.color}`}
                      >
                        {meta.color === "orange" && (
                          <span className="ride-publish-status-pulse" />
                        )}
                        {meta.label}
                      </span>
                    </div>

                    {/* Route */}
                    <div className="ride-publish-card-route">
                      <div className="ride-publish-card-city-block">
                        <IoLocationOutline size={15} className="left-icon" />
                        <div>
                          <p className="ride-publish-card-city">{ride.from}</p>
                          <p className="ride-publish-card-addr">
                            {ride.fromAddress}
                          </p>
                        </div>
                      </div>
                      <div className="ride-publish-card-route-line">
                        <svg viewBox="0 0 40 12" fill="none">
                          <path
                            d="M0 6h36M30 1l6 5-6 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ride-publish-card-city-block ride-publish-card-city-block-right">
                        <FaLocationDot size={15} className="right-icon" />
                        <div>
                          <p className="ride-publish-card-city">{ride.to}</p>
                          <p className="ride-publish-card-addr">
                            {ride.toAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date / time / price row */}
                    <div className="ride-publish-card-meta-row">
                      <div className="ride-publish-card-meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {ride.date}
                      </div>
                      <div className="ride-publish-card-meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {ride.time}
                      </div>
                      <div className="ride-publish-card-meta-item ride-publish-card-meta-price">
                        ₹{ride.pricePerSeat} / seat
                      </div>
                    </div>

                    {/* Seat fill bar */}
                    <div className="ride-publish-card-seats-section">
                      <div className="ride-publish-card-seats-header">
                        <span className="ride-publish-card-seats-label">
                          Seat Availability
                        </span>
                        <span className="ride-publish-card-seats-count">
                          <span className="ride-publish-card-seats-booked">
                            {ride.bookedSeats} booked
                          </span>
                          {" · "}
                          <span
                            className={
                              remainingSeats === 0
                                ? "ride-publish-seats-full"
                                : "ride-publish-seats-left"
                            }
                          >
                            {remainingSeats === 0
                              ? "Full"
                              : `${remainingSeats} left`}
                          </span>
                        </span>
                      </div>

                      {/* progress bar */}
                      <div className="ride-publish-fill-track">
                        <div
                          className={`ride-publish-fill-bar ${fillPercent === 100 ? "ride-publish-fill-bar-full" : ""}`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>

                      {/* seat map */}
                      <SeatMap
                        total={ride.totalSeats}
                        booked={ride.bookedSeats}
                      />
                    </div>

                    {/* Passengers row */}
                    {ride.passengers.length > 0 && (
                      <div className="ride-publish-card-pax-row">
                        <span className="ride-publish-card-pax-label">
                          Passengers
                        </span>
                        <div className="ride-publish-card-pax-avatars">
                          {ride.passengers.map((p, i) => (
                            <PassengerAvatar
                              key={i}
                              initials={p.avatar}
                              paid={p.paid}
                            />
                          ))}
                        </div>
                        <span className="ride-publish-card-pax-legend">
                          <span className="ride-publish-legend-dot ride-publish-legend-dot-paid" />{" "}
                          Paid
                          <span
                            className="ride-publish-legend-dot ride-publish-legend-dot-pending"
                            style={{ marginLeft: 8 }}
                          />{" "}
                          Pending
                        </span>
                      </div>
                    )}

                    {/* Earnings */}
                    {ride.status !== "cancelled" && (
                      <div className="ride-publish-card-earn-row">
                        <span className="ride-publish-card-earn-label">
                          Confirmed Earnings
                        </span>
                        <span className="ride-publish-card-earn-val">
                          ₹{earned.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="ride-publish-card-actions">
                      <button
                        className="ride-publish-action-btn ride-publish-action-btn-view"
                        onClick={() => setSelectedRide(ride)}
                      >
                        View Details
                      </button>

                      {ride.status === "upcoming" && (
                        <>
                          {/* <button className="ride-publish-action-btn ride-publish-action-btn-edit">
                            Edit Ride
                          </button> */}
                          <button
                            className="ride-publish-action-btn ride-publish-action-btn-start"
                            disabled={!startEnabled}
                            title={
                              startEnabled
                                ? ""
                                : "You can start this ride on the scheduled date"
                            }
                            style={{
                              opacity: startEnabled ? 1 : 0.5,
                              cursor: startEnabled ? "pointer" : "not-allowed",
                              pointerEvents: startEnabled ? "auto" : "none",
                            }}
                            onClick={() => setConfirmStart(ride.id)}
                          >
                            Start Ride
                          </button>
                          <button
                            className="ride-publish-action-btn ride-publish-action-btn-cancel"
                            onClick={() => setConfirmCancel(ride.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {ride.status === "ongoing" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-ongoing"
                          disabled
                        >
                          Ride in Progress
                        </button>
                      )}

                      {ride.status === "completed" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-completed"
                          disabled
                        >
                          Completed
                        </button>
                      )}

                      {ride.status === "cancelled" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-cancelled"
                          disabled
                        >
                          Cancelled
                        </button>
                      )}

                      {ride.status === "expired" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-expired"
                          disabled
                        >
                          Expired
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedRide && (
        <RideDetailModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onRequestCancel={(id) => {
            setSelectedRide(null);
            setConfirmCancel(id);
          }}
          onRequestStart={(id) => {
            setSelectedRide(null);
            setConfirmStart(id);
          }}
        />
      )}

      {/* ── Cancel Confirm Dialog ── */}
      {confirmCancel && (
        <div
          className="ride-publish-modal-backdrop"
          onClick={() => {
            setConfirmCancel(null);
            setCancelReason("");
          }}
        >
          <div
            className="ride-publish-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ride-publish-confirm-icon">
              <FiAlertTriangle />
            </div>
            <h3 className="ride-publish-confirm-title">Cancel this ride?</h3>
            <p className="ride-publish-confirm-text">
              {rideBeingCancelled
                ? `${rideBeingCancelled.from} → ${rideBeingCancelled.to} on ${rideBeingCancelled.date}. `
                : ""}
              All passengers will be notified and refunded automatically. This
              action cannot be undone.
            </p>

            {/* Reason Input Field */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                Reason for cancellation{" "}
                <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                placeholder="Please provide a reason for cancelling this ride..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{
                  width: "100%",
                  height: "80px",
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  resize: "none",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1e40af";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
              />
            </div>

            <div className="ride-publish-confirm-actions">
              <button
                className="ride-publish-confirm-btn-no"
                onClick={() => {
                  setConfirmCancel(null);
                  setCancelReason("");
                }}
              >
                Keep Ride
              </button>
              <button
                className="ride-publish-confirm-btn-yes"
                disabled={!cancelReason.trim()}
                style={{
                  opacity: !cancelReason.trim() ? 0.5 : 1,
                  cursor: !cancelReason.trim() ? "not-allowed" : "pointer",
                }}
                onClick={() => handleCancel(confirmCancel)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Start Confirm Dialog ── */}
      {confirmStart && (
        <div
          className="ride-publish-modal-backdrop"
          onClick={() => setConfirmStart(null)}
        >
          <div
            className="ride-publish-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ride-start-confirm-icon ride-publish-confirm-icon-start">
              <BsCheck2Circle />
            </div>
            <h3 className="ride-publish-confirm-title">Start this ride?</h3>
            <p className="ride-publish-confirm-text">
              {rideBeingStarted
                ? `${rideBeingStarted.from} → ${rideBeingStarted.to} at ${rideBeingStarted.time}. `
                : ""}
              Passengers will be notified you're on the way, and you'll be taken
              to live tracking.
            </p>
            <div className="ride-publish-confirm-actions">
              <button
                className="ride-publish-confirm-btn-no"
                onClick={() => setConfirmStart(null)}
              >
                Not Yet
              </button>
              <button
                className="ride-start-confirm-btn-yes ride-publish-confirm-btn-start"
                onClick={() => handleStart(confirmStart)}
              >
                Yes, Start Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
