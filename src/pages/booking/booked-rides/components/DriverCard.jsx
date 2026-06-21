import { FaAngleRight } from "react-icons/fa6";
import { MdFreeCancellation } from "react-icons/md";
import { GiCometSpark } from "react-icons/gi";
import { FaCar } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { FaSmoking } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";

import Avatar from "./Avatar";

export default function DriverCard({
  ride,
  onDriverClick,
}) {
  const preferences = [
    {
      show: ride?.max_two_in_back === "yes",
      icon: <FaUserGroup />,
      text: "Max. 2 passengers in the back",
    },
    {
      show: ride?.smoking_allowed === "yes",
      icon: <FaSmoking />,
      text: "Smoking allowed",
    },
    {
      show: ride?.pet_allowed === "yes",
      icon: <IoFastFoodSharp />,
      text: "Pets allowed",
    },
  ];

  return (
    <div className="ride-confirm-card ride-driver-card">
      {/* Driver */}
      <div
        className="driver-all-details"
        onClick={onDriverClick}
      >
        <div className="driver-info">
          <Avatar
            src={ride?.driver_profile_picture}
            name={ride?.driver_name}
            className="driver-avatar"
            style={{ objectFit: "cover" }}
          />

          <span
            className="driver-name"
            style={{ textTransform: "capitalize" }}
          >
            {ride?.driver_name}

            <b
              style={{
                fontSize: "14px",
                color: "#6b6969",
              }}
            >
              {" "}
              (Driver)
            </b>
          </span>
        </div>

        <button
          type="button"
          className="driver-arrow"
        >
          <FaAngleRight />
        </button>
      </div>

      <hr />

      {/* Ride Details */}
      <div className="ride-details-card">
        <div className="detail-item">
          <div className="detail-icon">
            <MdFreeCancellation />
          </div>

          <span className="detail-text">
            {ride?.instant_booking === "yes"
              ? "Instant booking confirmed"
              : "Sometimes cancels rides"}
          </span>
        </div>

        {ride?.instant_booking === "yes" && (
          <div className="detail-item">
            <div className="detail-icon">
              <GiCometSpark />
            </div>

            <span className="detail-text">
              Your booking will be confirmed instantly
            </span>
          </div>
        )}

        <div className="detail-item">
          <div className="detail-icon">
            <FaCar />
          </div>

          <span className="detail-text">
            <b
              style={{
                textTransform: "capitalize",
              }}
            >
              {ride?.brand} {ride?.model}
            </b>
            {" · "}
            {ride?.fuel_type}
            {" · "}
            {ride?.registration_number}
          </span>
        </div>

        {preferences
          .filter((p) => p.show)
          .map((p) => (
            <div
              key={p.text}
              className="detail-item"
            >
              <div className="detail-icon">
                {p.icon}
              </div>

              <span className="detail-text">
                {p.text}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}