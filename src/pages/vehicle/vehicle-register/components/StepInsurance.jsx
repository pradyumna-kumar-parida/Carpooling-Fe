// src/pages/Vehicle/vehicle-registration/components/StepInsurance.jsx

import { TextField, MenuItem, FormLabel } from "@mui/material";
import { MANUFACTURE_YEARS } from "../constants/vehicleConstants";
import FileUploadBox from "./FileUploadBox";

export default function StepInsurance({
  vehicleData, filePreview, errors, onChange, onFileChange, onFileRemove,
}) {
  return (
    <div className="vehicledetails-section">
      <h2 className="vehicledetails-section-title">Insurance Details</h2>

      <div className="vehicledetails-grid-2">
        <TextField
          fullWidth label="Insurance Provider *" name="insuranceProvider"
          value={vehicleData.insuranceProvider} onChange={onChange}
          placeholder="e.g., ICICI Lombard, HDFC ERGO"
          error={!!errors.insuranceProvider} helperText={errors.insuranceProvider}
          className="vehicledetails-input"
        />
        <TextField
          fullWidth label="Policy Number *" name="policyNumber"
          value={vehicleData.policyNumber} onChange={onChange}
          placeholder="e.g., POL1234567890"
          error={!!errors.policyNumber} helperText={errors.policyNumber}
          className="vehicledetails-input"
        />
      </div>

      <div className="vehicledetails-grid-2">
        <TextField
          fullWidth type="date" label="Insurance Expiry Date *" name="insuranceExpiryDate"
          value={vehicleData.insuranceExpiryDate} onChange={onChange}
          error={!!errors.insuranceExpiryDate} helperText={errors.insuranceExpiryDate}
          className="vehicledetails-input" slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        <TextField
          select fullWidth label="Vehicle Manufacture Year *" name="manufacturyDate"
          value={vehicleData.manufacturyDate} onChange={onChange}
          error={!!errors.manufacturyDate} helperText={errors.manufacturyDate}
          className="vehicledetails-input"
        >
          {MANUFACTURE_YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </TextField>
      </div>

      <div className="vehicledetails-upload-section">
        <FormLabel className="vehicledetails-label">Upload Insurance Document *</FormLabel>
        <FileUploadBox
          fieldName="insuranceDocument"
          file={vehicleData.insuranceDocument} preview={filePreview.insuranceDocument}
          error={errors.insuranceDocument} accept="image/*,.pdf"
          onChange={onFileChange} onRemove={onFileRemove}
        />
        {errors.insuranceDocument && <span className="vehicledetails-error">{errors.insuranceDocument}</span>}
      </div>
    </div>
  );
}