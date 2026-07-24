"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNearRides } from "@/hooks/useNearRides";
import { TbCurrentLocationFilled } from "react-icons/tb";

const DEFAULT_RIDES = [
  {
    id: "n1",
    from: "New Delhi",
    to: "Chandigarh",
    time: "7:15 AM",
    date: "Today",
    price: 450,
    totalSeats: 4,
    seatsLeft: 2,
    rating: 4.8,
    trips: 156,
    driver: "Rohit Malhotra",
    distance: "2.4 km away",
  },
  {
    id: "n2",
    from: "New Delhi",
    to: "Jaipur",
    time: "9:00 AM",
    date: "Today",
    price: 380,
    totalSeats: 4,
    seatsLeft: 1,
    rating: 4.6,
    trips: 98,
    driver: "Priya Kapoor",
    distance: "1.1 km away",
  },
  {
    id: "n3",
    from: "New Delhi",
    to: "Agra",
    time: "6:30 AM",
    date: "Today",
    price: 300,
    totalSeats: 6,
    seatsLeft: 4,
    rating: 4.9,
    trips: 212,
    driver: "Karan Bhatia",
    distance: "3.6 km away",
  },
  {
    id: "n4",
    from: "Mumbai",
    to: "Pune",
    time: "5:45 PM",
    date: "Today",
    price: 260,
    totalSeats: 4,
    seatsLeft: 3,
    rating: 4.7,
    trips: 174,
    driver: "Ananya Joshi",
    distance: "0.8 km away",
  },
  {
    id: "n5",
    from: "Agra",
    to: "New Delhi",
    time: "8:00 AM",
    date: "Tomorrow",
    price: 300,
    totalSeats: 4,
    seatsLeft: 1,
    rating: 4.5,
    trips: 64,
    driver: "Vikram Rathore",
    distance: "4.2 km away",
  },
  {
    id: "n6",
    from: "Jaipur",
    to: "New Delhi",
    time: "4:30 PM",
    date: "Tomorrow",
    price: 380,
    totalSeats: 6,
    seatsLeft: 6,
    rating: 4.8,
    trips: 140,
    driver: "Simran Chadha",
    distance: "2.9 km away",
  },
];

// "Cuttack, Odisha, India" -> "Cuttack"
function shortLocation(address) {
  if (!address) return "raw value";
  return address.split(",")[0].trim();
}

// "13:57:00" -> "1:57 PM"
function formatTime12h(timeStr) {
  if (!timeStr) return "raw value";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// "2026-07-25T00:00:00.000Z" -> "Today" | "Tomorrow" | "25 Jul"
function formatRideDate(dateStr) {
  if (!dateStr) return "raw value";
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

/**
 * Maps a raw ride object from the API (/rides/near) into the flat shape
 * this component's RideRow renders. Fields the API doesn't provide fall
 * back to "raw value".
 */
function normalizeRide(r) {
  return {
    id: r.id || "raw value",
    from: shortLocation(r.source_address),
    to: shortLocation(r.destination_address),
    time: formatTime12h(r.departure_time),
    date: formatRideDate(r.ride_date),
    price: r.price_per_seat ? Number(r.price_per_seat) : "0",
    totalSeats: r.total_seats || "raw value",
    seatsLeft: r.available_seats !== undefined ? r.available_seats : "1",
    rating: r.rating || "4.3",
    trips: r.trips || "120",
    driver: r.driver_name || "guest",
    distance: r.distance_km !== undefined ? `${r.distance_km} km away` : "21",
  };
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SeatPips({ total, left }) {
  const taken = total - left;
  return (
    <div className="fr-rides-pips" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            i < taken
              ? "fr-rides-pip fr-rides-pip--taken"
              : "fr-rides-pip fr-rides-pip--open"
          }
        />
      ))}
    </div>
  );
}

