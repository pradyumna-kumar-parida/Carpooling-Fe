import Image from "next/image";
import React from "react";
import { FaCalendarAlt, FaClock, FaRoad, FaChair } from "react-icons/fa";
import { ImArrowRight } from "react-icons/im";
const RideDetailsCard = ({ ride, noOfSIt }) => {
  const formatDistance = (meters) => {
    if (!meters) return "-";
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };
  const formatTime = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="ridepay-summary">
      <div className="ridepay-summary-card">
        <div className="ridepay-route">
          <div className="ridepay-route-item">
            <span className="ridepay-route-label">From</span>
            <span className="ridepay-route-value">
              {ride?.source_address || "-"}
            </span>
          </div>
          <div className="ridepay-route-arrow">
            <ImArrowRight />
          </div>
          <div className="ridepay-route-item">
            <span className="ridepay-route-label">To</span>
            <span className="ridepay-route-value">
              {ride?.destination_address || "-"}
            </span>
          </div>
        </div>

        {/* Trip Details */}
        <div className="ridepay-info-grid">
          <div className="ridepay-info-item">
            <span className="ridepay-info-label">
              <FaCalendarAlt /> Date
            </span>
            <span className="ridepay-info-value">
              {formatDate(ride?.ride_date)}
            </span>
          </div>
          <div className="ridepay-info-item">
            <span className="ridepay-info-label">
              <FaClock /> Departure
            </span>
            <span className="ridepay-info-value">
              {formatTime(ride?.departure_time)}
            </span>
          </div>
          <div className="ridepay-info-item">
            <span className="ridepay-info-label">
              <FaClock /> Estimated Arrival
            </span>
            <span className="ridepay-info-value">
              {formatTime(ride?.estimated_reach_time)}
            </span>
          </div>

          <div className="ridepay-info-item">
            <span className="ridepay-info-label">
              <FaRoad /> Distance
            </span>
            <span className="ridepay-info-value">
              {formatDistance(ride?.distance_meters)}
            </span>
          </div>
          <div className="ridepay-info-item">
            <span className="ridepay-info-label">
              <FaChair /> Seats Booked
            </span>
            <span className="ridepay-info-value">
              {noOfSIt || 1} seat{noOfSIt > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Driver Details */}
        <div className="ridepay-driver">
          <h4 className="ridepay-driver-title">Driver Details</h4>
          <div className="ridepay-driver-info">
            {ride?.driver_profile_picture && (
              <Image
                src={ride.driver_profile_picture}
                alt={ride.driver_name}
                width={60}
                height={60}
                className="ridepay-driver-avatar"
              />
            )}
            <div>
              <p className="ridepay-driver-name">{ride?.driver_name || "-"}</p>

              <p className="ridepay-driver-car">
                {ride?.brand} {ride?.model} ({ride?.manufacture_year}) ·{" "}
                {ride?.fuel_type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsCard;
