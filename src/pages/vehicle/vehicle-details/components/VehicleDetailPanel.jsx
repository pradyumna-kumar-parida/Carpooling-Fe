"use client";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { IoDocumentText } from "react-icons/io5";
const InfoRow = ({ label, value }) => (
  <div className="vehicle-detl-info-row">
    <span className="vehicle-detl-info-label">{label}</span>
    <span className="vehicle-detl-info-value">{value || "—"}</span>
  </div>
);

const PhotoGrid = ({ vehicle }) => {
  const photos = [
    { label: "Front View", src: vehicle.front_image },
    { label: "Back View", src: vehicle.back_image },
    { label: "Side View", src: vehicle.side_image },
    { label: "Number Plate", src: vehicle.number_plate_image },
  ];
  return (
    <div className="vehicle-detl-photo-grid">
      {photos.map(({ label, src }) => (
        <div key={label} className="vehicle-detl-photo-item">
          <Image src={src} alt={label} fill/>
          <span className="vehicle-detl-photo-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default function VehicleDetailPanel({ vehicle, onEdit }) {
  return (
    <div className="vehicle-detl-panel">
      {/* ── Panel header ── */}
      <div className="vehicle-detl-panel-header">
        <div>
          <h2 className="vehicle-detl-panel-title">
            {vehicle.brand} {vehicle.model}
          </h2>
          <p className="vehicle-detl-panel-reg">
            {vehicle.registration_number}
          </p>
        </div>
        <div className="vehicle-detl-panel-actions">
          <button
            className="vehicle-detl-edit-btn"
            onClick={onEdit}
            type="button"
          >
            <FiEdit />
            Edit
          </button>
        </div>
      </div>

      {/* ── Vehicle photos ── */}
      <div className="vehicle-detl-section">
        <h3 className="vehicle-detl-section-title">Vehicle Photos</h3>
        <PhotoGrid vehicle={vehicle} />
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
            <a
              href={vehicle.rc_file}
              target="_blank"
              rel="noreferrer"
              className="vehicle-detl-doc-btn"
            >
              <IoDocumentText size={14} />
              RC Document
            </a>
          )}
          {vehicle.insurance_file && (
            <a
              href={vehicle.insurance_file}
              target="_blank"
              rel="noreferrer"
              className="vehicle-detl-doc-btn"
            >
              <IoDocumentText size={14} />
              Insurance Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
