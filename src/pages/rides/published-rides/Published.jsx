"use client";

import { useState } from "react";
import "../../../styles/ride-published.css";

/* ─── Mock Data ──────────────────────────────────────────── */

const initialRides = [
  {
    id: "RD-1001",
    from: "Mumbai",
    fromAddress: "Dadar Station, Mumbai",
    to: "Pune",
    toAddress: "Shivaji Nagar, Pune",
    date: "June 30, 2026",
    time: "08:00 AM",
    totalSeats: 4,
    bookedSeats: 4,
    pricePerSeat: 600,
    status: "ready",
    vehicle: "Honda City – MH 01 AB 1234",
    passengers: [
      { name: "Rahul S.", seat: 1, paid: true, avatar: "RS" },
      { name: "Priya M.", seat: 2, paid: true, avatar: "PM" },
      { name: "Arjun K.", seat: 3, paid: true, avatar: "AK" },
      { name: "Sneha R.", seat: 4, paid: false, avatar: "SR" },
    ],
  },
  {
    id: "RD-1002",
    from: "Delhi",
    fromAddress: "Kashmere Gate, Delhi",
    to: "Agra",
    toAddress: "Taj Mahal Road, Agra",
    date: "July 2, 2026",
    time: "06:00 AM",
    totalSeats: 3,
    bookedSeats: 2,
    pricePerSeat: 450,
    status: "upcoming",
    vehicle: "Swift Dzire – DL 10 CD 5678",
    passengers: [
      { name: "Karan T.", seat: 1, paid: true, avatar: "KT" },
      { name: "Meera V.", seat: 2, paid: true, avatar: "MV" },
    ],
  },
  {
    id: "RD-1003",
    from: "Bangalore",
    fromAddress: "MG Road, Bangalore",
    to: "Mysore",
    toAddress: "Mysore Palace Road",
    date: "June 15, 2026",
    time: "09:30 AM",
    totalSeats: 3,
    bookedSeats: 3,
    pricePerSeat: 350,
    status: "completed",
    vehicle: "Honda City – KA 05 EF 9012",
    passengers: [
      { name: "Amit P.", seat: 1, paid: true, avatar: "AP" },
      { name: "Divya S.", seat: 2, paid: true, avatar: "DS" },
      { name: "Rohan N.", seat: 3, paid: true, avatar: "RN" },
    ],
  },
  {
    id: "RD-1004",
    from: "Hyderabad",
    fromAddress: "Secunderabad Station",
    to: "Vijayawada",
    toAddress: "Benz Circle, Vijayawada",
    date: "July 5, 2026",
    time: "07:00 AM",
    totalSeats: 4,
    bookedSeats: 1,
    pricePerSeat: 520,
    status: "upcoming",
    vehicle: "Maruti Ertiga – TS 09 GH 3456",
    passengers: [{ name: "Lakshmi K.", seat: 1, paid: true, avatar: "LK" }],
  },
  {
    id: "RD-1005",
    from: "Chennai",
    fromAddress: "Chennai Central",
    to: "Pondicherry",
    toAddress: "White Town, Pondicherry",
    date: "June 10, 2026",
    time: "08:00 AM",
    totalSeats: 3,
    bookedSeats: 2,
    pricePerSeat: 280,
    status: "cancelled",
    vehicle: "Swift Dzire – TN 22 IJ 7890",
    passengers: [
      { name: "Arun M.", seat: 1, paid: true, avatar: "AM" },
      { name: "Kavya P.", seat: 2, paid: false, avatar: "KP" },
    ],
  },
];

const STATUS_FILTERS = [
  "All",
  "Upcoming",
  "Ready to Depart",
  "Completed",
  "Cancelled",
];

const STATUS_META = {
  upcoming: { label: "Upcoming", color: "blue" },
  ready: { label: "Ready to Depart", color: "green" },
  ongoing: { label: "Ongoing", color: "orange" },
  completed: { label: "Completed", color: "grey" },
  cancelled: { label: "Cancelled", color: "red" },
};

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

