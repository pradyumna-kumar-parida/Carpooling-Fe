// src/pages/Vehicle/vehicle-registration/components/StepFeaturesPhotos.jsx

import { TextField, MenuItem, Alert } from "@mui/material";
import { FUEL_TYPES, SEAT_OPTIONS, PHOTO_FIELDS } from "../constants/vehicleConstants";
import PhotoUploadBox from "./PhotoUploadBox";

export default function StepFeaturesPhotos({
  vehicleData, filePreview, errors, onChange, onFileChange, onFileRemove,
}) {
  return (
    <div className="vehicledetails-section">
      <h2 className="vehicledetails-section-title">Vehicle Capacity &amp; Features</h2>

      <div className="vehicledetails-grid-3">
        <TextField
          select fullWidth label="Number of Seats *" name="numberOfSeats"
          value={vehicleData.numberOfSeats} onChange={onChange}
          error={!!errors.numberOfSeats} helperText={errors.numberOfSeats}
          className="vehicledetails-input"
        >
          {SEAT_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s} Seats</MenuItem>)}
        </TextField>

        <TextField
          select fullWidth label="Fuel Type *" name="fuelType"
          value={vehicleData.fuelType} onChange={onChange}
          error={!!errors.fuelType} helperText={errors.fuelType}
          className="vehicledetails-input"
        >
          {FUEL_TYPES.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
        </TextField>
      </div>

      <div className="vehicledetails-photos-section">
        <h3 className="vehicledetails-subsection-title">Vehicle Photos *</h3>
        <Alert severity="info" className="vehicledetails-alert">
          Upload clear photos of your vehicle from all angles
        </Alert>
        <div className="vehicledetails-photo-grid">
          {PHOTO_FIELDS.map(({ key, label }) => (
            <PhotoUploadBox
              key={key} fieldKey={key} label={label}
              file={vehicleData[key]} preview={filePreview[key]}
              error={errors[key]}
              onChange={onFileChange} onRemove={onFileRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}