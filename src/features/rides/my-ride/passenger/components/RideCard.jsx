"use client";

import { ImArrowRight, ImInfo } from "react-icons/im";
import { getStatusColor } from "../hooks/UseMyRides";
import { useRouter } from "next/navigation";
import { TbRoute } from "react-icons/tb";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { GoDotFill } from "react-icons/go";

// Ride day has arrived if today's local date >= ride's local date (ignores time-of-day)
function hasRideDayArrived(rawDate) {
  if (!rawDate) return false;
  const rideDay = new Date(rawDate);
  if (isNaN(rideDay.getTime())) return false;

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const rideDayStart = new Date(
    rideDay.getFullYear(),
    rideDay.getMonth(),
    rideDay.getDate(),
  );

  return rideDayStart <= todayStart;
}

export default function RideCard({ ride, onViewDetails, onOpenChat, onCancelClick }) {
  const router = useRouter();

  if (!ride) return null;

  const status = (ride.bookingStatus || "").toLowerCase();
  const isCancelled = status === "cancelled";
  const isCompleted = status === "completed";
  const isScheduled = status === "confirmed";
  const isExpired = status === "expired";

  // Chat: only for scheduled rides, fully off for cancelled/completed (and anything else)
  const isChatEnabled = isScheduled;

  // Track: off by default, turns on once the ride day has arrived —
  // but never for cancelled/completed rides
  const isTrackEnabled =
    !isCancelled &&
    !isCompleted &&
    !isExpired &&
    hasRideDayArrived(ride.rawDate);

  // Cancel: off for anything already in a final state
  const isCancelEnabled = !isCancelled && !isCompleted && !isExpired;

  const capitalize = (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="myride-card">
      <div className="myride-card-header">
        <span
          className="myride-status-chip"
          style={{
            color: getStatusColor(ride.bookingStatus),
            border: `1px dotted ${getStatusColor(ride.bookingStatus)}`,
            backgroundColor: `${getStatusColor(ride.bookingStatus)}25`,
          }}
        >
          {capitalize(ride.bookingStatus)}
        </span>
        <span className="info-value-card-date">
          {ride.date} <GoDotFill className="separtor-dot" />
          <strong >₹{ride.price}</strong>
        </span>
      </div>

      <div className="myride-route-simple">
        <div className="route-simple-item">
          <span className="route-label-head">From:</span>
          <span className="route-value">{ride.from}</span>
        </div>
        <div className="route-arrow">
          <ImArrowRight />
        </div>
        <div className="route-simple-item">
          <span className="route-label-head">To:</span>
          <span className="route-value">{ride.to}</span>
        </div>
      </div>

      <div className="myride-card-actions">
        <button
          className="myride-details-btn"
          onClick={() => onViewDetails(ride)}
        >
          Details <ImInfo />
        </button>
        <button
          className="myride-track-btn"
          disabled={!isTrackEnabled}
          aria-disabled={!isTrackEnabled}
          title={
            isTrackEnabled
              ? "Track this ride"
              : "Tracking opens once the ride date arrives"
          }
          onClick={() => {
            if (!isTrackEnabled) return;
            router.push(`/passenger/tracking?bookingId=${ride.id}`);
          }}
        >
          Track <TbRoute />
        </button>

        <button
          className="myride-chat-btn"
          disabled={!isChatEnabled}
          aria-disabled={!isChatEnabled}
          title={
            isChatEnabled
              ? "Chat with driver"
              : "Chat is only available for scheduled rides"
          }
          onClick={() => {
            if (!isChatEnabled) return;
            onOpenChat(ride);
          }}
        >
          Chat <IoChatbubbleEllipsesOutline />
        </button>

        <button
          className="myride-cancel-btn"
          disabled={!isCancelEnabled}
          aria-disabled={!isCancelEnabled}
          title={
            isCancelEnabled
              ? "Cancel this ride"
              : "This ride can no longer be cancelled"
          }
          onClick={() => {
            if (!isCancelEnabled) return;
            onCancelClick(ride);
          }}
        >
          Cancel 
        </button>
      </div>
    </div>
  );
}