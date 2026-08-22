"use client";

import { useRouter } from "next/navigation";

import { FaCarSide, FaSmoking } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { GiCometSpark } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import StarRating from "./StarRating";

import {
  avatarColor,
  formatTime,
  secondsToHM,
  getInitials,
  getRideStatus,
} from "../utils/rideHelpers";

export default function RideCard({ ride, noOfSIt }) {
  const router = useRouter();

  const [bg, textColor] = avatarColor(ride.driver_name);
  const status = getRideStatus(ride.ride_date, ride.departure_time);

  const handleClick = () => {
    if (status.passed) return;

    router.push(`/ride-booking/${ride.id}?seats=${noOfSIt}`);
  };

  return (
    <div
      className={`ridetail-card-ride${
        status.passed ? " ridetail-card-ride--passed" : ""
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={status.passed ? -1 : 0}
      aria-disabled={status.passed}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Timeline + Price */}
      <div className="ridetail-ride-top">
        <div className="ridetail-ride-timeline">
          <div className="ridetail-ride-point">
            <span className="ridetail-ride-time">
              {formatTime(ride.departure_time)}
            </span>

            <span className="ridetail-ride-city">
              {ride.source_address?.split(",")[0]}
            </span>
          </div>

          <div className="ridetail-ride-line">
            <div className="ridetail-ride-dot ridetail-ride-dot--left" />

            <div className="ridetail-ride-track">
              <span className="ridetail-ride-dur">
                {secondsToHM(ride.duration_seconds)}
              </span>
            </div>

            <div className="ridetail-ride-dot ridetail-ride-dot--right" />
          </div>

          <div className="ridetail-ride-point ridetail-ride-point--right">
            <span className="ridetail-ride-time">
              {formatTime(ride.estimated_reach_time)}
            </span>

            <span className="ridetail-ride-city">
              {ride.destination_address?.split(",")[0]}
            </span>
          </div>
        </div>

        <div className="ridetail-ride-price">
          <span className="ridetail-price-main">
            ₹{Number(ride.price_per_seat * noOfSIt).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Driver */}
      <div className="ridetail-ride-bottom">
        <div className="ridetail-driver-row">
          <span className="ridetail-car-icon">
            <FaCarSide />
          </span>

          <div
            className="ridetail-avatar"
            style={{
              background: bg,
              color: textColor,
            }}
          >
            {ride.driver_profile_picture ? (
              <img
                src={ride.driver_profile_picture}
                // alt={ride.driver_name}
                className="ridetail-avatar-img"
              />
            ) : (
              getInitials(ride.driver_name)
            )}
          </div>
          <div>
            <div className="all-ride-driver-details">
              <span className="ridetail-driver-name">{ride.driver_name}</span>

              <MdVerified className="verify-driver" />
            </div>

            <StarRating rating={ride.driver_rating || 3.5} />
          </div>
        </div>

        <div className="ridetail-badges">
          {ride.instant_booking === "yes" && (
            <span className="ridetail-badge ridetail-badge--instant">
              <GiCometSpark />
              Instant Booking
            </span>
          )}

          {ride.max_two_in_back === "yes" && (
            <span className="ridetail-badge ridetail-badge--back">
              <FaUserGroup />
              Max. 2 in the back
            </span>
          )}

          {ride.smoking_allowed === "yes" && (
            <span className="ridetail-badge ridetail-badge--back">
              <FaSmoking />
              Smoking allowed
            </span>
          )}

          {ride.pet_allowed === "yes" && (
            <span className="ridetail-badge ridetail-badge--back">
              <IoFastFoodSharp />
              Pets allowed
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="ridetail-status-row">
        <span
          className={`ridetail-status-pill${
            status.passed
              ? " ridetail-status-pill--passed"
              : " ridetail-status-pill--active"
          }`}
        >
          <span className="ridetail-status-dot" />
          {status.label}
        </span>

        {status.passed && (
          <span className="ridetail-status-unavail">Not available</span>
        )}
      </div>
    </div>
  );
}
