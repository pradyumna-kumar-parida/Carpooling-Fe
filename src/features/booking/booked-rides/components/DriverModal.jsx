import { Dialog, DialogContent, Button, Chip } from "@mui/material";
import { BsShieldCheck } from "react-icons/bs";
import { FaPhone, FaEnvelope } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";

import Avatar from "./Avatar";

export default function DriverModal({ open, onClose, ride }) {
  if (!ride) return null;

  const vehicleFields = [
    ["Type", ride?.vehicle_details?.vehicle_type],
    ["Brand", ride?.vehicle_details?.brand],
    ["Model", ride?.vehicle_details?.model],
    ["Year", ride?.vehicle_details?.manufacture_year],
    ["Fuel", ride?.vehicle_details?.fuel_type],
    ["Reg. No", ride?.vehicle_details?.registration_number],
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
            src={ride?.driver_details?.user_details?.profile_picture}
            name={ride?.driver_details?.name}
            className="dm-avatar"
          />

          <div className="dm-header-info">
            <h2 className="dm-driver-name">{ride?.driver_details?.name}   <MdVerified className="verify-driver" /></h2>

           
          </div>
        </div>

        <div className="dm-body">
          {/* Contact */}
          <div className="dm-contact-row">
            <FaPhone className="dm-contact-icon" />
            <span className="dm-contact-value">
              {ride?.driver_details?.phone}
            </span>
          </div>

          <div className="dm-contact-row">
            <FaEnvelope className="dm-contact-icon" />
            <span className="dm-contact-value">
              {ride?.driver_details?.email}
            </span>
          </div>

          {/* Vehicle Details */}
          <div className="dm-section">
            <h3 className="dm-section-title">Vehicle Details</h3>

            <div className="dm-vehicle-grid">
              {vehicleFields.map(([label, value]) => (
                <div key={label} className="dm-vehicle-field">
                  <span className="dm-vehicle-label">{label}</span>

                  <span className="dm-vehicle-value">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ride Preferences */}
          <div className="dm-section">
            <h3 className="dm-section-title">Ride Preferences</h3>

            <div className="dm-chips-wrap">
              {preferenceChips
                .filter((p) => ride[p.key] === "yes")
                .map((p) => (
                  <span key={p.key} className={p.className}>
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
