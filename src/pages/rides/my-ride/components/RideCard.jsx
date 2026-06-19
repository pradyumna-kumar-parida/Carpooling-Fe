"use client";

import { ImArrowRight } from "react-icons/im";
import { ImInfo } from "react-icons/im";
import { getStatusColor } from "../hooks/UseMyRides";

export default function RideCard({ ride, onViewDetails }) {
  return (
    <div className="myride-card">
      <div className="myride-card-header">
        <span
          className="myride-status-chip"
          style={{ backgroundColor: getStatusColor(ride.status) }}
        >
          {ride.status}
        </span>
      </div>

      <div className="myride-route-simple">
        <div className="route-simple-item">
          <span className="route-label">From:</span>
          <span className="route-value">{ride.from}</span>
        </div>
        <div className="route-arrow">
          <ImArrowRight />
        </div>
        <div className="route-simple-item">
          <span className="route-label">To:</span>
          <span className="route-value">{ride.to}</span>
        </div>
      </div>

      <div className="myride-card-info">
        <div className="info-row">
          <span className="info-label">Date:</span>
          <span className="info-value">{ride.date}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Time:</span>
          <span className="info-value">{ride.time}</span>
        </div>
      </div>

      <div className="myride-card-footer">
        <div className="myride-price">
          <span className="price-label">Price:</span>
          <span className="price-value">₹{ride.price}</span>
        </div>
        <button
          className="myride-details-btn"
          onClick={() => onViewDetails(ride)}
        >
          View Details <ImInfo />
        </button>
      </div>
    </div>
  );
}
