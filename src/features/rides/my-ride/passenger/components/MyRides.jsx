"use client";

import { useState } from "react";
import { useMyRides } from "../hooks/UseMyRides";
import RideCard from "./RideCard";
import RideDetailsModal from "./RideDetailsModal";
import CancelRideModal from "./CancelBooking";
import ChatPanel from "@/features/chat/ChatPanel";
import { FaCar } from "react-icons/fa";
import { useRouter } from "next/navigation";

const TAB_CONFIG = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "expired", label: "Expired" },
  { id: "ongoing", label: "Ongoing" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

export default function MyRides({ userRides }) {
  const {
    activeTab,
    setActiveTab,
    selectedRide,
    openDetailsModal,
    groupedRides,
    getRidesData,
    handleViewDetails,
    handleCloseDetails,
    rideToCancel,
    isCancelling,
    cancelError,
    handleOpenCancel,
    handleCloseCancel,
    handleConfirmCancel,
  } = useMyRides(userRides);

  const rides = getRidesData();
  const [showChat, setShowChat] = useState(false);
  const [selectedChatRide, setSelectedChatRide] = useState(null);
  console.log("passenger rides ",rides);
  
const router = useRouter()
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
          {TAB_CONFIG.map((tab) => (
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
                {groupedRides[tab.id]?.length || 0}
              </i>
            </button>
          ))}
        </div>

        {/* Rides Grid */}
        <div className="myride-grid">
          {rides.length === 0 ? (
            <div className="myride-empty">
              <div className="empty-icon">
                <FaCar  />
              </div>
              <h3>No rides found</h3>
              <p>You don&apos;t have any {activeTab} rides yet.</p>
              {/* <button className="vehicle-detl-add-btn" onClick={()=>router.push("/find-ride")}> Book Your First Ride</button> */}
            </div>
          ) : (
            rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onViewDetails={handleViewDetails}
                onOpenChat={(r) => {
                  setSelectedChatRide(r);
                  setShowChat(true);
                }}
                onCancelClick={handleOpenCancel}
              />
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {openDetailsModal && (
        <RideDetailsModal ride={selectedRide} onClose={handleCloseDetails} />
      )}

      {/* Cancel Confirmation Modal */}
      {rideToCancel && (
        <CancelRideModal
          ride={rideToCancel}
          onClose={handleCloseCancel}
          onConfirm={handleConfirmCancel}
          isSubmitting={isCancelling}
          errorMessage={cancelError}
        />
      )}

      {/* Chat Panel */}
      {showChat && (
        <ChatPanel
          driver={selectedChatRide}
          bookingId={selectedChatRide?.id}
          bookingCode={selectedChatRide?.bookingCode}
          defaultOpen={true}
          onClose={() => {
            setShowChat(false);
            setSelectedChatRide(null);
          }}
        />
      )}
    </div>
  );
}
