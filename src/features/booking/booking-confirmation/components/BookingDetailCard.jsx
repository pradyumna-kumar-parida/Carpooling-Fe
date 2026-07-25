import React from "react";
import Image from "next/image";
import { FaClock, FaCalendarAlt,  FaCar, FaStar } from "react-icons/fa";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { GiPathDistance } from "react-icons/gi";
import { GiDuration } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import { IoTimerOutline } from "react-icons/io5";

const BookingDetailsCard = ({ bookingRideDetails }) => {
  const formattedDate = new Date(bookingRideDetails?.rideDetails?.ride_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = new Date(
    `1970-01-01T${bookingRideDetails?.rideDetails?.departure_time}`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const formattedArrivalTime = new Date(
    `1970-01-01T${bookingRideDetails?.rideDetails?.estimated_reach_time}`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  const duration = formatDuration(bookingRideDetails?.rideDetails?.duration_seconds);
  const formattedDistance = `${(bookingRideDetails?.rideDetails?.distance_meters / 1000).toFixed(1)} km`;

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
              <h4 className="bookconf-step-city">
                {bookingRideDetails?.bookingDetails?.ride_source.split(",")[0]}
              </h4>
              <p className="bookconf-step-address">
                {bookingRideDetails?.bookingDetails?.ride_source}
              </p>
              <span className="bookconf-step-time">
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="bookconf-journey-step">
            <div className="bookconf-step-marker">
              <FaLocationDot className="bookconf-step-icon end" />
            </div>
            <div className="bookconf-step-content">
              <h4 className="bookconf-step-city">
                {
                  bookingRideDetails?.bookingDetails?.ride_destination.split(
                    ",",
                  )[0]
                }
              </h4>
              <p className="bookconf-step-address">
                {bookingRideDetails?.bookingDetails?.ride_destination}
              </p>
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
              <span className="bookconf-info-value">
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <FaClock className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Departure Time</span>
              <span className="bookconf-info-value">
                {formattedTime}
              </span>
            </div>
          </div>
          <div className="bookconf-info-item">
           <IoTimerOutline  className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Arrival Time</span>
              <span className="bookconf-info-value">
                {formattedArrivalTime}
              </span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <GiPathDistance className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Distance</span>
              <span className="bookconf-info-value">
                {formattedDistance}
              </span>
            </div>
          </div>
          <div className="bookconf-info-item">
            <GiDuration  className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Duration</span>
              <span className="bookconf-info-value">
                {duration}
              </span>
            </div>
          </div>

          <div className="bookconf-info-item">
            <FiUsers  className="bookconf-info-icon" />
            <div>
              <span className="bookconf-info-label">Passengers</span>
              <span className="bookconf-info-value">
                {bookingRideDetails?.bookingDetails?.seats} seats
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
            src={bookingRideDetails?.userDetails?.profile_picture}
            alt={bookingRideDetails?.userDetails?.driverName}
            className="bookconf-driver-avatar"
            width={60}
            height={60}
          />
          <div className="bookconf-driver-info">
            <h4 className="bookconf-driver-name">
              {bookingRideDetails?.userDetails?.name}
            </h4>
            <div className="bookconf-driver-meta">
              <span className="bookconf-driver-rating">
                <FaStar /> <FaStar /> <FaStar /> <FaStar />{" "}
                <span>{bookingRideDetails?.driverRating || 4.8}</span>
              </span>
            </div>
            <div className="bookconf-driver-phone">
              <IoCallOutline /> +91 {bookingRideDetails?.userDetails?.phone}
            </div>
            <div className="bookconf-driver-car">
              <FaCar className="bookconf-car-icon" />
              <span>
                {bookingRideDetails?.carModel || "Maruti Swift Dzire - White"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsCard;