"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import "../../../styles/find-ride.css"
import { Alert, Snackbar } from "@mui/material";

import { useBooking } from "./hooks/useBooking";
import { isRidePassed } from "./utils/bookingHelpers";

import DriverModal from "./components/DriverModal";
import PriceModal from "./components/PriceModal";
import TripTimeline from "./components/TripTimeline";
import DriverCard from "./components/DriverCard";
import PassengersCard from "./components/PassengersCard";
import BookingSidebar from "./components/BookingSidebar";

export default function RideBooking() {
  const router = useRouter();

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Token state
  const [token, setToken] = useState(null);

  // Ride passed state
  const [ridePassed, setRidePassed] = useState(false);

  const ride = useSelector(
    (state) => state.rideBooking?.ride
  );

  const noOfSIt = useSelector(
    (state) => state.rideBooking?.noOfSIt
  );

  const {
    openPriceModal,
    setOpenPriceModal,
    openDriverModal,
    setOpenDriverModal,
    bookingLoading,
    handleBookRide,
    openAlert,
    setOpenAlert,
    alertMessage,
    alertType,
  } = useBooking();

  useEffect(() => {
    setMounted(true);

    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

  }, []);

  useEffect(() => {
    if (ride) {
      setRidePassed(
        isRidePassed(
          ride?.ride_date,
          ride?.departure_time
        )
      );
    }
  }, [ride]);

  // Don't render until client mounted
  if (!mounted) {
    return null;
  }

  const pricePerSeat = ride
    ? Number(ride.price_per_seat).toFixed(2)
    : "0.00";

  if (!ride) {
    return (
      <div className="ride-not-found">
        <p className="error-happens">
          Ride data not found.
        </p>

        <button
          className="btn register-btn"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Snackbar */}
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={alertType}
          variant="filled"
          onClose={() => setOpenAlert(false)}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Modals */}
      <DriverModal
        open={openDriverModal}
        onClose={() => setOpenDriverModal(false)}
        ride={ride}
      />

      <PriceModal
        open={openPriceModal}
        onClose={() => setOpenPriceModal(false)}
        ride={ride}
        pricePerSeat={pricePerSeat}
        noOfSIt={noOfSIt}
      />

      <div className="ride-confirm-page">
        <h1 className="ride-confirm-title">
          Ride details
        </h1>

        <div className="ride-confirm-container">
          <div className="ride-confirm-main">
            <TripTimeline ride={ride} />

            <DriverCard
              ride={ride}
              onDriverClick={() =>
                setOpenDriverModal(true)
              }
            />

            <PassengersCard ride={ride} />
          </div>

          <BookingSidebar
            ride={ride}
            noOfSIt={noOfSIt}
            pricePerSeat={pricePerSeat}
            isRidePassed={ridePassed}
            token={token}
            bookingLoading={bookingLoading}
            onPriceClick={() =>
              setOpenPriceModal(true)
            }
            onBookClick={() =>
              handleBookRide({
                ride,
                noOfSIt,
              })
            }
            onLoginClick={() =>
              router.push("/login")
            }
          />
        </div>
      </div>
    </>
  );
}