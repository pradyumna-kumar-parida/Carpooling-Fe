"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoLocationOutline, IoLocation } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { getNearRides } from "@/services/client/rideService";

/**
 * Maps a raw ride object from the API (as returned by /rides/upcoming or
 * /rides/near) into the flat shape the card below renders.
 */
function normalizeRide(r) {
  return {
    id: r.id,
    from: shortLocation(r.source_address),
    to: shortLocation(r.destination_address),
    date: formatRideDate(r.ride_date),
    time: formatTime12h(r.departure_time),
    price: Number(r.price_per_seat),
    totalSeats: r.total_seats,
    seatsLeft: r.available_seats,
    driver: r.driver_name,
    driverAvatar: r.driver_profile_picture,
    verified: r.driver_is_verified === "1" || r.driver_is_verified === 1,
    vehicle: [r.brand, r.model].filter(Boolean).join(" "),
    instantBooking: r.instant_booking === "yes",
  };
}

// "Cuttack, Odisha, India" -> "Cuttack"
function shortLocation(address = "") {
  return address.split(",")[0].trim();
}

// "13:57:00" -> "1:57 PM"
function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// "2026-07-25T00:00:00.000Z" -> "Today" | "Tomorrow" | "25 Jul"
function formatRideDate(dateStr) {
  if (!dateStr) return "";
  const rideDate = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(rideDate, today)) return "Today";
  if (sameDay(rideDate, tomorrow)) return "Tomorrow";
  return rideDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DriverAvatar({ src, name }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return <span className="avl-rides-avatar">{initials(name)}</span>;
  }
  return (
    <img
      src={src}
      alt={name}
      className="avl-rides-avatar avl-rides-avatar--img"
      onError={() => setBroken(true)}
    />
  );
}

function SeatPips({ total, left }) {
  const taken = total - left;
  return (
    <div className="avl-rides-seat-pips" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i < taken
              ? "avl-rides-pip avl-rides-pip--taken"
              : "avl-rides-pip avl-rides-pip--open"
          }
        />
      ))}
    </div>
  );
}

function RideCard({ ride }) {
  const urgency =
    ride.seatsLeft === 1
      ? "avl-rides-tag--low"
      : ride.seatsLeft >= ride.totalSeats
        ? "avl-rides-tag--full"
        : "avl-rides-tag--ok";

  return (
    <article className="avl-rides-card">
      <div className="avl-rides-card-top">
        <span className="avl-rides-when">
          {ride.date} · {ride.time}
          {/* {ride.instantBooking && (
            <span className="avl-rides-instant">Instant</span>
          )} */}
        </span>
        <span className={`avl-rides-tag ${urgency}`}>
          {ride.seatsLeft} {ride.seatsLeft === 1 ? "seat" : "seats"} left
        </span>
      </div>

      <div className="avl-rides-route">
        <div className="avl-rides-route-track">
          <IoLocationOutline />
          <span className="avl-rides-route-line">
            <FaCar className="avl-rides-car" />
          </span>
          <IoLocation />
        </div>
        <div className="avl-rides-places">
          <span className="avl-rides-place avl-rides-place--from">
            {ride.from}
          </span>
          <span className="avl-rides-place avl-rides-place--to">{ride.to}</span>
        </div>
      </div>

      <div className="avl-rides-seats-row">
        <SeatPips total={ride.totalSeats} left={ride.seatsLeft} />
        <span className="avl-rides-seats-label">
          {ride.totalSeats - ride.seatsLeft}/{ride.totalSeats} booked
        </span>
      </div>

      <div className="avl-rides-card-bottom">
        <div className="avl-rides-driver">
          <DriverAvatar src={ride.driverAvatar} name={ride.driver} />
          <div className="avl-rides-driver-meta">
            <span className="avl-rides-driver-name">
              {ride.driver}
              {ride.verified && (
                <svg
                  viewBox="0 0 20 20"
                  className="avl-rides-verified"
                  aria-label="Verified driver"
                >
                  <path
                    fill="currentColor"
                    d="M10 1.5l2.1 1.2 2.4-.3 1.1 2.1 2.1 1.2-.3 2.4 1.2 2.1-1.2 2.1.3 2.4-2.1 1.1-1.1 2.1-2.4-.3L10 18.5l-2.1-1.2-2.4.3-1.1-2.1L2.3 14l.3-2.4L1.4 9.5l1.2-2.1-.3-2.4 2.1-1.1L5.5 1.8l2.4.3z"
                  />
                  <path
                    d="M7 10.2l2 2 4-4.4"
                    stroke="#fff"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {/* {ride.vehicle && (
              <span className="avl-rides-vehicle">{ride.vehicle}</span>
            )} */}
            <span className="avl-rides-rating">
              <svg
                viewBox="0 0 20 20"
                className="avl-rides-star"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"
                />
              </svg>
              {ride.rating || 4.3}
              <span className="avl-rides-trips">
                · {ride.trips || 120} trips
              </span>
            </span>
          </div>
        </div>
        <div className="avl-rides-price">
          <span className="avl-rides-price-amount">₹{ride.price}</span>
          <span className="avl-rides-price-unit">/seat</span>
        </div>
      </div>

      <button type="button" className="avl-rides-book-btn">
        Book seat
      </button>
    </article>
  );
}

export default function AvailableRides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    // If permission already exists (page refresh)
    const permission = sessionStorage.getItem("locationPermission");

    if (permission) {
      fetchRides();
    }

    // Wait for Allow/Deny
    const handlePermission = () => {
      fetchRides();
    };

    window.addEventListener("locationPermissionUpdated", handlePermission);

    return () => {
      window.removeEventListener("locationPermissionUpdated", handlePermission);
    };
  }, []);

  const fetchRides = async () => {
    try {
      const permission = sessionStorage.getItem("locationPermission");

      let response;

      if (permission === "allowed") {
        const location = JSON.parse(sessionStorage.getItem("userLocation"));

        response = await getNearRides(location.latitude, location.longitude);
      } else {
        response = await getNearRides();
      }

      setRides((response.data.rides || []).map(normalizeRide));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="avl-rides-section" aria-labelledby="avl-rides-heading">
      <div className="avl-rides-header">
        <div>
          <span className="avl-rides-eyebrow">
            <span className="avl-rides-pulse" aria-hidden="true" />
            Rides near you
          </span>
          <h2 id="avl-rides-heading" className="avl-rides-title">
            Rides leaving soon
          </h2>
        </div>
        <Link href="/find-ride" className="avl-rides-viewall">
          View all rides
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M7 4l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="avl-rides-grid">
        {rides.slice(0, 4).map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </section>
  );
}
