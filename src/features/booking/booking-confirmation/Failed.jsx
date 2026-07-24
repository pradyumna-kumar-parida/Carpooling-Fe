"use client";
import "@/styles/find-ride.css"
import { useRouter, useSearchParams } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";

import { IoHomeOutline, IoHeadsetOutline } from "react-icons/io5";
import { FaCar } from "react-icons/fa";

export default function BookingFailed({
  reason = "Your payment could not be processed. This can happen due to a bank server timeout, insufficient balance, or a network issue.",
  bookingAttemptId = "BK666237",
  rideFrom = "Mumbai",
  rideTo = "Pune",
  date = "April 25, 2026",
  time = "11:00 AM",
  amount = 600,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRetryPayment = () => {
    router.push(
      `/passenger/payment-retry?bookingAttemptId=${bookingAttemptId}`,
    );
  };

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

      <span className="bkf-ref-chip">REFERENCE ID: {bookingAttemptId}</span>

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

          <div className="bkf-status-row">
            <span className="bkf-status-label">Status</span>
            <span className="bkf-status-badge">Failed</span>
          </div>
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
            className="bkf-btn bkf-btn--retry"
            onClick={handleRetryPayment}
          >
            <MdRefresh size={20} />
            Retry Payment
          </button>

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
