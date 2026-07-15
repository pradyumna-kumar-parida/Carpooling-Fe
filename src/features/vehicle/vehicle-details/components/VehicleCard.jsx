import { FaCar } from "react-icons/fa";
export default function VehicleCard({ vehicle, isSelected, onClick }) {
  const statusColor =
    {
      active: "vehicle-detl-badge--active",
      pending: "vehicle-detl-badge--pending",
      rejected: "vehicle-detl-badge--rejected",
    }[vehicle.status] || "vehicle-detl-badge--pending";

  return (
    <div
      type="button"
      className={`vehicle-detl-card ${isSelected ? "vehicle-detl-card--selected" : ""}`}
      onClick={onClick}
    >
      <div className="vehicle-detl-card-top">
        <div className="vehicle-detl-card-icon">
          <FaCar />
        </div>
        <span className={`vehicle-detl-badge ${statusColor}`}>
          {vehicle.status}
        </span>
      </div>
      <div className="vehicle-detl-card-info">
        <h3 className="vehicle-detl-card-name">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="vehicle-detl-card-reg">{vehicle.registration_number}</p>
        <div className="vehicle-detl-card-meta">
          <span>{vehicle.fuel_type}</span>
          <span className="vehicle-detl-dot" />
          <span>{vehicle.seats} seats</span>
          <span className="vehicle-detl-dot" />
          <span>{vehicle.manufacture_year}</span>
        </div>
      </div>
    </div>
  );
}
