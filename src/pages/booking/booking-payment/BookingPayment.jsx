"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArcLoader from "../../../components/Loader";
import "../../../styles/find-ride.css";
import PaymentCard from "./components/PaymentCard";
import RideDetailsCard from "./components/RideDetailsCard";
const RidePayment = () => {
  const router = useRouter();
  const rideData = {};
  const { ride, noOfSIt, booking } = rideData || {};
  const RAZORPAY_KEY = booking?.razorpay_key;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const totalAmount = ride?.price_per_seat
    ? (parseFloat(ride.price_per_seat) * (noOfSIt || 1)).toFixed(2)
    : 0;
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayNow = () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    setProcessing(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: booking?.amount * 100,
      order_id: booking?.order_id,
      handler: function (response) {
        setProcessing(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          router.push("/booking-confirmation");
        }, 2000);
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      setProcessing(false);
    });

    setTimeout(() => rzp.open(), 100);
  };

  return (
    <>
      {processing && (
        <div className="ridepay-loader-overlay">
          <ArcLoader />
        </div>
      )}

      <div className="ridepay-page">
        <div className="ridepay-container">
          <h2 className="ride-confirm-title">Ride Summary</h2>
          <div className="ridepay-content">
            <RideDetailsCard ride={ride} noOfSIt={noOfSIt} />

            <PaymentCard
              paymentSuccess={paymentSuccess}
              totalAmount={totalAmount}
              processing={processing}
              razorpayLoaded={razorpayLoaded}
              handlePayNow={handlePayNow}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RidePayment;
