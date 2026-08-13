import React from "react";
import { Chip } from "@mui/material";
import { FaHandPointLeft } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";

const PaymentSummaryCard = ({
  bookingRideDetails,
  paymentMethod,
  bookingId,
  bookingDate,
  handleDownloadTicket,
  handleShareBooking,
  handleBackHome,
  router,
  onOpenChat,
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
              Ride Fare ({bookingRideDetails?.bookingDetails?.seats} seats)
            </span>
            <span className="bookconf-price-value">
              ₹{bookingRideDetails?.bookingDetails?.total_price}
            </span>
          </div>
          <div className="bookconf-price-row">
            <span className="bookconf-price-label">Service Fee</span>
            <span className="bookconf-price-value">₹0</span>
          </div>
          <div className="bookconf-price-divider"></div>
          <div className="bookconf-price-row total">
            <span className="bookconf-price-label">Total Amount</span>
            <span className="bookconf-price-value">
              ₹{bookingRideDetails?.bookingDetails?.total_price}
            </span>
          </div>
        </div>

        {paymentMethod === "cash" && (
          <div className="bookconf-cash-note">
            <p>
              Please pay ₹{bookingRideDetails?.bookingDetails?.total_price} in
              cash to the driver
            </p>
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
          className="bookconf-btn-secondary ticket-download"
          onClick={handleDownloadTicket}
        >
          <FiDownload size={20} />
          Download Ticket
        </button>
        <button
          className="bookconf-btn-secondary chat-btn-driver"
          onClick={() => onOpenChat()}
        >
          <IoChatboxEllipsesOutline size={20} />
          Chat With Driver
        </button>
        {/* <button
          className="bookconf-btn-secondary track-chat-btn"
          onClick={() => router.push("/passenger/track-chat")}
        >
          <TbRoute size={20} />
          Track 
        </button> */}
        <button className="bookconf-btn-primary" onClick={handleBackHome}>
          <FaHandPointLeft size={20} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
