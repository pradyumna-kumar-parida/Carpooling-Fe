"use client";

import React, { useEffect, useState } from "react";
import { IoMdAlarm } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// How long after `isExpired` flips true, before the banner starts sliding
// back out. Kept comfortably inside the parent's 1000ms auto-redirect
// delay so the exit animation finishes right around the moment the page
// actually navigates away, instead of getting cut off mid-animation.
const LEAVE_DELAY_MS = 550;

/**
 * Slides in from the right edge on mount and warns the passenger to pay
 * within the reservation window. Reuses the exact same `remainingMs` /
 * `isExpired` state the parent page already computes for the inline alert
 * box + Pay Now button, so this can never drift out of sync with them —
 * there is deliberately no second/independent timer running in here.
 *
 * On expiry: switches its own message to "Payment Failed", then slides
 * back out shortly before the parent forces the redirect.
 */
const PaymentUrgencyBanner = ({ remainingMs, isExpired }) => {
  // Mount already-off-screen, then flip to visible a beat later so the
  // slide-in transition actually plays instead of the panel just
  // appearing already in its resting position.
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isExpired) {
      setLeaving(false);
      return;
    }
    const t = setTimeout(() => setLeaving(true), LEAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [isExpired]);

  return (
    <div
      className={[
        "ridepay-urgency-banner",
        visible ? "is-visible" : "",
        isExpired ? "is-expired" : "",
        leaving ? "is-leaving" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
      aria-live="assertive"
    >
      <span className="ridepay-urgency-icon">
        {isExpired ? <MdErrorOutline /> : <IoMdAlarm />}
      </span>

      <div className="ridepay-urgency-text">
        {isExpired ? (
          <>
            <h4>Payment Failed</h4>
            <p>
              You couldn&apos;t complete the payment in time — this ride can no
              longer be booked. Redirecting…
            </p>
          </>
        ) : (
          <>
            <h4>Complete your payment within 5 minutes</h4>
            <p>
              Otherwise your seat reservation will be cancelled automatically.
            </p>
          </>
        )}
      </div>

      <div className="ridepay-urgency-timer-box">{formatTime(remainingMs)}</div>
    </div>
  );
};

export default PaymentUrgencyBanner;
