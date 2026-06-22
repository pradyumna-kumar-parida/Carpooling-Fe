// src/pages/Vehicle/vehicle-registration/components/StepDocuments.jsx

import { TextField, FormLabel, Alert } from "@mui/material";
import FileUploadBox from "./FileUploadBox";

export default function StepDocuments({
  vehicleData,
  filePreview,
  errors,
  onChange,
  onFileChange,
  onFileRemove,
}) {
  return (
    <div className="vehicledetails-section">
      <h2 className="vehicledetails-section-title">
        Registration &amp; Documents
      </h2>

      <Alert severity="info" className="vehicledetails-alert">
        Please ensure all documents are clear and valid. Maximum file size: 5MB
      </Alert>

      <div className="vehicledetails-grid-2">
        <TextField
          fullWidth
          label="RC Number *"
          name="rcNumber"
          value={vehicleData.rcNumber}
          onChange={onChange}
          placeholder="e.g., TS09EA1234567890"
          error={!!errors.rcNumber}
          helperText={errors.rcNumber}
          className="vehicledetails-input"
        />
        <TextField
          fullWidth
          type="date"
          label="RC Expiry Date *"
          name="rcExpiryDate"
          value={vehicleData.rcExpiryDate}
          onChange={onChange}
          error={!!errors.rcExpiryDate}
          helperText={errors.rcExpiryDate}
          className="vehicledetails-input"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className="vehicledetails-upload-section">
        <FormLabel className="vehicledetails-label">
          Upload RC Document *
        </FormLabel>
        <FileUploadBox
          fieldName="rcDocument"
          file={vehicleData.rcDocument}
          preview={filePreview.rcDocument}
          error={errors.rcDocument}
          accept="image/*,.pdf"
          onChange={onFileChange}
          onRemove={onFileRemove}
        />
        {errors.rcDocument && (
          <span className="vehicledetails-error">{errors.rcDocument}</span>
        )}
      </div>
    </div>
  );
}
