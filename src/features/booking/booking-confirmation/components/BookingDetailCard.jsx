import React from "react";
import Image from "next/image";
import { FaClock, FaCalendarAlt, FaUser, FaCar, FaStar } from "react-icons/fa";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import profile from "../../../../assets/images/offer-ride-profile-1.jpg";

const BookingDetailsCard = ({ rideDetails }) => {
  return (
    <div className="bookconf-details-section">
      {/* Journey Details */}
      <div className="bookconf-card">
        <h3 className="bookconf-card-title">Journey Details</h3>

        <div className="bookconf-journey">
          <div className="bookconf-journey-step">
            <div className="bookconf-step-marker">
              <IoLocationOutline className="bookconf-step-icon start" />
              <div className="bookconf-step-line"></div>
            </div>
            <div className="bookconf-step-content">
              <h4 className="bookconf-step-city">{rideDetails.from}</h4>
              <p className="bookconf-step-address">{rideDetails.fromAddress}</p>
              <span className="bookconf-step-time">{rideDetails.time}</span>
            </div>
          </div>

          <div className="bookconf-journey-step">
            <div className="bookconf-step-marker">
              <FaLocationDot className="bookconf-step-icon end" />
            </div>
            <div className="bookconf-step-content">
              <h4 className="bookconf-step-city">{rideDetails.to}</h4>
              <p className="bookconf-step-address">{rideDetails.toAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Information */}
      <div className="bookconf-card">
        <h3 className="bookconf-card-title">Ride Information</h3>

        <div className="bookconf-info-grid">
          <div className="bookconf-info-item">
            <FaCalendarAlt className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Date</span>
              <span className="bookconf-info-value">{rideDetails.date}</span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <FaClock className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Departure Time</span>
              <span className="bookconf-info-value">{rideDetails.time}</span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <FaClock className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Duration</span>
              <span className="bookconf-info-value">
                {rideDetails.duration}
              </span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <FaUser className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Passengers</span>
              <span className="bookconf-info-value">
                {rideDetails.passengers} seats
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Details */}
      <div className="bookconf-card">
        <h3 className="bookconf-card-title">Driver Details</h3>

        <div className="bookconf-driver">
          <Image
            src={profile}
            alt={rideDetails.driverName}
            className="bookconf-driver-avatar"
            width={60}
            height={60}
          />
          <div className="bookconf-driver-info">
            <h4 className="bookconf-driver-name">{rideDetails.driverName}</h4>
            <div className="bookconf-driver-meta">
              <span className="bookconf-driver-rating">
                <FaStar /> <FaStar /> <FaStar /> <FaStar />{" "}
                <span>{rideDetails.driverRating}</span>
              </span>
            </div>
            <div className="bookconf-driver-phone">
              <IoCallOutline /> {rideDetails.driverPhone}
            </div>
            <div className="bookconf-driver-car">
              <FaCar className="bookconf-car-icon" />
              <span>{rideDetails.carModel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;
