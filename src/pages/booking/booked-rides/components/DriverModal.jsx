import { Dialog, DialogContent, Button, Chip } from "@mui/material";
import { BsShieldCheck } from "react-icons/bs";
import { FaPhone, FaEnvelope } from "react-icons/fa6";

import Avatar from "./Avatar";

export default function DriverModal({
  open,
  onClose,
  ride,
}) {
  if (!ride) return null;

  const vehicleFields = [
    ["Type", ride.vehicle_type],
    ["Brand", ride.brand],
    ["Model", ride.model],
    ["Year", ride.manufacture_year],
    ["Fuel", ride.fuel_type],
    ["Reg. No", ride.registration_number],
  ];

  const preferenceChips = [
    {
      key: "instant_booking",
      label: "Instant Booking",
      className: "dm-chip dm-chip--instant",
    },
    {
      key: "max_two_in_back",
      label: "Max 2 in back",
      className: "dm-chip",
    },
    {
      key: "smoking_allowed",
      label: "Smoking OK",
      className: "dm-chip",
    },
    {
      key: "pet_allowed",
      label: "Pets OK",
      className: "dm-chip",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: "dm-paper",
      }}
    >
      <DialogContent className="dm-content">
        {/* Driver Header */}
        <div className="dm-header">
          <Avatar
            src={ride.driver_profile_picture}
            name={ride.driver_name}
            className="dm-avatar"
          />

          <div className="dm-header-info">
            <h2 className="dm-driver-name">
              {ride.driver_name}
            </h2>

            <div className="dm-verified-row">
              {ride.driver_is_verified === "1" ? (
                <Chip
                  icon={<BsShieldCheck />}
                  label="Verified Driver"
                  size="small"
                  color="success"
                />
              ) : (
                <Chip
                  label="Not Verified"
                  size="small"
                  color="default"
                />
              )}
            </div>
          </div>
        </div>

        <div className="dm-body">
          {/* Contact */}
          <div className="dm-contact-row">
            <FaPhone className="dm-contact-icon" />
            <span className="dm-contact-value">
              {ride.driver_phone}
            </span>
          </div>

          <div className="dm-contact-row">
            <FaEnvelope className="dm-contact-icon" />
            <span className="dm-contact-value">
              {ride.driver_email}
            </span>
          </div>

          {/* Vehicle Details */}
          <div className="dm-section">
            <h3 className="dm-section-title">
              Vehicle Details
            </h3>

            <div className="dm-vehicle-grid">
              {vehicleFields.map(([label, value]) => (
                <div
                  key={label}
                  className="dm-vehicle-field"
                >
                  <span className="dm-vehicle-label">
                    {label}
                  </span>

                  <span className="dm-vehicle-value">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ride Preferences */}
          <div className="dm-section">
            <h3 className="dm-section-title">
              Ride Preferences
            </h3>

            <div className="dm-chips-wrap">
              {preferenceChips
                .filter((p) => ride[p.key] === "yes")
                .map((p) => (
                  <span
                    key={p.key}
                    className={p.className}
                  >
                    {p.label}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          className="dm-close-btn"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}