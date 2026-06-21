"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { bookRideApi } from "../../../../services/bookingService";

export function useBooking() {
  const router = useRouter();

  // Modals
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [openDriverModal, setOpenDriverModal] = useState(false);

  // Loading
  const [bookingLoading, setBookingLoading] = useState(false);

  // Alerts
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpenAlert(true);
  };

  const handleBookRide = async ({
    ride,
    noOfSIt,
  }) => {
    setBookingLoading(true);

    try {
      const payload = {
        ride_id: ride.id,
        seats: noOfSIt,
      };

      const response = await bookRideApi(payload);

      if (response.data?.status === "success") {
        // Option 1
        sessionStorage.setItem(
          "bookingData",
          JSON.stringify({
            ride,
            noOfSIt,
            booking: response.data,
          })
        );

        router.push("/booking-payment");
      } else {
        showAlert(
          "error",
          response.data?.message ||
          "Booking failed. Please try again."
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      showAlert("error", message);
    } finally {
      setBookingLoading(false);
    }
  };

  return {
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

    showAlert,
  };
}