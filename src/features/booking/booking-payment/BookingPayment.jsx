"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ArcLoader from "../../../components/Loader";
import "../../../styles/find-ride.css";
import PaymentCard from "./components/PaymentCard";
import RideDetailsCard from "./components/RideDetailsCard";
import { paymentApi, paymentFailedApi } from "@/services/client/bookingService";

const FALLBACK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const RidePayment = () => {
  const router = useRouter();
  const [rideData, setRideData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [remainingMs, setRemainingMs] = useState(FALLBACK_DURATION_MS);
  const [isExpired, setIsExpired] = useState(false);

  // Load booking data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");

    if (data) {
      setRideData(JSON.parse(data));
    } else {
      router.replace("/find-ride");
    }
  }, [router]);

  // Load Razorpay SDK
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

  const { ride, booking, noOfSIt } = rideData || {};
  const RAZORPAY_KEY = booking?.razorpay_key;

  const totalAmount = ride?.price_per_seat
    ? (parseFloat(ride.price_per_seat) * (noOfSIt || 1)).toFixed(2)
    : 0;

  const mountedAtRef = useRef(null); // performance.now() snapshot when countdown starts
  const durationRef = useRef(FALLBACK_DURATION_MS);

  useEffect(() => {
    if (!booking?.creationTime || mountedAtRef.current !== null) return;

    durationRef.current = booking?.ExpiryTime
      ? new Date(booking.ExpiryTime).getTime() -
        new Date(booking.creationTime).getTime()
      : FALLBACK_DURATION_MS;

    mountedAtRef.current = performance.now();
    setRemainingMs(durationRef.current);
  }, [booking?.creationTime, booking?.ExpiryTime]);

  useEffect(() => {
    if (mountedAtRef.current === null || paymentSuccess) return;

    const tick = () => {
      const elapsed = performance.now() - mountedAtRef.current;
      const remaining = Math.max(0, durationRef.current - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0) {
        setIsExpired(true);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [booking?.creationTime, paymentSuccess]);

  const handlePaymentExpired = useCallback(
    async (reason) => {
      try {
        const payload = {
          booking_id: booking?.booking_id,
          reason,
        };

        console.log("Payment Failed Payload:", payload);

        const res = await paymentFailedApi(payload);

        console.log("Payment Failed Response:", res);
      } catch (err) {
        console.error(err);
      } finally {
        router.replace("/passenger/booking-failed");
      }
    },
    [booking?.booking_id, router],
  );

  const handlePayNow = () => {
    // Guard: if the reservation window has already lapsed, don't even
    // attempt Razorpay — fail immediately.
    if (isExpired) {
      handlePaymentExpired(
        "Payment time expired. Reservation automatically cancelled after 5 minutes.",
      );
      return;
    }

    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    setProcessing(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: booking?.amount * 100,
      order_id: booking?.order_id,
      handler: async function (response) {
        console.log("signuate", response);

        const payload = {
          booking_id: booking?.booking_id,
          razorpay_order_id: response?.razorpay_order_id,
          razorpay_payment_id: response?.razorpay_payment_id,
          razorpay_signature: response?.razorpay_signature,
        };

        try {
          const api = await paymentApi(payload);

          if (api?.data?.status === "success") {
            sessionStorage.setItem(
              "bookingConfirmation",
              JSON.stringify(api.data),
            );

            setProcessing(false);
            setPaymentSuccess(true);

            setTimeout(() => {
              router.push("/passenger/booking-confirmation");
            }, 3000);
          } else {
            setProcessing(false);

            // Signature/verification not found or invalid -> failure flow
            await handlePaymentExpired(
              "Payment verification failed. The payment could not be verified securely.",
            );
          }
        } catch (error) {
          setProcessing(false);

          await handlePaymentExpired(
            "Payment verification failed due to a server error.",
          );
        }
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function () {
      setProcessing(false);
      setTimeout(() => rzp.close(), 300);
      await handlePaymentExpired(
        "Payment failed while processing through Razorpay.",
      );
    });

    setTimeout(() => rzp.open(), 100);
  };

  if (!rideData) {
    return (
      <div className="ridepay-loader-overlay">
        <ArcLoader />
      </div>
    );
  }

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
              remainingMs={remainingMs}
              isExpired={isExpired}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RidePayment;