function RideRow({ ride }) {
  const router = useRouter();
  const [seatCount, setSeatCount] = useState(1);

  const urgency =
    ride.seatsLeft === 1
      ? "fr-rides-badge--low"
      : ride.seatsLeft >= ride.totalSeats
        ? "fr-rides-badge--full"
        : "fr-rides-badge--ok";

  const handleDecrease = () => {
    setSeatCount((c) => Math.max(1, c - 1));
  };

  const handleIncrease = () => {
    setSeatCount((c) => Math.min(ride.seatsLeft, c + 1));
  };

  const handleBook = () => {
    router.push(`/ride-booking/${ride.id}?seats=${seatCount}`);
  };

  return (
    <article className="fr-rides-card">
      <div className="fr-rides-card-head">
        <span className="fr-rides-distance">
          <TbCurrentLocationFilled />

          {ride.distance}
        </span>
        <span className={`fr-rides-badge ${urgency}`}>
          {ride.seatsLeft} {ride.seatsLeft === 1 ? "seat" : "seats"} left
        </span>
      </div>

      <div className="fr-rides-body">
        <div className="fr-rides-route">
          <div className="fr-rides-places">
            <span className="fr-rides-place">{ride.from}</span>
            <span className="fr-rides-place fr-rides-place--dest">
              {ride.to}
            </span>
          </div>
          <span className="fr-rides-when">
            {ride.date} · {ride.time}
          </span>
        </div>

        <div className="fr-rides-divider" />

        <div className="fr-rides-driver-col">
          <span className="fr-rides-avatar">{initials(ride.driver)}</span>
          <div className="fr-rides-driver-meta">
            <span className="fr-rides-driver-name">{ride.driver}</span>
            <span className="fr-rides-rating">
              <svg
                viewBox="0 0 20 20"
                className="fr-rides-star"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"
                />
              </svg>
              {ride.rating}
              <span className="fr-rides-trips">· {ride.trips} trips</span>
            </span>
          </div>
        </div>

        <div className="fr-rides-divider" />

        <div className="fr-rides-seats-col">
          <SeatPips total={ride.totalSeats} left={ride.seatsLeft} />
          <span className="fr-rides-seats-label">
            {ride.totalSeats - ride.seatsLeft}/{ride.totalSeats} booked
          </span>
        </div>

        <div className="fr-rides-price-col">
          <span className="fr-rides-price">
            ₹{ride.price} <i className="fr-rides-price-unit">/seat</i>
          </span>

          <div className="fr-rides-book-row">
            <div className="fr-seat-counter">
              <button
                type="button"
                className="fr-seat-counter-btn"
                onClick={handleDecrease}
                disabled={seatCount <= 1}
              >
                −
              </button>
              <span className="fr-seat-counter-val">{seatCount}</span>
              <button
                type="button"
                className="fr-seat-counter-btn"
                onClick={handleIncrease}
                disabled={seatCount >= ride.seatsLeft}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="fr-rides-book-btn"
              onClick={handleBook}
            >
              Book seat
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NearbyRides({ rides = DEFAULT_RIDES }) {
  const { data: rawRides = [], isLoading, error, refetch } = useNearRides();
  console.log("near rides", rawRides);

  const apiRides = rawRides.map(normalizeRide);
  const displayRides = apiRides.length ? apiRides : rides;

  return (
    <section className="fr-rides-section" aria-labelledby="fr-routes-title">
      <h2 className="fr-routes-title">Rides near you</h2>
      <div className="fr-rides-header">
        <div>
          <p className="fr-rides-subtitle">
            {displayRides.length} rides found close to you, ready to book
          </p>
        </div>

        <div className="fr-rides-sort">
          <span className="fr-rides-sort-label">Sort by</span>
          <button
            type="button"
            className="fr-rides-sort-chip fr-rides-sort-chip--active"
          >
            Earliest
          </button>
          <button type="button" className="fr-rides-sort-chip">
            Price
          </button>
          <button type="button" className="fr-rides-sort-chip">
            Rating
          </button>
        </div>
      </div>

      <div className="fr-rides-list">
        {displayRides.map((ride) => (
          <RideRow key={ride.id} ride={ride} />
        ))}
      </div>

      <div className="fr-rides-footer">
        <button type="button" className="fr-rides-loadmore-btn">
          Load more rides
        </button>
      </div>
    </section>
  );
}
