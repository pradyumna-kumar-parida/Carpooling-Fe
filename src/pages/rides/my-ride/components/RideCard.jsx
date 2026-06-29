"use client";
import { useState } from "react";
import { ImArrowRight } from "react-icons/im";
import { ImInfo } from "react-icons/im";
import { getStatusColor } from "../hooks/UseMyRides";
import ChatPanel from "@/pages/chat/ChatPanel";
import { useRouter } from "next/navigation";
import { TbRoute } from "react-icons/tb";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function RideCard({ ride, onViewDetails }) {
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  const rideData = {
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

  return (
    <>
      <div className="myride-card">
        <div className="myride-card-header">
          <span
            className="myride-status-chip"
            style={{
              color: getStatusColor(ride.status),
              border: `1px dotted ${getStatusColor(ride.status)}`,
              backgroundColor: `${getStatusColor(ride.status)}10`, // ~12% opacity
            }}
          >
            {ride.status}
          </span>
        </div>

        <div className="myride-route-simple">
          <div className="route-simple-item">
            <span className="route-label-head">From:</span>
            <span className="route-value">{ride.from}</span>
          </div>
          <div className="route-arrow">
            <ImArrowRight />
          </div>
          <div className="route-simple-item">
            <span className="route-label-head">To:</span>
            <span className="route-value">{ride.to}</span>
          </div>
        </div>

        <div className="myride-card-info">
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">{ride.date}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Time:</span>
            <span className="info-value">{ride.time}</span>
          </div>
        </div>

        <div className="myride-card-footer">
          <div className="myride-price">
            <span className="price-label">Price:</span>
            <span className="price-value">₹{ride.price}</span>
          </div>
        </div>
        <div className="myride-card-actions">
          <button
            className="myride-details-btn"
            onClick={() => onViewDetails(ride)}
          >
            Details <ImInfo />
          </button>

          <button
            className="myride-track-btn"
            onClick={() => router.push("/track-chat")}
          >
            Track <TbRoute />
          </button>

          <button className="myride-chat-btn" onClick={() => setShowChat(true)}>
            Chat <IoChatbubbleEllipsesOutline />
          </button>
        </div>
      </div>
      {showChat && (
        <ChatPanel driver={rideData} onClose={() => setShowChat(false)} />
      )}
    </>
  );
}
