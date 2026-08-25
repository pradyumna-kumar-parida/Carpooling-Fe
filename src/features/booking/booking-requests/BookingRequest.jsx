"use client";

import { useState } from "react";
import "../../../styles/booking-req.css";
import { FaCar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { BiGitPullRequest } from "react-icons/bi";


import { LiaUserCheckSolid } from "react-icons/lia";
import { GrMoney } from "react-icons/gr";
import { BsCheck2Circle } from "react-icons/bs";
import { FaCaretUp } from "react-icons/fa6";
import { LuMessageSquareMore } from "react-icons/lu";
import { FaRegCheckCircle } from "react-icons/fa";

import { FaCaretDown } from "react-icons/fa";

/* ─── Mock Data ──────────────────────────────────────────── */

const initialRequests = [
  {
    id: "BKR-2001",
    passenger: {
      name: "Rahul Sharma",
      avatar: "RS",
      rating: 4.8,
      totalRides: 23,
      verified: true,
      phone: "+91 98765 43210",
    },
    ride: {
      id: "RD-1002",
      from: "Delhi",
      to: "Agra",
      date: "July 2, 2026",
      time: "06:00 AM",
      totalSeats: 3,
      availableSeats: 1,
    },
    pickup: "Kashmere Gate Metro, Delhi",
    drop: "Taj Mahal East Gate, Agra",
    requestedSeats: 1,
    fare: 450,
    requestedAt: "June 28, 2026 · 10:32 AM",
    status: "pending",
    message: "Hi! I travel this route regularly. Will be on time.",
  },
  {
    id: "BKR-2002",
    passenger: {
      name: "Priya Mehta",
      avatar: "PM",
      rating: 4.9,
      totalRides: 41,
      verified: true,
      phone: "+91 91234 56789",
    },
    ride: {
      id: "RD-1002",
      from: "Delhi",
      to: "Agra",
      date: "July 2, 2026",
      time: "06:00 AM",
      totalSeats: 3,
      availableSeats: 1,
    },
    pickup: "Connaught Place, Delhi",
    drop: "Agra Cantt Station",
    requestedSeats: 2,
    fare: 900,
    requestedAt: "June 27, 2026 · 3:15 PM",
    status: "pending",
    message: "",
  },
  {
    id: "BKR-2003",
    passenger: {
      name: "Arjun Kapoor",
      avatar: "AK",
      rating: 4.6,
      totalRides: 12,
      verified: false,
      phone: "+91 87654 32109",
    },
    ride: {
      id: "RD-1004",
      from: "Hyderabad",
      to: "Vijayawada",
      date: "July 5, 2026",
      time: "07:00 AM",
      totalSeats: 4,
      availableSeats: 3,
    },
    pickup: "Secunderabad Station, Hyderabad",
    drop: "Benz Circle, Vijayawada",
    requestedSeats: 1,
    fare: 520,
    requestedAt: "June 28, 2026 · 9:00 AM",
    status: "approved",
    message: "Please confirm ASAP. Thank you!",
  },
  {
    id: "BKR-2004",
    passenger: {
      name: "Sneha Reddy",
      avatar: "SR",
      rating: 5.0,
      totalRides: 67,
      verified: true,
      phone: "+91 76543 21098",
    },
    ride: {
      id: "RD-1004",
      from: "Hyderabad",
      to: "Vijayawada",
      date: "July 5, 2026",
      time: "07:00 AM",
      totalSeats: 4,
      availableSeats: 3,
    },
    pickup: "HITEC City, Hyderabad",
    drop: "Vijayawada Bus Stand",
    requestedSeats: 2,
    fare: 1040,
    requestedAt: "June 27, 2026 · 6:45 PM",
    status: "pending",
    message: "Travelling with a colleague. Both female passengers.",
  },
  {
    id: "BKR-2005",
    passenger: {
      name: "Karan Tiwari",
      avatar: "KT",
      rating: 3.9,
      totalRides: 5,
      verified: false,
      phone: "+91 65432 10987",
    },
    ride: {
      id: "RD-1002",
      from: "Delhi",
      to: "Agra",
      date: "July 2, 2026",
      time: "06:00 AM",
      totalSeats: 3,
      availableSeats: 1,
    },
    pickup: "Lajpat Nagar, Delhi",
    drop: "Agra Fort, Agra",
    requestedSeats: 1,
    fare: 450,
    requestedAt: "June 26, 2026 · 11:20 AM",
    status: "rejected",
    message: "",
  },
  {
    id: "BKR-2006",
    passenger: {
      name: "Divya Nair",
      avatar: "DN",
      rating: 4.7,
      totalRides: 30,
      verified: true,
      phone: "+91 54321 09876",
    },
    ride: {
      id: "RD-1001",
      from: "Mumbai",
      to: "Pune",
      date: "June 30, 2026",
      time: "08:00 AM",
      totalSeats: 4,
      availableSeats: 0,
    },
    pickup: "Dadar Station, Mumbai",
    drop: "Hinjewadi, Pune",
    requestedSeats: 1,
    fare: 600,
    requestedAt: "June 25, 2026 · 2:00 PM",
    status: "approved",
    message: "Thank you for having me!",
  },
];

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

/* ─── Star Rating ────────────────────────────────────────── */

function StarRating({ rating }) {
  return (
    <div className="booking-req-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`booking-req-star ${rating >= s ? "booking-req-star-filled" : rating >= s - 0.5 ? "booking-req-star-half" : "booking-req-star-empty"}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="booking-req-rating-val">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ─── Request Card ───────────────────────────────────────── */

function RequestCard({ request, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const { passenger, ride, status } = request;

  return (
    <div className={`booking-req-card booking-req-card-${status}`}>
      {/* ── Card header ── */}
      <div className="booking-req-card-header">
        <div className="booking-req-passenger-row">
          {/* Avatar */}
          <div className="booking-req-avatar-wrap">
            <div className="booking-req-avatar">{passenger.avatar}</div>
            {passenger.verified && (
              <div className="booking-req-verified-badge">
                <div>
                  {" "}
                  <FaRegCheckCircle />
                </div>
              </div>
            )}
          </div>

          {/* Passenger info */}
          <div className="booking-req-passenger-info">
            <div className="booking-req-passenger-top">
              <span className="booking-req-passenger-name">
                {passenger.name}
              </span>
              {!passenger.verified && (
                <span className="booking-req-unverified-tag">Unverified</span>
              )}
            </div>
            <StarRating rating={passenger.rating} />
            <span className="booking-req-rides-count">
              {passenger.totalRides} rides taken
            </span>
          </div>
        </div>

        {/* Status + ID */}
        <div className="booking-req-card-topright">
          <span className="booking-req-id">{request.id}</span>
          <span
            className={`booking-req-status-badge booking-req-status-${status}`}
          >
            {status === "pending" && (
              <span className="booking-req-pending-dot" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* ── Ride tag ── */}
      <div className="booking-req-ride-tag">
        <FaCar />

        <span className="booking-req-ride-tag-text">
          Ride {ride.id} · {ride.from} → {ride.to}
        </span>
        <span className="booking-req-ride-tag-date">
          {ride.date} · {ride.time}
        </span>
      </div>

      {/* ── Route ── */}
      <div className="booking-req-route-block">
        <div className="booking-req-route-row">
          <IoLocationOutline  />
          <div className="booking-req-route-info">
            <span className="booking-req-route-label">Pickup</span>
            <span className="booking-req-route-place">{request.pickup}</span>
          </div>
        </div>
        <div className="booking-req-route-connector" />
        <div className="booking-req-route-row">
          <FaLocationDot  />
          <div className="booking-req-route-info">
            <span className="booking-req-route-label">Drop</span>
            <span className="booking-req-route-place">{request.drop}</span>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="booking-req-stats-row">
        <div className="booking-req-stat-pill">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          {request.requestedSeats} seat{request.requestedSeats > 1 ? "s" : ""}
        </div>
        <div className="booking-req-stat-pill booking-req-stat-pill-fare">
          ₹{request.fare.toLocaleString("en-IN")} total fare
        </div>
        <div className="booking-req-stat-pill booking-req-stat-pill-time">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {request.requestedAt}
        </div>
      </div>

      {/* ── Passenger message ── */}
      {request.message && (
        <div className="booking-req-message-box">
          <LuMessageSquareMore />

          <p className="booking-req-message-text">"{request.message}"</p>
        </div>
      )}

      {/* ── Expandable details ── */}
      <button
        className="booking-req-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            Hide details <FaCaretUp size={14} />
          </>
        ) : (
          <>
            View passenger details <FaCaretDown size={14} />
          </>
        )}
      </button>

      {expanded && (
        <div className="booking-req-expanded">
          <div className="booking-req-expanded-row">
            <span className="booking-req-expanded-label">Phone</span>
            <span className="booking-req-expanded-val">{passenger.phone}</span>
          </div>
          <div className="booking-req-expanded-row">
            <span className="booking-req-expanded-label">
              Seats available on ride
            </span>
            <span className="booking-req-expanded-val">
              {ride.availableSeats === 0 ? (
                <span className="booking-req-seats-full">Ride Full</span>
              ) : (
                `${ride.availableSeats} seat${ride.availableSeats > 1 ? "s" : ""} left`
              )}
            </span>
          </div>
          <div className="booking-req-expanded-row">
            <span className="booking-req-expanded-label">Verification</span>
            <span className="booking-req-expanded-val">
              {passenger.verified ? (
                <span className="booking-req-verified-text"> ID Verified</span>
              ) : (
                <span className="booking-req-unverified-text">
                  Not Verified
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      {status === "pending" && (
        <div className="booking-req-actions">
          <button
            className="booking-req-btn-reject"
            onClick={() => onReject(request.id)}
          >
            Reject
          </button>
          <button
            className="booking-req-btn-approve"
            onClick={() => onApprove(request.id)}
            disabled={ride.availableSeats < request.requestedSeats}
          >
            {ride.availableSeats < request.requestedSeats
              ? "No Seats Left"
              : "Approve"}
          </button>
        </div>
      )}

      {status === "approved" && (
        <div className="booking-req-approved-footer">
          <BsCheck2Circle />
          Booking confirmed · Payment held in escrow
        </div>
      )}

      {status === "rejected" && (
        <div className="booking-req-rejected-footer">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
          Request rejected · Passenger notified
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function BookingRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          status: "approved",
          ride: {
            ...r.ride,
            availableSeats: Math.max(
              0,
              r.ride.availableSeats - r.requestedSeats,
            ),
          },
        };
      }),
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  };

  const filtered =
    activeFilter === "All"
      ? requests
      : requests.filter((r) => r.status === activeFilter.toLowerCase());

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "pending").length,
    Approved: requests.filter((r) => r.status === "approved").length,
    Rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const totalFareApproved = requests
    .filter((r) => r.status === "approved")
    .reduce((a, r) => a + r.fare, 0);

  return (
    <div className="booking-req-root">
      {/* ── Page Header ── */}
      <div className="booking-req-header">
        <div className="booking-req-header-inner">
          <div className="booking-req-header-left">
        
            <h1 className="booking-req-header-title">Booking Requests</h1>
            <p className="booking-req-header-sub">
              Review and manage all passenger booking requests for your
              published rides
            </p>
          </div>
          <div className="booking-req-header-right">
            {counts.Pending > 0 && (
              <div className="booking-req-pending-alert">
                <span className="booking-req-pending-alert-dot" />
                <span>
                  {counts.Pending} request{counts.Pending > 1 ? "s" : ""}{" "}
                  awaiting your response
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="booking-req-summary-bar">
        <div className="booking-req-summary-inner">
          <div className="booking-req-summary-card">
            <div className="booking-req-summary-icon booking-req-summary-icon-blue">
<BiGitPullRequest />


            </div>
            <div className="booking-req-summary-text">
              <span className="booking-req-summary-val">{counts.All}</span>
              <span className="booking-req-summary-label">Total Requests</span>
            </div>
          </div>

          <div className="booking-req-summary-card">
            <div className="booking-req-summary-icon booking-req-summary-icon-orange">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="booking-req-summary-text">
              <span className="booking-req-summary-val">{counts.Pending}</span>
              <span className="booking-req-summary-label">Pending</span>
            </div>
          </div>

          <div className="booking-req-summary-card">
            <div className="booking-req-summary-icon booking-req-summary-icon-green">
              <LiaUserCheckSolid />
            </div>
            <div className="booking-req-summary-text">
              <span className="booking-req-summary-val">{counts.Approved}</span>
              <span className="booking-req-summary-label">Approved</span>
            </div>
          </div>

          <div className="booking-req-summary-card">
            <div className="booking-req-summary-icon booking-req-summary-icon-yellow">
              <GrMoney />
            </div>
            <div className="booking-req-summary-text">
              <span className="booking-req-summary-val ">
                ₹{totalFareApproved.toLocaleString("en-IN")}
              </span>
              <span className="booking-req-summary-label">
                Confirmed Earnings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="booking-req-body">
        <div className="booking-req-wrapper">
          {/* ── Filter tabs ── */}
          <div className="booking-req-filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`booking-req-filter-tab ${activeFilter === f ? "booking-req-filter-tab-active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
                <span
                  className={`booking-req-filter-count ${activeFilter === f ? "booking-req-filter-count-active" : ""} ${f === "Pending" && counts.Pending > 0 ? "booking-req-filter-count-pending" : ""}`}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          {/* ── Cards grid ── */}
          {filtered.length === 0 ? (
            <div className="booking-req-empty">
              <div className="booking-req-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4" />
                </svg>
              </div>
              <h3 className="booking-req-empty-title">
                No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""}{" "}
                requests
              </h3>
              <p className="booking-req-empty-sub">
                {activeFilter === "Pending"
                  ? "All caught up! No pending requests right now."
                  : `You don't have any ${activeFilter.toLowerCase()} booking requests yet.`}
              </p>
            </div>
          ) : (
            <div className="booking-req-grid">
              {filtered.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
