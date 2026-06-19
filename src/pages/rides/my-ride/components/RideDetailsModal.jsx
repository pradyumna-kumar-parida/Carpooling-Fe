"use client";

import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FaCar, FaCalendarAlt, FaClock, FaUser, FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineCall, MdClose } from "react-icons/md";
import { getStatusColor } from "../hooks/UseMyRides";
import { useEffect } from "react";

export default function RideDetailsModal({ ride, onClose }) {
  if (!ride) return null;
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);
  return (
    <div className="myride-modal-overlay" onClick={onClose}>
      <div
        className="myride-details-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ride-details-title"
      >
        {/* Modal Header */}
        <div className="myride-modal-title">
          <h2 id="ride-details-title">Ride Details</h2>
          <button
            className="myride-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <MdClose />
          </button>
        </div>

        <div className="myride-modal-content">
          {/* Status Badge */}
          <div className="myride-modal-badges">
            <span
              className="myride-status-chip"
              style={{ backgroundColor: getStatusColor(ride.status) }}
            >
              {ride.status}
            </span>
          </div>

          {/* Route Stepper */}
          <div className="myride-modal-route">
            <h3 className="section-title">Journey Details</h3>
            <div className="route-stepper">
              <div className="route-step">
                <div className="step-marker">
                  <IoLocationOutline className="step-icon start" />
                  <div className="step-line" />
                </div>
                <div className="step-content">
                  <h4 className="step-city">{ride.from}</h4>
                  <p className="step-address">{ride.fromAddress}</p>
                  <span className="step-time">{ride.time}</span>
                </div>
              </div>
              <div className="route-step">
                <div className="step-marker">
                  <FaLocationDot className="step-icon end" />
                </div>
                <div className="step-content">
                  <h4 className="step-city">{ride.to}</h4>
                  <p className="step-address">{ride.toAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Info */}
          <div className="myride-modal-info">
            <h3 className="section-title">Trip Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <FaCalendarAlt className="item-icon" />
                <div>
                  <span className="item-label">Date</span>
                  <span className="item-value">{ride.date}</span>
                </div>
              </div>
              <div className="info-item">
                <FaClock className="item-icon" />
                <div>
                  <span className="item-label">Duration</span>
                  <span className="item-value">{ride.duration}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUser className="item-icon" />
                <div>
                  <span className="item-label">Passengers</span>
                  <span className="item-value">{ride.passengers} seats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {ride.driver && (
            <div className="myride-modal-driver">
              <h3 className="section-title">Driver Information</h3>
              <div className="driver-card">
                <Image
                  src={ride.driver.avatar}
                  alt={ride.driver.name}
                  className="driver-avatar"
                  width={56}
                  height={56}
                  unoptimized
                />
                <div className="driver-details">
                  <div className="my-rides-driver-meta">
                    <h4 className="driver-name">{ride.driver.name}</h4>
                    <span className="driver-rating">
                      <FaStar className="star-icon" /> {ride.driver.rating}
                    </span>
                  </div>
                  <span className="driver-phone">
                    <MdOutlineCall className="phone-icon" /> {ride.driver.phone}
                  </span>
                  <div className="driver-car">
                    <FaCar className="car-icon" />
                    <span>{ride.driver.car}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booked Passengers */}
          {ride.bookedSeats && (
            <div className="myride-modal-passengers">
              <h3 className="section-title">Booked Passengers</h3>
              <div className="passengers-grid">
                {ride.bookedSeats.map((passenger, index) => (
                  <div key={index} className="passenger-card">
                    <Image
                      src={passenger.avatar}
                      alt={passenger.name}
                      className="passenger-avatar"
                      width={40}
                      height={40}
                      unoptimized
                    />
                    <div className="passenger-details">
                      <h4 className="passenger-name">{passenger.name}</h4>
                      <span className="passenger-phone">{passenger.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {ride.status === "cancelled" && (
            <div className="myride-modal-cancel">
              <h3 className="section-title">Cancellation Details</h3>
              <div className="cancel-info">
                <p>
                  <strong>Cancelled by:</strong> {ride.cancelledBy}
                </p>
                {ride.cancelReason && (
                  <p>
                    <strong>Reason:</strong> {ride.cancelReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="myride-modal-price-section">
            <div className="modal-price">
              <span className="modal-price-label">Total Price</span>
              <span className="modal-price-value">₹{ride.price}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="myride-modal-actions">
            <button className="action-btn chat-btn">Contact Driver</button>
            <button className="action-btn ticket-btn">Download Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
}
