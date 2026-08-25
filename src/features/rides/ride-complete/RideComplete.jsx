"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaCheck,
  FaCarSide,
  FaHeadset,
  FaHome,
  FaRoute,
  FaRegClock,
  FaUserFriends,
  FaExclamationTriangle,
  FaChevronRight,
  FaStar,
  FaHashtag,
  FaWallet,
  FaReceipt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

import RatingModal from "@/components/Rating";
import rideComplete from "@/assets/images/ride-complete.png";
import { getRole } from "@/lib/cookie";

const DEMO_RIDE_DATA = {
  route: { from: "KIIT Square", to: "Puri" },
  distanceKm: 145,
  durationLabel: "2h 15m",
  passengers: [
    { id: "p1", name: "Aman Yadav", avatar: null },
    { id: "p2", name: "Riya Sharma", avatar: null },
    { id: "p3", name: "Kunal Mehta", avatar: null },
    { id: "p4", name: "Priya Nair", avatar: null },
    { id: "p5", name: "Sameer Khan", avatar: null },
  ],
  driver: {
    id: "d1",
    name: "Vikram Singh",
    avatar: null,
    car: "Maruti Ertiga · White",
    rating: 4.8,
  },
  // Added: needed by the Booking Details card/modal section.
  booking: {
    id: "#CP10245",
    seatsBooked: 1,
    pricePerSeat: 630,
    serviceFee: 20,
    totalPaid: 650,
    paymentStatus: "Paid",
  },
};

const AUTO_OPEN_DELAY_MS = 5000;

/** Small helper — colored initials avatar, falls back gracefully when no photo exists. */
function RideComAvatar({ name, avatar, size = 34 }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatar) {
    return (
      <span className="ride-com-avatar" style={{ width: size, height: size }}>
        <Image src={avatar} alt={name} fill sizes={`${size}px`} />
      </span>
    );
  }

  return (
    <span
      className="ride-com-avatar"
     
      aria-label={name}
      title={name}
    >
      {initials}
    </span>
  );
}

/**
 * Booking Details rows — shared by the inline card (desktop/tablet) and the
 * mobile modal so the two never drift apart. Extracted as-is from the old
 * UserRideCompleted page.
 */
function BookingDetailsRows({ booking }) {
  return (
    <div className="user-ride-complete-booking-rows">
      <div className="user-ride-complete-booking-row">
        <span>
          <FaHashtag /> Booking ID
        </span>
        <span>{booking.id}</span>
      </div>
      <div className="user-ride-complete-booking-row">
        <span>
          <FaUserFriends /> Seats Booked
        </span>
        <span>{booking.seatsBooked}</span>
      </div>
      <div className="user-ride-complete-booking-row">
        <span>
          <FaWallet /> Price per seat
        </span>
        <span>₹{booking.pricePerSeat}</span>
      </div>
      <div className="user-ride-complete-booking-row">
        <span>
          <FaReceipt /> Service Fee
        </span>
        <span>₹{booking.serviceFee}</span>
      </div>
      <div className="user-ride-complete-booking-row ">
        <span>
          <FaMoneyBillWave /> Total Paid
        </span>
        <span>₹{booking.totalPaid}</span>
      </div>
      <div className="user-ride-complete-booking-row">
        <span>
          <FaCheckCircle /> Payment Status
        </span>
        <span className="user-ride-complete-paid-tag">
          <FaCheck /> {booking.paymentStatus}
        </span>
      </div>
    </div>
  );
}

