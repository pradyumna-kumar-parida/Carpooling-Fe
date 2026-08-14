"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@mui/material";
import Image from "next/image";
import sucessBedge from "../../../assets/images/sucess-bedge.png";
import BookingDetailsCard from "./components/BookingDetailCard";
import PaymentSummaryCard from "./components/PaymentSummeryCard";
import "../../../styles/find-ride.css";
import ChatPanel from "@/features/chat/ChatPanel";
const Confirmation = () => {
  const [bookingRideDetails, setBookingDetails] = useState(null);

  const router = useRouter();
  useEffect(() => {
    sessionStorage.removeItem("ride");
    const data = sessionStorage.getItem("bookingConfirmation");
    if (data) {
      setBookingDetails(JSON.parse(data));
    }
  }, []);
  const [showChat, setShowChat] = useState(false);
  const [selectedChatRide, setSelectedChatRide] = useState(null);
  const paymentMethod = "card";

  const bookingId = bookingRideDetails?.bookingDetails?.booking_code;
  const bookingDate = bookingRideDetails?.bookingDetails?.confirmed_at
    ? new Date(bookingRideDetails.bookingDetails.confirmed_at).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        },
      )
    : "";

  const handleDownloadTicket = () => {
    alert("Downloading ticket...");
  };

  const handleShareBooking = () => {
    alert("Sharing booking details...");
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <>
      <div className="bookconf-page">
        <div className="bookconf-container">
          {/* Success Header */}
          <div className="bookconf-success-header">
            <div className="sucessBedge">
              <Image
                src={sucessBedge}
                alt="success-badge"
                width={90}
                height={90}
              />
            </div>
            <h1 className="bookconf-success-title">Booking Confirmed!</h1>
            <p className="bookconf-success-text">
              Your ride has been successfully booked. Check your email for
              confirmation details.
            </p>
            <Chip
              label={`Booking ID: ${bookingId}`}
              className="bookconf-booking-id"
              color="primary"
            />
          </div>

          {/* Main Content */}
          <div className="bookconf-content">
            <BookingDetailsCard bookingRideDetails={bookingRideDetails} />

            <PaymentSummaryCard
              bookingRideDetails={bookingRideDetails}
              paymentMethod={paymentMethod}
              bookingId={bookingId}
              bookingDate={bookingDate}
              handleDownloadTicket={handleDownloadTicket}
              handleShareBooking={handleShareBooking}
              handleBackHome={handleBackHome}
              router={router}
              onOpenChat={() => {
                setShowChat(true);
              }}
            />
          </div>
        </div>
      </div>
      {showChat && (
        <ChatPanel
          driver={bookingRideDetails}
          bookingId={bookingRideDetails?.bookingDetails?.booking_id}
          bookingCode={bookingRideDetails?.bookingDetails?.booking_code}
          defaultOpen={true}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default Confirmation;
