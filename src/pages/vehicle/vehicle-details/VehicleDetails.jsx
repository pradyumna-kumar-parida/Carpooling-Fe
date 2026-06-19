// src/pages/Vehicle/VehicleDetails.jsx

import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

import { useVehicleDetails } from "./vehicle-details/hooks/useVehicleDetails";
import VehicleCard from "./vehicle-details/components/VehicleCard";
import VehicleDetailPanel from "./vehicle-details/components/VehicleDetailPanel";
import VehicleEditModal from "./vehicle-details/components/VehicleEditModal";
import EmptyState from "./vehicle-details/components/EmptyState";
import { useVehicleList } from "../../context/VehicleContext";
import { FiPlus } from "react-icons/fi";
function PageLoader() {
  return (
    <div className="vehicle-detl-loader">
      <div className="vehicle-detl-spinner" />
    </div>
  );
}

export default function VehicleDetails() {
  const navigate = useNavigate();
  const {
    vehicles,
    selected,
    setSelected,
    loading,
    error,
    editOpen,
    editData,
    editLoading,
    handleEditOpen,
    handleEditClose,
    handleEditChange,
    handleEditSubmit,
    toast,
    closeToast,
  } = useVehicleDetails();

  const { vehicleList } = useVehicleList();
  return (
    <>
      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={toast.type}
          variant="filled"
          onClose={closeToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* ── Edit modal ── */}
      <VehicleEditModal
        open={editOpen}
        onClose={handleEditClose}
        editData={editData}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />

      <div className="vehicle-detl-page">
        {/* ── Page header ── */}
        <div className="vehicle-detl-header">
          <div>
            <h1 className="vehicle-detl-title">My Vehicles</h1>
            <p className="vehicle-detl-subtitle">
              Manage your registered vehicles
            </p>
          </div>
          {vehicleList.length > 0 && (
            <button
              className="vehicle-detl-add-btn"
              onClick={() => navigate("/vehicle-registration")}
            >
              <FiPlus size={16} /> Add New Vehicle
            </button>
          )}
        </div>

        {loading && <PageLoader />}
        {error && <div className="vehicle-detl-error">{error}</div>}

        {!loading && !error && vehicles.length === 0 && <EmptyState />}

        {!loading && !error && vehicles.length > 0 && (
          <div className="vehicle-detl-layout">
            {/* ── Left: vehicle list ── */}
            <aside className="vehicle-detl-sidebar">
              <p className="vehicle-detl-sidebar-label">
                {vehicles.length} Vehicle{vehicles.length > 1 ? "s" : ""}{" "}
                Registered
              </p>
              <div className="vehicle-detl-card-list">
                {vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    isSelected={selected?.id === v.id}
                    onClick={() => setSelected(v)}
                  />
                ))}
              </div>
            </aside>

            {/* ── Right: detail panel ── */}
            <main className="vehicle-detl-main">
              {selected ? (
                <VehicleDetailPanel
                  vehicle={selected}
                  onEdit={handleEditOpen}
                />
              ) : (
                <div className="vehicle-detl-select-hint">
                  Select a vehicle to view details
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </>
  );
}
