"use client";
import Image from "next/image";
import { useState } from "react";
import { FiEdit, FiEye, FiX } from "react-icons/fi";
import { IoDocumentText } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
const InfoRow = ({ label, value }) => (
  <div className="vehicle-detl-info-row">
    <span className="vehicle-detl-info-label">{label}</span>
    <span className="vehicle-detl-info-value">{value || "—"}</span>
  </div>
);

const PhotoGrid = ({ vehicle, onPreview }) => {
  const photos = [
    { label: "Front View", src: vehicle.front_image },
    { label: "Back View", src: vehicle.back_image },
    { label: "Side View", src: vehicle.side_image },
    { label: "Number Plate", src: vehicle.number_plate_image },
  ];
  console.log("photoes", photos);

  return (
    <div className="vehicle-detl-photo-grid">
      {photos.map(({ label, src }) => (
        <div key={label} className="vehicle-detl-photo-item">
          <Image
            src={src}
            alt={label}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
          <span className="vehicle-detl-photo-label">{label}</span>
          {src && (
            <button
              type="button"
              className="document-preview-button"
              onClick={() => onPreview(src, label)}
              aria-label={`Preview ${label}`}
              title={`Preview ${label}`}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <FiEye size={13} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default function VehicleDetailPanel({ vehicle, onEdit }) {
  // ── Preview modal state (same pattern as DocumentCard) ──
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const handleOpenPreview = (src, title) => {
    if (!src) return;
    setPreviewSrc(src);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc(null);
    setPreviewTitle("");
  };

  return (
    <div className="vehicle-detl-panel">
      {/* ── Panel header ── */}
      <div className="vehicle-detl-panel-header">
        <div className="vd-car-name-icon">
          <div className="vehicle-detl-card-icon">
            <FaCar />
          </div>
          <div>
            <h2 className="vehicle-detl-panel-title">
              {vehicle.brand} {vehicle.model}
            </h2>

            <p className="vehicle-detl-panel-reg">
              {vehicle.registration_number}
            </p>
          </div>
        </div>
        {/* <div className="vehicle-detl-panel-actions">
          <button
            className="vehicle-detl-edit-btn"
            onClick={onEdit}
            type="button"
          >
            <FiEdit />
            Edit
          </button>
        </div> */}
      </div>

      {/* ── Vehicle photos ── */}
      <div className="vehicle-detl-section">
        <h3 className="vehicle-detl-section-title">Vehicle Photos</h3>
        <PhotoGrid vehicle={vehicle} onPreview={handleOpenPreview} />
      </div>

      {/* ── Basic info ── */}
      <div className="vehicle-detl-section">
        <h3 className="vehicle-detl-section-title">Basic Information</h3>
        <div className="vehicle-detl-info-grid">
          <InfoRow label="Brand" value={vehicle.brand} />
          <InfoRow label="Model" value={vehicle.model} />
          <InfoRow label="Color" value={vehicle.color} />
          <InfoRow label="Manufacture Year" value={vehicle.manufacture_year} />
          <InfoRow label="Fuel Type" value={vehicle.fuel_type} />
          <InfoRow label="Total Seats" value={vehicle.seats} />
          <InfoRow label="Available Seats" value={vehicle.available_seats} />
          <InfoRow
            label="Registration No."
            value={vehicle.registration_number}
          />
        </div>
      </div>

      {/* ── Documents ── */}
      <div className="vehicle-detl-section">
        <h3 className="vehicle-detl-section-title">Documents</h3>
        <div className="vehicle-detl-info-grid">
          <InfoRow label="RC Number" value={vehicle.rc_number} />
          <InfoRow label="RC Expiry Date" value={vehicle.rc_expiry_date} />
          <InfoRow
            label="Insurance Provider"
            value={vehicle.insurance_provider}
          />
          <InfoRow label="Policy Number" value={vehicle.policy_number} />
          <InfoRow label="Insurance Expiry" value={vehicle.insurance_expiry} />
        </div>
        <div className="vehicle-detl-doc-links">
          {vehicle.rc_file && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a
                href={vehicle.rc_file}
                target="_blank"
                rel="noreferrer"
                className="vehicle-detl-doc-btn"
              >
                <IoDocumentText size={14} />
                RC Document
              </a>
              <button
                type="button"
                className="document-preview-button"
                onClick={() =>
                  handleOpenPreview(vehicle.rc_file, "RC Document")
                }
                aria-label="Preview RC Document"
                title="Preview RC Document"
              >
                <FiEye size={18} />
              </button>
            </div>
          )}
          {vehicle.insurance_file && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <a
                href={vehicle.insurance_file}
                target="_blank"
                rel="noreferrer"
                className="vehicle-detl-doc-btn"
              >
                <IoDocumentText size={14} />
                Insurance Document
              </a>
              <button
                type="button"
                className="document-preview-button"
                onClick={() =>
                  handleOpenPreview(
                    vehicle.insurance_file,
                    "Insurance Document",
                  )
                }
                aria-label="Preview Insurance Document"
                title="Preview Insurance Document"
              >
                <FiEye size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Preview Modal (same markup/classnames as DocumentCard) ── */}
      {previewOpen && previewSrc && (
        <div
          className="document-preview-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleClosePreview}
        >
          <div
            className="document-preview-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="document-preview-close"
              onClick={handleClosePreview}
              aria-label="Close preview"
            >
              <FiX size={22} />
            </button>

            <div className="document-preview-content">
              <img
                src={previewSrc}
                alt={`${previewTitle} preview`}
                className="document-preview-image"
              />
            </div>

            <div className="document-preview-title">{previewTitle}</div>
          </div>
        </div>
      )}
    </div>
  );
}
