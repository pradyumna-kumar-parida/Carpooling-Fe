"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import MapPanel from "./components/MapPanel";
import RideDetailsCard from "./components/RideDetailsCard";
import DriverDetailsCard from "./components/DriverDetailsCard";
import RideStatusCard from "./components/RideStatusCard";
import HelpSupportCard from "./components/HelpSupportCard";
import ChatPanel from "../chat/ChatPanel";

import "../../styles/track-chat.css";

const TrackChat = () => {
  const searchParams = useSearchParams();

  const ride = null;
  const booking = null;
  const noOfSIt = null;

  const rideData = ride || {
    id: 14,
    source_address: "Vani Vihar, Bhubaneswar, Odisha, India",
    destination_address: "Jaydev Vihar, Bhubaneswar, Odisha, India",
    source_lat: "20.3039745",
    source_lng: "85.8396655",
    destination_lat: "20.2997267",
    destination_lng: "85.8172637",
    ride_date: "2026-06-03",
    departure_time: "03:30:00",
    estimated_reach_time: "06:40:00",
    price_per_seat: "132.00",
    driver_name: "Suraj Kumar",
    driver_phone: "1242179918",
    driver_profile_picture:
      "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_640.jpg",
    brand: "Maruti",
    model: "Swift Dzire",
    registration_number: "OD02 AB 1234",
    vehicle_type: "Car",
    fuel_type: "Petrol",
  };

  const seatsBooked = noOfSIt || 3;

  const bookingId = booking?.id || "BKG88364";

  const amountPaid = booking
    ? (parseFloat(rideData.price_per_seat) * seatsBooked).toFixed(2)
    : (132 * 3).toFixed(2);

  // -------------------------------------------------------
  // Ride Status
  // -------------------------------------------------------

  const getRideStatus = () => {
    const now = new Date();

    const rideDateTime = new Date(
      `${rideData.ride_date}T${rideData.departure_time}`,
    );

    const diffMins = (rideDateTime - now) / 60000;

    if (diffMins > 30) return "scheduled";
    if (diffMins > 0) return "driver_on_way";
    if (diffMins > -10) return "arrived";
    if (diffMins > -120) return "in_progress";

    return "completed";
  };

  const [rideStatus, setRideStatus] = useState(getRideStatus());

  const [mapFullscreen, setMapFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRideStatus(getRideStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isTrackingEnabled = () => {
    const now = new Date();

    const rideDateTime = new Date(
      `${rideData.ride_date}T${rideData.departure_time}`,
    );

    return (rideDateTime - now) / 60000 <= 30;
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="tc-page">
      <div className={`tc-wrapper ${mapFullscreen ? "tc-fullscreen" : ""}`}>
        {/* LEFT — MAP */}

        <div className="tc-map-col">
          <MapPanel
            ride={rideData}
            rideStatus={rideStatus}
            trackingEnabled={isTrackingEnabled()}
            mapFullscreen={mapFullscreen}
            setMapFullscreen={setMapFullscreen}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>

        {/* RIGHT PANEL */}

        {!mapFullscreen && (
          <div className="tc-right-col">
            <div className="tc-right-scroll">
              <RideDetailsCard
                ride={rideData}
                bookingId={bookingId}
                amountPaid={amountPaid}
                seatsBooked={seatsBooked}
                formatDate={formatDate}
                formatTime={formatTime}
              />

              <DriverDetailsCard driver={rideData} />

              <RideStatusCard rideStatus={rideStatus} />

              <HelpSupportCard />
            </div>

            <ChatPanel driver={rideData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackChat;