export default function RideCompleted({
  data = DEMO_RIDE_DATA,
  onViewAllPassengers,
}) {
  const { route, distanceKm, durationLabel, passengers, driver, booking } =
    data;

  // Role now comes from getRole() instead of the data object.
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  const isDriver = role === "driver";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const autoOpenTimerRef = useRef(null);

  // Single source of truth: whether it's the button click or the 3s timeout
  // that fires, both call this exact same function.
  const openModal = useCallback(() => {
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Start the 3s auto-open countdown once role is known and the screen has mounted.
  useEffect(() => {
    if (!role) return;
    autoOpenTimerRef.current = setTimeout(openModal, AUTO_OPEN_DELAY_MS);
    return () => {
      if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
    };
  }, [role, openModal]);

  // Mobile-only "Booking Details" modal (desktop/tablet shows the card inline).
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  // Role hasn't resolved yet — avoid flashing the wrong layout.
  if (!role) {
    return null;
  }

  const visiblePassengers = passengers.slice(0, 4);
  const overflowCount = passengers.length - visiblePassengers.length;

  const rateLabel = isDriver ? "Rate Passengers" : "Rate Driver";
  const nudgeText = isDriver
    ? "Please rate your passengers and share your experience."
    : "Please rate your driver and share your experience.";

  return (
    <div className="ride-com-wrapper">
      <div className="ride-com-grid">
        {/* ---------------- Hero / status column ---------------- */}
        <section className="ride-com-hero">
          <div className="ride-com-illustration">
            <Image
              src={rideComplete}
              alt="Ride completed"
              width={400}
              height={300}
              priority
              className="ride-complete-img"
            />
            <span className="ride-com-confetti c1" />
            <span className="ride-com-confetti c2" />
            <span className="ride-com-confetti c3" />
            <span className="ride-com-confetti c4" />
            <span className="ride-com-confetti c5" />
            <span className="ride-com-confetti c6" />
          </div>

          <h1 className="ride-com-title">Ride Completed!</h1>
          <p className="ride-com-subtitle">
            {isDriver
              ? "Thanks for driving with Carpooling."
              : "Thank you for choosing Carpooling."}
          </p>

          <button className="ride-com-role-tag" onClick={openModal}>
            <FaStar /> {isDriver ? "Rate Passenger" : "Rate Driver"}
          </button>
        </section>

        {/* ---------------- Details column ---------------- */}
        <section className="ride-com-content">
          {/* Ride summary */}
          <div className="ride-com-card">
            <h2 className="ride-com-card-title">Ride Summary</h2>

            <div className="ride-com-route">
              <span className="ride-com-route-dot" />
              <span className="ride-com-route-point">
                <p className="source">
                  <IoLocationSharp />
                </p>
                {route.from}
              </span>

              <span className="ride-com-route-line" />
              <span className="ride-com-route-point">
                {route.to}{" "}
                <p className="destination">
                  <IoLocationSharp />
                </p>
              </span>
            </div>

            <div className="ride-com-stats">
              <div className="ride-com-stat">
                <FaRoute className="ride-com-stat-icon" />
                <span className="ride-com-stat-value">{distanceKm} km</span>
                <span className="ride-com-stat-label">Distance</span>
              </div>
              <div className="ride-com-stat">
                <FaRegClock className="ride-com-stat-icon" />
                <span className="ride-com-stat-value">{durationLabel}</span>
                <span className="ride-com-stat-label">Time Taken</span>
              </div>
              <div className="ride-com-stat">
                <FaUserFriends className="ride-com-stat-icon" />
                <span className="ride-com-stat-value">{passengers.length}</span>
                <span className="ride-com-stat-label">
                  {isDriver ? "Passengers" : "Seats"}
                </span>
              </div>
            </div>
          </div>

          {/* Driver-only: passenger list | Passenger-only: driver card */}
          {isDriver ? (
            <div className="ride-com-card">
              <div className="ride-com-card-header">
                <h2 className="ride-com-card-title">Passengers</h2>
                <button
                  type="button"
                  className="ride-com-view-all"
                  onClick={onViewAllPassengers}
                >
                  View All <FaChevronRight />
                </button>
              </div>

              <div className="ride-com-avatars">
                {visiblePassengers.map((p) => (
                  <RideComAvatar key={p.id} name={p.name} avatar={p.avatar} />
                ))}
                {overflowCount > 0 && (
                  <span className="ride-com-avatar-more">+{overflowCount}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="ride-com-card">
              <h2 className="ride-com-card-title">Your Driver</h2>
              <div className="ride-com-driver-row">
                <RideComAvatar
                  name={driver.name}
                  avatar={driver.avatar}
                  size={56}
                />
                <div className="ride-com-driver-info">
                  <span className="ride-com-driver-name">{driver.name}</span>
                  <span className="ride-com-driver-car">{driver.car}</span>
                </div>
                <span className="ride-com-driver-rating">
                  <FaStar /> {driver.rating}
                </span>
              </div>
            </div>
          )}

          {/* ---------------- Booking Details: inline card (desktop/tablet) ---------------- */}
          <div className="user-ride-complete-booking-card">
            <h2 className="user-ride-complete-card-title">Booking Details</h2>
            <BookingDetailsRows booking={booking} />
          </div>

          {/* Booking Details: mobile-only trigger — opens the same info as a modal */}
          <button
            type="button"
            className="user-ride-complete-booking-trigger"
            onClick={openBookingModal}
          >
            <span>
              <FaReceipt /> View Booking Details
            </span>
            <FaChevronRight />
          </button>

          {/* Rating nudge */}
          {/* <div className="ride-com-nudge">
            <FaStar className="ride-com-nudge-icon" />
            <span>{nudgeText}</span>
          </div> */}

          <div className="user-ride-complete-help-bar">
            <span className="user-ride-complete-help-icon">
              <FaExclamationTriangle />
            </span>
            <span className="user-ride-complete-help-text">
              Need help with this ride?
            </span>
            <span className="user-ride-complete-help-links">
              <button
                type="button"
                // onClick={onContactSupport}
                className="user-ride-complete-help-link"
              >
                <FaHeadset /> Contact support
              </button>
              <span className="user-ride-complete-help-divider">|</span>
              <button
                type="button"
                // onClick={onReportIssue}
                className="user-ride-complete-help-link"
              >
                Report an issue
              </button>
             
            </span>
          </div>
        </section>
      </div>

      {/* ---------------- Booking details modal (mobile) ---------------- */}
      {isBookingModalOpen && (
        <div
          className="user-ride-complete-booking-modal-overlay"
          onClick={closeBookingModal}
        >
          <div
            className="user-ride-complete-booking-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Booking details"
          >
            <div className="user-ride-complete-booking-modal-header">
              <h3>Booking Details</h3>
              <button
                type="button"
                className="user-ride-complete-booking-modal-close"
                onClick={closeBookingModal}
                aria-label="Close booking details"
              >
                <FaTimes />
              </button>
            </div>
            <BookingDetailsRows booking={booking} />
          </div>
        </div>
      )}

      {/* Wire this up to your real RatingModal props/API */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        role={role}
        rateeType={isDriver ? "passengers" : "driver"}
        passengers={isDriver ? passengers : undefined}
        driver={!isDriver ? driver : undefined}
      />
    </div>
  );
}
