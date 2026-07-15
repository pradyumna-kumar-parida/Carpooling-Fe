"use client";

import { useMyRides, RIDES_DATA } from "../hooks/UseMyRides";
import RideCard from "./RideCard";
import RideDetailsModal from "./RideDetailsModal";

const { requestRides, upcomingRides, completedRides, cancelledRides } =
  RIDES_DATA;

const TABS = [
  { id: "requests", label: "Requests", count: requestRides.length },
  { id: "upcoming", label: "Upcoming", count: upcomingRides.length },
  { id: "completed", label: "Completed", count: completedRides.length },
  { id: "cancelled", label: "Cancelled", count: cancelledRides.length },
];

export default function MyRides() {
  const {
    activeTab,
    setActiveTab,
    selectedRide,
    openDetailsModal,
    getRidesData,
    handleViewDetails,
    handleCloseDetails,
  } = useMyRides();

  const rides = getRidesData();

  return (
    <div className="myride-page">
      <div className="myride-container">
        {/* Header */}
        <div className="myride-header">
          <h1 className="vehicledetails-title">My Rides</h1>
          <p className="vehicledetails-subtitle">
            Manage your carpooling journeys
          </p>
        </div>

        {/* Tabs */}
        <div className="myride-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`myride-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <i
                className="msg-count"
                style={{
                  backgroundColor: activeTab === tab.id ? "#ffffff" : "#000000",
                  color: activeTab === tab.id ? "#000000" : "#ffffff",
                }}
              >
                {tab.count}
              </i>
            </button>
          ))}
        </div>

        {/* Rides Grid */}
        <div className="myride-grid">
          {rides.length === 0 ? (
            <div className="myride-empty">
              <div className="empty-icon">🚗</div>
              <h3>No rides found</h3>
              <p>You don't have any {activeTab} rides yet.</p>
            </div>
          ) : (
            rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {openDetailsModal && (
        <RideDetailsModal ride={selectedRide} onClose={handleCloseDetails} />
      )}
    </div>
  );
}
