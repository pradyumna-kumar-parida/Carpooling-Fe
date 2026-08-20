"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ArcLoader from "@/components/Loader";
import "@/styles/find-ride.css";
import PaymentCard from "./components/PaymentCard";
import RideDetailsCard from "./components/RideDetailsCard";
import PaymentUrgencyBanner from "./components/PaymentUrgencyBanner";
import { paymentApi, paymentFailedApi } from "@/services/client/bookingService";

const FALLBACK_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const AUTO_REDIRECT_DELAY_MS = 1500; // hold 1s on the "failed" state before redirecting

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

  // ---- Countdown: driven by an ABSOLUTE wall-clock deadline, not by "how
  // long ago did this component mount". This is the fix for the
  // refresh-resets-the-timer bug: a refresh just remounts the component and
  // recomputes "how much time is left until the same fixed deadline" —
  // it can never push the deadline itself forward. ----
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);

  useEffect(() => {
    if (!booking?.booking_id || expiryTimestamp !== null) return;

    const storageKey = `paymentExpiryAt:${booking.booking_id}`;

    // Refresh-safe: if we already anchored a deadline for this booking,
    // keep using it — regardless of what a re-fetched API response says.
    // (Untouched — this is the refresh-persistence logic.)
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      setExpiryTimestamp(parseInt(stored, 10));
      return;
    }

    // ---- THE FIX ----
    // Derive the hold's DURATION from two SERVER timestamps
    // (creationTime -> ExpiryTime), not from "server ExpiryTime minus
    // this device's Date.now()". Both creationTime and ExpiryTime are
    // stamped by the same backend clock, so their difference is a clean
    // 5:00 no matter how skewed the passenger's device clock is.
    //
    // Only AFTER we have that duration do we touch the client's clock —
    // exactly once, to anchor it locally. Every tick afterwards compares
    // only against this same device's own Date.now(), so it stays
    // internally consistent even on a device with the wrong time.
    let holdDurationMs = FALLBACK_DURATION_MS;

    if (booking?.ExpiryTime && booking?.creationTime) {
      holdDurationMs =
        new Date(booking.ExpiryTime).getTime() -
        new Date(booking.creationTime).getTime();
    } else if (typeof booking?.remainingMs === "number") {
      holdDurationMs = booking.remainingMs;
    } else if (booking?.ExpiryTime) {
      // Last-resort fallback if creationTime is ever missing — still
      // skew-prone, kept only so the timer degrades gracefully instead
      // of breaking.
      holdDurationMs = new Date(booking.ExpiryTime).getTime() - Date.now();
    }

    const expiry = Date.now() + Math.max(0, holdDurationMs);

    sessionStorage.setItem(storageKey, String(expiry));
    setExpiryTimestamp(expiry);
  }, [
    booking?.booking_id,
    booking?.ExpiryTime,
    booking?.creationTime,
    booking?.remainingMs,
    expiryTimestamp,
  ]);

  useEffect(() => {
    if (expiryTimestamp === null || paymentSuccess) return;

    const tick = () => {
      const remaining = Math.max(0, expiryTimestamp - Date.now());
      setRemainingMs(remaining);
      if (remaining <= 0) {
        setIsExpired(true);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiryTimestamp, paymentSuccess]);

  const clearPersistedExpiry = useCallback(() => {
    if (booking?.booking_id) {
      sessionStorage.removeItem(`paymentExpiryAt:${booking.booking_id}`);
    }
  }, [booking?.booking_id]);

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

        // Store booking failed response
        sessionStorage.setItem("bookingFailed", JSON.stringify(res.data));
      } catch (err) {
        console.error("Payment Failed API Error:", err);
      } finally {
        clearPersistedExpiry();
        router.replace("/passenger/booking-failed");
      }
    },
    [booking?.booking_id, router, clearPersistedExpiry],
  );

  // ---- Forced redirect: the moment the timer hits 0, the Pay Now button
  // locks (see PaymentCard's disabled prop) and the banner switches to its
  // "failed" message. 1 second after that, we auto-fire the payment-failed
  // flow ourselves — the user doesn't need to click anything.
  // autoExpireHandledRef guards against this firing twice. ----
  const autoExpireHandledRef = useRef(false);

  useEffect(() => {
    if (!isExpired || paymentSuccess || autoExpireHandledRef.current) return;
    autoExpireHandledRef.current = true;

    const timeout = setTimeout(() => {
      handlePaymentExpired(
        "Payment time expired. Reservation automatically cancelled after 5 minutes.",
      );
    }, AUTO_REDIRECT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isExpired, paymentSuccess, handlePaymentExpired]);

  // ---- Back-navigation / leaving the page early: if the passenger
  // navigates away from this screen (browser/in-app back button, or any
  // other client-side route change) WITHOUT completing payment and
  // BEFORE the timer expired, we still release the held seats via the
  // same failed-payment API — but we deliberately do NOT force a redirect
  // here, since the user is already navigating away on their own. The
  // forced redirect only happens if they stay on this page until the
  // 5-minute timer actually runs out (handled above).
  //
  // Refs are used so this cleanup always reads the LATEST values instead
  // of whatever was true on the render this effect was declared in.
  // The `mountedAtGuard` skips the near-instant mount→cleanup→mount that
  // React 18 Strict Mode does in development, so it doesn't mistake that
  // for a real "user left the page" event.
  const latestBookingRef = useRef(booking);
  const latestPaymentSuccessRef = useRef(paymentSuccess);
  const latestIsExpiredRef = useRef(isExpired);

  useEffect(() => {
    latestBookingRef.current = booking;
  }, [booking]);
  useEffect(() => {
    latestPaymentSuccessRef.current = paymentSuccess;
  }, [paymentSuccess]);
  useEffect(() => {
    latestIsExpiredRef.current = isExpired;
  }, [isExpired]);

  useEffect(() => {
    const mountedAtGuard = Date.now();

    return () => {
      if (Date.now() - mountedAtGuard < 50) return; // Strict Mode synthetic unmount

      const stillPending =
        !latestPaymentSuccessRef.current && !latestIsExpiredRef.current;
      const bookingId = latestBookingRef.current?.booking_id;

      if (stillPending && bookingId) {
        paymentFailedApi({
          booking_id: bookingId,
          reason: "Passenger left the payment page before completing payment.",
        }).catch((err) => {
          console.error("Payment Failed API Error (on navigate away):", err);
        });
      }
    };
  }, []);

  const handlePayNow = () => {
    // Guard: if the reservation window has already lapsed, don't even
    // attempt Razorpay — fail immediately. (Button is also disabled in
    // this state, so this mainly protects against a stray/queued click.)
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

            clearPersistedExpiry();
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

      {/* Slides in from the right on mount; stays in sync with the same
          countdown driving the Pay Now button and the inline alert box. */}
      {!paymentSuccess && (
        <PaymentUrgencyBanner remainingMs={remainingMs} isExpired={isExpired} />
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
