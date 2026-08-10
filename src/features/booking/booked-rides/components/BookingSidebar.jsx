"use client";
import { BsInfoCircle } from "react-icons/bs";
import { metersToKm } from "../utils/bookingHelpers";
import { useState } from "react";
import BookingRouteModal from "./BookingRouteModal";
import BookingRouteMap from "./BookingRouteMap";
import { FiMapPin } from "react-icons/fi";
// export default function BookingSidebar({
//   ride,
//   pricePerSeat,
//   isRidePassed,
//   bookingLoading,
//   token,
//   onBookClick,
//   onLoginClick,
//   noOfSIt,
// }) {
//   const total = (pricePerSeat * noOfSIt).toFixed(2);

//   const rows = [
//     ["Price per seat", `₹${pricePerSeat}`],
//     ["Selected seats", noOfSIt ?? "--"],
//     ["Distance", metersToKm(ride.distance_meters)],
//   ];

export default function BookingSidebar({
  ride,
  pricePerSeat,
  isRidePassed,
  bookingLoading,
  token,
  onBookClick,
  onLoginClick,
  noOfSIt,
}) {
  const [showRoute, setShowRoute] = useState(false);

  const total = (pricePerSeat * noOfSIt).toFixed(2);

  const rows = [
    ["Price per seat", `₹${pricePerSeat}`],
    ["Selected seats", noOfSIt ?? "--"],
    ["Distance", metersToKm(ride.distance_meters)],
  ];

  return (
    <>
      <div className="ride-confirm-sidebar">
        {isRidePassed && (
          <div className="ride-status-badge">
            <BsInfoCircle />
            <span>This ride has already departed</span>
          </div>
        )}
        <div className="ride-map-preview">
          <div className="ride-map-preview-map">
            <BookingRouteMap
              sourceLat={ride.source_lat}
              sourceLng={ride.source_lng}
              destinationLat={ride.destination_lat}
              destinationLng={ride.destination_lng}
              sourceAddress={ride.source_address}
              destinationAddress={ride.destination_address}
              preview={true}
            />

            <button
              type="button"
              className="show-map-btn"
              onClick={() => setShowRoute(true)}
            >
              <span className="show-map-icon">
                <FiMapPin />
              </span>
              Show on map
            </button>
          </div>
        </div>
        <div className="ride-confirm-card ride-summary-card">
          {/* Route Preview */}

          <div className="book-rides-now">
            <h2 className="ride-price-title">Price details</h2>

            <div className="ride-price-list">
              {rows.map(([label, value]) => (
                <div key={label} className="ride-price-row">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="ride-price-divider" />

            <div className="ride-price-total">
              <span>Total price</span>

              <div className="summary-price">
                <span className="price-amount">₹{total}</span>
              </div>
            </div>

            {!isRidePassed &&
              (token ? (
                <button
                  type="button"
                  className="btn register-btn"
                  onClick={onBookClick}
                  disabled={bookingLoading}
                  style={{
                    opacity: bookingLoading ? 0.7 : 1,
                    cursor: bookingLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {bookingLoading ? "Requesting..." : "Request to Book"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn register-btn"
                  onClick={onLoginClick}
                >
                  Log in to Book
                </button>
              ))}
          </div>
        </div>
      </div>
      <BookingRouteModal
        open={showRoute}
        onClose={() => setShowRoute(false)}
        ride={ride}
      />
    </>
  );
}
