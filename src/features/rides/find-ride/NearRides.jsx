"use client";
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
  const urgency =
    ride.seatsLeft === 1
      ? "fr-rides-badge--low"
      : ride.seatsLeft >= ride.totalSeats
        ? "fr-rides-badge--full"
        : "fr-rides-badge--ok";

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
              {ride.rating.toFixed(1)}
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
          <span className="fr-rides-price">₹{ride.price} <i className="fr-rides-price-unit">/seat</i></span>

          <button type="button" className="fr-rides-book-btn">
            Book seat
          </button>
        </div>
      </div>
    </article>
  );
}

export default function NearbyRides({ rides = DEFAULT_RIDES }) {
  return (
    <section className="fr-rides-section" aria-labelledby="fr-routes-title">
          <h2  className="fr-routes-title">
            Rides near you
          </h2>
      <div className="fr-rides-header">
        <div>
   
        
          <p className="fr-rides-subtitle">
            {rides.length} rides found close to you, ready to book
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
        {rides.map((ride) => (
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
