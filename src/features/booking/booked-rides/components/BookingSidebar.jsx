
import { BsInfoCircle } from "react-icons/bs";
import { metersToKm } from "../utils/bookingHelpers";
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
  const total = (pricePerSeat * noOfSIt).toFixed(2);

  const rows = [
    ["Price per seat", `₹${pricePerSeat}`],
    ["Selected seats", noOfSIt ?? "--"],
    ["Distance", metersToKm(ride.distance_meters)],
  ];

  return (
    <div className="ride-confirm-sidebar">
      {isRidePassed && (
        <div className="ride-status-badge">
          <BsInfoCircle />
          <span>This ride has already departed</span>
        </div>
      )}

      <div className="ride-confirm-card ride-summary-card">
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
              <span className="price-currency">₹</span>
              <span className="price-amount">{total}</span>
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
                  cursor: bookingLoading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {bookingLoading
                  ? "Requesting..."
                  : "Request to Book"}
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
  );
}