function RideDetailModal({ ride, onClose, onCancel, onStart }) {
  const earned =
    ride.passengers.filter((p) => p.paid).length * ride.pricePerSeat;

  return (
    <div className="ride-publish-modal-backdrop" onClick={onClose}>
      <div className="ride-publish-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ride-publish-modal-header">
          <div>
            <p className="ride-publish-modal-id">{ride.id}</p>
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
              <div className="ride-publish-modal-stop-dot ride-publish-modal-stop-dot-start" />
              <div>
                <p className="ride-publish-modal-city">{ride.from}</p>
                <p className="ride-publish-modal-addr">{ride.fromAddress}</p>
                <p className="ride-publish-modal-time-tag">{ride.time}</p>
              </div>
            </div>
            <div className="ride-publish-modal-route-line" />
            <div className="ride-publish-modal-stop">
              <div className="ride-publish-modal-stop-dot ride-publish-modal-stop-dot-end" />
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
                {ride.passengers.map((p, i) => (
                  <div key={i} className="ride-publish-modal-pax-row">
                    <div className="ride-publish-avatar">{p.avatar}</div>
                    <div className="ride-publish-modal-pax-info">
                      <span className="ride-publish-modal-pax-name">
                        {p.name}
                      </span>
                      <span className="ride-publish-modal-pax-seat">
                        Seat {p.seat}
                      </span>
                    </div>
                    <span
                      className={`ride-publish-pax-paid ${p.paid ? "ride-publish-pax-paid-yes" : "ride-publish-pax-paid-no"}`}
                    >
                      {p.paid ? "✓ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
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
          {(ride.status === "upcoming" || ride.status === "ready") && (
            <button
              className="ride-publish-modal-btn-cancel"
              onClick={() => onCancel(ride.id)}
            >
              Cancel Ride
            </button>
          )}
          {ride.status === "ready" && (
            <button
              className="ride-publish-modal-btn-start"
              onClick={() => onStart(ride.id)}
            >
              🚗 Start Ride
            </button>
          )}
          {ride.status === "upcoming" && (
            <button className="ride-publish-modal-btn-edit">
              ✏️ Edit Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function PublishedRides() {
  const [rides, setRides] = useState(initialRides);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRide, setSelectedRide] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const filtered = rides.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return r.status === "upcoming";
    if (activeFilter === "Ready to Depart") return r.status === "ready";
    if (activeFilter === "Completed") return r.status === "completed";
    if (activeFilter === "Cancelled") return r.status === "cancelled";
    return true;
  });

  const handleCancel = (id) => {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
    );
    setSelectedRide(null);
    setConfirmCancel(null);
  };

  const handleStart = (id) => {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "ongoing" } : r)),
    );
    setSelectedRide(null);
  };

  // counts for tabs
  const counts = {
    All: rides.length,
    Upcoming: rides.filter((r) => r.status === "upcoming").length,
    "Ready to Depart": rides.filter((r) => r.status === "ready").length,
    Completed: rides.filter((r) => r.status === "completed").length,
    Cancelled: rides.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="ride-publish-root">
      {/* ── Page Header ── */}
      <div className="ride-publish-header">
        <div className="ride-publish-header-inner">
          <div className="ride-publish-header-left">
            <span className="ride-publish-header-eyebrow">
              Driver Dashboard
            </span>
            <h1 className="ride-publish-header-title">Published Rides</h1>
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
            <span className="ride-publish-summary-val">{rides.length}</span>
            <span className="ride-publish-summary-label">Total Published</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val">
              {rides.reduce((a, r) => a + r.bookedSeats, 0)}
            </span>
            <span className="ride-publish-summary-label">Seats Booked</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val ride-publish-summary-val-green">
              ₹
              {rides
                .filter((r) => r.status !== "cancelled")
                .reduce((a, r) => a + r.bookedSeats * r.pricePerSeat, 0)
                .toLocaleString("en-IN")}
            </span>
            <span className="ride-publish-summary-label">Total Earned</span>
          </div>
          <div className="ride-publish-summary-divider" />
          <div className="ride-publish-summary-item">
            <span className="ride-publish-summary-val ride-publish-summary-val-orange">
              {
                rides.filter(
                  (r) => r.status === "upcoming" || r.status === "ready",
                ).length
              }
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="ride-publish-empty-title">No rides found</h3>
              <p className="ride-publish-empty-sub">
                You haven't published any{" "}
                {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} rides
                yet.
              </p>
              <a href="/offer-ride" className="ride-publish-empty-btn">
                Post Your First Ride
              </a>
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

                return (
                  <div
                    key={ride.id}
                    className={`ride-publish-card ride-publish-card-${meta.color}`}
                  >
                    {/* Card top bar */}
                    <div className="ride-publish-card-topbar">
                      <span className="ride-publish-card-id">{ride.id}</span>
                      <span
                        className={`ride-publish-status-badge ride-publish-status-badge-${meta.color}`}
                      >
                        {meta.color === "green" && (
                          <span className="ride-publish-status-pulse" />
                        )}
                        {meta.label}
                      </span>
                    </div>

                    {/* Route */}
                    <div className="ride-publish-card-route">
                      <div className="ride-publish-card-city-block">
                        <div className="ride-publish-route-dot ride-publish-route-dot-from" />
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
                        <div className="ride-publish-route-dot ride-publish-route-dot-to" />
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
                          <button className="ride-publish-action-btn ride-publish-action-btn-edit">
                            Edit Ride
                          </button>
                          <button
                            className="ride-publish-action-btn ride-publish-action-btn-cancel"
                            onClick={() => setConfirmCancel(ride.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {ride.status === "ready" && (
                        <>
                          <button
                            className="ride-publish-action-btn ride-publish-action-btn-start"
                            onClick={() => handleStart(ride.id)}
                          >
                            🚗 Start Ride
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
                          🟢 Ride in Progress
                        </button>
                      )}

                      {ride.status === "completed" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-completed"
                          disabled
                        >
                          ✓ Completed
                        </button>
                      )}

                      {ride.status === "cancelled" && (
                        <button
                          className="ride-publish-action-btn ride-publish-action-btn-cancelled"
                          disabled
                        >
                          ✕ Cancelled
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
          onCancel={(id) => setConfirmCancel(id)}
          onStart={handleStart}
        />
      )}

      {/* ── Cancel Confirm Dialog ── */}
      {confirmCancel && (
        <div
          className="ride-publish-modal-backdrop"
          onClick={() => setConfirmCancel(null)}
        >
          <div
            className="ride-publish-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ride-publish-confirm-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="ride-publish-confirm-title">Cancel this ride?</h3>
            <p className="ride-publish-confirm-text">
              All passengers will be notified and refunded automatically. This
              action cannot be undone.
            </p>
            <div className="ride-publish-confirm-actions">
              <button
                className="ride-publish-confirm-btn-no"
                onClick={() => setConfirmCancel(null)}
              >
                Keep Ride
              </button>
              <button
                className="ride-publish-confirm-btn-yes"
                onClick={() => handleCancel(confirmCancel)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
