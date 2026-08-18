"use client";

import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaStar,
  FaHourglassHalf,
} from "react-icons/fa";
import { GrMoney } from "react-icons/gr";

import { MdOutlineCall, MdClose } from "react-icons/md";
import { getStatusColor } from "../hooks/UseMyRides";
import { useEffect } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdOutlineAirlineSeatLegroomReduced } from "react-icons/md";

export default function RideDetailsModal({ ride, onClose }) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  if (!ride) return null;
console.log("ride canxcelled",ride);

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
          {/* Status Badge — exactly what the API returns */}
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
                  <span className="step-time">{ride.duration}</span>
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
                  <span className="item-label">Depart Time</span>
                  <span className="item-value">{ride.departureTime}</span>
                </div>
              </div>
              <div className="info-item">
                <FaClockRotateLeft className="item-icon" />
                <div>
                  <span className="item-label">Arrival Time</span>
                  <span className="item-value">{ride.arrivalTime}</span>
                </div>
              </div>
              <div className="info-item">
                <FaHourglassHalf className="item-icon" />
                <div>
                  <span className="item-label">Duration</span>
                  <span className="item-value">{ride.duration}</span>
                </div>
              </div>
              <div className="info-item">
                <MdOutlineAirlineSeatLegroomReduced className="item-icon" />
                <div>
                  <span className="item-label">Seats</span>
                  <span className="item-value">{ride.passengers} </span>
                </div>
              </div>
              <div className="info-item">
                <GrMoney className="item-icon" />
                <div>
                  <span className="item-label">Price</span>
                  <span className="item-value">{ride.price} </span>
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
                    {ride.driver.rating != null && (
                      <span className="driver-rating">
                        <FaStar className="star-icon" /> {ride.driver.rating}
                      </span>
                    )}
                  </div>
                  {ride.driver.phone && (
                    <span className="driver-phone">
                      <MdOutlineCall className="phone-icon" />{" "}
                      {ride.driver.phone}
                    </span>
                  )}
                  <div className="driver-car">
                    <FaCar className="car-icon" />
                    <span>
                      {ride.driver.car}
                      {ride.driver.color ? ` - ${ride.driver.color}` : ""}
                      {ride.driver.registrationNumber
                        ? ` (${ride.driver.registrationNumber})`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {(ride.status || "").toLowerCase() === "cancelled" && (
            <div className="myride-modal-cancel">
              <h3 className="section-title">Cancellation Details</h3>
              <div className="cancel-info">
                {/* <p>
                  <strong>Cancelled </strong>
                </p> */}

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
        </div>
      </div>
    </div>
  );
}
