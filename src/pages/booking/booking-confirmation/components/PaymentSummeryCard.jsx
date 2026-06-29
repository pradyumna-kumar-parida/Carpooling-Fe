import React from "react";
import { Chip } from "@mui/material";
import { FaDownload, FaShare } from "react-icons/fa";
import { TbRoute } from "react-icons/tb";
import { FaHandPointLeft } from "react-icons/fa";

const PaymentSummaryCard = ({
  rideDetails,
  paymentMethod,
  bookingId,
  bookingDate,
  handleDownloadTicket,
  handleShareBooking,
  handleBackHome,
  router,
}) => {
  return (
    <div className="bookconf-summary-section">
      {/* Payment Status */}
      <div className="bookconf-card bookconf-payment-card">
        <h3 className="bookconf-card-title">Payment Summary</h3>

        <div className="bookconf-payment-status">
          <button color="success" className="bookconf-payment-chip">
            Paid Online
          </button>
        </div>

        <div className="bookconf-price-breakdown">
          <div className="bookconf-price-row">
            <span className="bookconf-price-label">
              Ride Fare ({rideDetails.passengers} seats)
            </span>
            <span className="bookconf-price-value">₹{rideDetails.price}</span>
          </div>
          <div className="bookconf-price-row">
            <span className="bookconf-price-label">Service Fee</span>
            <span className="bookconf-price-value">₹0</span>
          </div>
          <div className="bookconf-price-divider"></div>
          <div className="bookconf-price-row total">
            <span className="bookconf-price-label">Total Amount</span>
            <span className="bookconf-price-value">₹{rideDetails.price}</span>
          </div>
        </div>

        {paymentMethod === "cash" && (
          <div className="bookconf-cash-note">
            <p>Please pay ₹{rideDetails.price} in cash to the driver</p>
          </div>
        )}
      </div>

      {/* Booking Info */}
      <div className="bookconf-card">
        <h3 className="bookconf-card-title">Booking Information</h3>

        <div className="bookconf-booking-info">
          <div className="bookconf-booking-row">
            <span className="bookconf-booking-label">Booking ID</span>
            <span className="bookconf-booking-value">{bookingId}</span>
          </div>
          <div className="bookconf-booking-row">
            <span className="bookconf-booking-label">Booked On</span>
            <span className="bookconf-booking-value">{bookingDate}</span>
          </div>
          <div className="bookconf-booking-row">
            <span className="bookconf-booking-label">Status</span>
            <Chip label="Confirmed" color="success" size="small" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bookconf-actions">
        <button
          className="bookconf-btn-secondary"
          onClick={handleDownloadTicket}
        >
          <FaDownload size={20}/>
          Download Ticket
        </button>
        <button className="bookconf-btn-secondary" onClick={handleShareBooking}>
          <FaShare size={20}/>
          Share Booking
        </button>
        <button
          className="bookconf-btn-secondary track-chat-btn"
          onClick={() => router.push("/track-chat")}
        >
          <TbRoute size={20} />
          Track & Chat
        </button>
        <button className="bookconf-btn-primary" onClick={handleBackHome}>
          <FaHandPointLeft size={20}/>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
