"use client";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FormLabel } from "@mui/material";
import Image from "next/image";

export default function PhotoUploadBox({
  fieldKey,
  label,
  file,
  preview,
  error,
  onChange,
  onRemove,
}) {
  if (file) {
    return (
      <div className="vehicledetails-photo-item">
        <FormLabel className="vehicledetails-label">{label} *</FormLabel>
        <div className="vehicledetails-photo-preview">
          <Image src={preview} alt={label} fill />
          <button
            className="vehicledetails-photo-remove"
            onClick={() => onRemove(fieldKey)}
            type="button"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicledetails-photo-item">
      <FormLabel className="vehicledetails-label">{label} *</FormLabel>
      <div className={`vehicledetails-photo-box ${error ? "error" : ""}`}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e, fieldKey)}
          className="vehicledetails-file-input"
          id={fieldKey}
        />
        <label htmlFor={fieldKey} className="vehicledetails-photo-label">
          <FaCloudUploadAlt />
          <span>Upload</span>
        </label>
      </div>
      {error && <span className="vehicledetails-error">{error}</span>}
    </div>
  );
}
