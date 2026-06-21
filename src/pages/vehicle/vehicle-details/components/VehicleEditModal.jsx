"use client";
import { Dialog, DialogContent } from "@mui/material";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric (EV)", "Hybrid"];
const COLORS = [
  "White",
  "Black",
  "Silver",
  "Red",
  "Blue",
  "Grey",
  "Green",
  "Yellow",
  "Orange",
  "Others",
];
const SEAT_OPTIONS = ["2", "3", "4", "5", "6", "7", "8"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => String(CURRENT_YEAR - i));

const Field = ({ label, name, value, onChange, type = "text", options }) => (
  <div className="vehicle-detl-field">
    <label className="vehicle-detl-field-label">{label}</label>
    {options ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="vehicle-detl-field-input"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="vehicle-detl-field-input"
      />
    )}
  </div>
);

export default function VehicleEditModal({
  open,
  onClose,
  editData,
  onChange,
  onSubmit,
  loading,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          className: "vehicle-detl-modal",
        },
      }}
    >
      <DialogContent className="vehicle-detl-modal-content">
        <div className="vehicle-detl-modal-header">
          <h2 className="vehicle-detl-modal-title">Edit Vehicle Details</h2>
          <button className="vehicle-detl-modal-close" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              width="18"
              height="18"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="vehicle-detl-modal-grid">
          <Field
            label="Brand"
            name="brand"
            value={editData.brand}
            onChange={onChange}
          />
          <Field
            label="Model"
            name="model"
            value={editData.model}
            onChange={onChange}
          />
          <Field
            label="Color"
            name="color"
            value={editData.color}
            onChange={onChange}
            options={COLORS}
          />
          <Field
            label="Manufacture Year"
            name="manufacture_year"
            value={editData.manufacture_year}
            onChange={onChange}
            options={YEARS}
          />
          <Field
            label="Fuel Type"
            name="fuel_type"
            value={editData.fuel_type}
            onChange={onChange}
            options={FUEL_TYPES}
          />
          <Field
            label="Seats"
            name="seats"
            value={String(editData.seats || "")}
            onChange={onChange}
            options={SEAT_OPTIONS}
          />
          <Field
            label="Registration Number"
            name="registration_number"
            value={editData.registration_number}
            onChange={onChange}
          />
          <Field
            label="RC Number"
            name="rc_number"
            value={editData.rc_number}
            onChange={onChange}
          />
          <Field
            label="RC Expiry Date"
            name="rc_expiry_date"
            value={editData.rc_expiry_date}
            onChange={onChange}
            type="date"
          />
          <Field
            label="Insurance Provider"
            name="insurance_provider"
            value={editData.insurance_provider}
            onChange={onChange}
          />
          <Field
            label="Policy Number"
            name="policy_number"
            value={editData.policy_number}
            onChange={onChange}
          />
          <Field
            label="Insurance Expiry"
            name="insurance_expiry"
            value={editData.insurance_expiry}
            onChange={onChange}
            type="date"
          />
        </div>

        <div className="vehicle-detl-modal-footer">
          <button
            className="vehicle-detl-cancel-btn"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="vehicle-detl-save-btn"
            type="button"
            onClick={onSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.75 : 1 }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
