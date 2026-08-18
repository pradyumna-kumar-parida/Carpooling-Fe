"use client";
import "@/styles/find-ride.css";
import { useRouter } from "next/navigation";
import {
  MdErrorOutline,
  MdRefresh,
  MdSupportAgent,
  MdVerified,
} from "react-icons/md";
import { IoHomeOutline, IoCallOutline } from "react-icons/io5";
import { FaCar, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";

// Formats "2026-08-27" -> "August 27, 2026"
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Formats "07:40:00" -> "07:40 AM"
function formatTime(timeStr) {
  if (!timeStr) return "-";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

// Human-readable reason for the failure
function friendlyReason(booking) {
  const rawReason = booking?.reason_of_cancel;
  return (
    rawReason ||
    "Your payment could not be processed. This can happen due to a bank server timeout, insufficient balance, or a network issue."
  );
}

export default function BookingFailed({ apiResponse }) {
  const router = useRouter();
  const [data, setData] = useState(apiResponse || null);

  // Fallback: read from sessionStorage if no data was passed in as a prop
  useEffect(() => {
    if (data) return;

    const stored = sessionStorage.getItem("bookingFailed");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse booking failure data:", err);
      }
    }
  }, [data]);

  const ride = data?.ride;
  const booking = data?.booking;

  const bookingCode = booking?.booking_code || "N/A";
  const rideFrom = booking?.ride_source || ride?.source_address || "-";
  const rideTo = booking?.ride_destination || ride?.destination_address || "-";
  const date = formatDate(booking?.ride_date || ride?.ride_date);
  const time = formatTime(booking?.ride_time || ride?.departure_time);
  const amount = booking?.total_price || ride?.price_per_seat || 0;
  const reason = friendlyReason(booking);
  const seats = booking?.seats;

  // Driver / vehicle details come from the `ride` object, not `booking`
  const driver = ride?.driver_details;
  const driverUserDetails = driver?.user_details; // API returns snake_case, not "userDetails"
  const vehicle = ride?.vehicle_details;

  const vehicleLabel =
    vehicle?.brand && vehicle?.model
      ? `${vehicle.brand} ${vehicle.model}${vehicle?.color ? ` - ${vehicle.color}` : ""}`
      : "Vehicle details unavailable";

  // API has no per-driver rating field (only vehicle_details.rating, which can be null)
  const driverRating = vehicle?.rating ?? 4.8;
  const isDriverVerified = driverUserDetails?.is_verified === "1";

  const handleRebook = () => {
    router.push("/find-ride");
  };

  const handleContactSupport = () => {
    router.push("/help-support");
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <section className="bkf-section">
      <div className="bkf-icon-wrap">
        <MdErrorOutline className="bkf-icon" />
      </div>

      <h1 className="bkf-title">Booking Failed</h1>
      <p className="bkf-subtitle">{reason}</p>

      <span className="bkf-ref-chip">REFERENCE ID: {bookingCode}</span>

      <div className="bkf-grid">
        <div className="bkf-card">
          <h2 className="bkf-card-title">Attempted Journey</h2>
          <div className="bkf-divider" />

          <div className="bkf-journey-row">
            <span className="bkf-journey-label">From</span>
            <span className="bkf-journey-value">{rideFrom}</span>
          </div>
          <div className="bkf-journey-row">
            <span className="bkf-journey-label">To</span>
            <span className="bkf-journey-value">{rideTo}</span>
          </div>
          <div className="bkf-journey-row">
            <span className="bkf-journey-label">Date</span>
            <span className="bkf-journey-value">{date}</span>
          </div>
          <div className="bkf-journey-row">
            <span className="bkf-journey-label">Time</span>
            <span className="bkf-journey-value">{time}</span>
          </div>
          <div className="bkf-journey-row">
            <span className="bkf-journey-label">Amount</span>
            <span className="bkf-journey-value">₹{amount}</span>
          </div>
          <div className="bkf-journey-row">
            <span className="bkf-journey-label">Booked Seats</span>
            <span className="bkf-journey-value">{seats ?? "-"}</span>
          </div>

          <div className="bkf-status-row">
            <span className="bkf-status-label">Status</span>
            <span className="bkf-status-badge">Failed</span>
          </div>


<br />

          {driver && (
            <div className="bookconf-card">
              <h3 className="bookconf-card-title">Driver Details</h3>

              <div className="bookconf-driver">
                {driverUserDetails?.profile_picture && (
                  <Image
                    src={driverUserDetails.profile_picture}
                    alt={driver?.name || "Driver"}
                    className="bookconf-driver-avatar"
                    width={60}
                    height={60}
                  />
                )}
                <div className="bookconf-driver-info">
                  <h4 className="bookconf-driver-name">
                    {driver?.name}
                    {isDriverVerified && (
                      <MdVerified className="verify-driver" />
                    )}
                  </h4>
                  <div className="bookconf-driver-meta">
                    <span className="bookconf-driver-rating">
                      <FaStar /> <FaStar /> <FaStar /> <FaStar />{" "}
                      <span>{driverRating}</span>
                    </span>
                  </div>
                  <div className="bookconf-driver-phone">
                    <IoCallOutline />{" "}
                    {driver?.phone ? `+91 ${driver.phone}` : "-"}
                  </div>
                  <div className="bookconf-driver-car">
                    <FaCar className="bookconf-car-icon" />
                    <span>{vehicleLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bkf-side">
          <div className="bkf-info-card">
            <h3 className="bkf-info-title">What you can do</h3>
            <ul className="bkf-info-list">
              <li>
                Your seats have not been reserved and no amount has been
                deducted, or will be refunded within 5–7 business days if
                deducted.
              </li>
              <li>
                You can retry the payment for the same ride if seats are still
                available.
              </li>
              <li>
                Or search again in case the ride slot has been taken by someone
                else.
              </li>
            </ul>
          </div>

          <button
            type="button"
            className="bkf-btn bkf-btn--rebook"
            onClick={handleRebook}
          >
            <FaCar size={18} />
            Rebook a Ride
          </button>

          <button
            type="button"
            className="bkf-btn bkf-btn--support"
            onClick={handleContactSupport}
          >
            <MdSupportAgent size={20} />
            Contact Support
          </button>

          <button
            type="button"
            className="bkf-btn bkf-btn--home"
            onClick={handleBackHome}
          >
            <IoHomeOutline size={20} /> Back to Home
          </button>
        </div>
      </div>
    </section>
  );
}
