"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@mui/material";
import Image from "next/image";
import sucessBedge from "../../../assets/images/sucess-bedge.png";
import BookingDetailsCard from "./components/BookingDetailCard";
import PaymentSummaryCard from "./components/PaymentSummeryCard";
import "../../../styles/find-ride.css"
const BookingConfirmation = () => {
  const router = useRouter();

  // Dummy data (replace with actual API response / passed data)
  const rideDetails = {
    from: "Mumbai",
    to: "Pune",
    date: "April 25, 2026",
    time: "11:00 AM",
    passengers: 2,
    driverName: "Suraj Kumar",
    carModel: "Maruti Swift Dzire - White",
    price: 600,
    duration: "3h 10m",
    fromAddress:
      "Terminal 2, International APT, Metro Stn, Navpada, Marol, Andheri(E)",
    toAddress: "FR6C+9WF, Navale Brg, Kudale Baug, Vadgaon Budruk, Maharashtra",
    driverPhone: "+91 9876543210",
    driverRating: 4.8,
  };
  const paymentMethod = "card";

  const bookingId = "BK" + Math.floor(100000 + Math.random() * 900000);
  const bookingDate = new Date().toLocaleString();

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
                width={100}
                height={100}
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
            <BookingDetailsCard rideDetails={rideDetails} />

            <PaymentSummaryCard
              rideDetails={rideDetails}
              paymentMethod={paymentMethod}
              bookingId={bookingId}
              bookingDate={bookingDate}
              handleDownloadTicket={handleDownloadTicket}
              handleShareBooking={handleShareBooking}
              handleBackHome={handleBackHome}
              router={router}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;
