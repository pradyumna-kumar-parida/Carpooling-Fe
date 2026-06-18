// src/pages/Auth/signup/components/FileField.jsx

import { IoCloudUploadOutline } from "react-icons/io5";

export default function FileField({ id, label, value, onChange }) {
  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="field-input-box" style={{ cursor: "pointer", position: "relative" }}>
        <span className="field-icon"><IoCloudUploadOutline /></span>
        <span
          className="file-upload-field-icon field-input"
          style={{ color: value ? "inherit" : "#aaa" }}
        >
          {value ? value.name : "Choose file…"}
        </span>
        <input
          type="file"
          id={id}
          accept="image/*,.pdf"
          required
          onChange={onChange}
          className="file-upload-suggestation"
        />
      </div>
    </div>
  );
}