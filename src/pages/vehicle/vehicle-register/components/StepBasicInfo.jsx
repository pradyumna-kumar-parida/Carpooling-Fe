// src/pages/Vehicle/vehicle-registration/components/StepBasicInfo.jsx

import { TextField, MenuItem } from "@mui/material";
import { FaCar } from "react-icons/fa";
import { CAR_BRANDS, COLORS } from "../constants/vehicleConstants";

export default function StepBasicInfo({ vehicleData, errors, onChange }) {
  return (
    <div className="vehicledetails-section">
      <h2 className="vehicledetails-section-title">
        <FaCar className="vehicledetails-section-icon" />
        Basic Vehicle Information
      </h2>

      <div className="vehicledetails-grid-2">
        <TextField
          select
          fullWidth
          label="Brand *"
          name="brand"
          value={vehicleData.brand}
          onChange={onChange}
          error={!!errors.brand}
          helperText={errors.brand}
        >
          {CAR_BRANDS.map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Model *"
          name="model"
          value={vehicleData.model}
          onChange={onChange}
          placeholder="e.g., Swift, Activa, RE Classic"
          error={!!errors.model}
          helperText={errors.model}
          className="vehicledetails-input"
        />
      </div>

      <div className="vehicledetails-grid-2">
        <TextField
          select
          fullWidth
          label="Color *"
          name="color"
          value={vehicleData.color}
          onChange={onChange}
          error={!!errors.color}
          helperText={errors.color}
          className="vehicledetails-input"
        >
          {COLORS.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Registration Number *"
          name="registrationNumber"
          value={vehicleData.registrationNumber}
          onChange={onChange}
          placeholder="e.g., TS09EA1234"
          error={!!errors.registrationNumber}
          helperText={errors.registrationNumber}
          className="vehicledetails-input"
          inputProps={{
            style: {
              textTransform: "uppercase",
            },
          }}
        />
      </div>
    </div>
  );
}
