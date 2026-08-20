"use client";

import { useState } from "react";
import { MdWarningAmber } from "react-icons/md";
import { FiAlertTriangle} from "react-icons/fi";
export default function CancelRideModal({
  ride,
  onClose,
  onConfirm,
  isSubmitting,
  errorMessage,
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  if (!ride) return null;

  const isReasonEmpty = reason.trim().length === 0;

  const handleConfirm = () => {
    setTouched(true);
    if (isReasonEmpty || isSubmitting) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="cancel-ride-overlay" onClick={onClose}>
      <div
        className="cancel-ride-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-ride-title"
      >
        <div className="cancel-ride-icon-wrap">
                <FiAlertTriangle className="cancel-ride-icon" />
        </div>

        <h2 id="cancel-ride-title" className="cancel-ride-title">
          Cancel this ride?
        </h2>

        <p className="cancel-ride-desc">
          {ride.from} → {ride.to} on {ride.date}. You will be refunded
          automatically if applicable. This action cannot be undone.
        </p>

        <div className="cancel-ride-reason">
          <label htmlFor="cancel-reason" className="cancel-reason-label">
            Reason for cancellation <span className="required-star">*</span>
          </label>
          <textarea
            id="cancel-reason"
            className={`cancel-reason-textarea ${
              touched && isReasonEmpty ? "input-error" : ""
            }`}
            placeholder="Please provide a reason for cancelling this booking..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={3}
            disabled={isSubmitting}
          />
          {touched && isReasonEmpty && (
            <span className="cancel-reason-error">
              Please provide a reason for cancellation.
            </span>
          )}
          {errorMessage && (
            <span className="cancel-reason-error">{errorMessage}</span>
          )}
        </div>

        <div className="cancel-ride-actions">
          <button
            type="button"
            className="cancel-ride-keep-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Keep Ride
          </button>
          <button
            type="button"
            className="cancel-ride-confirm-btn"
            onClick={handleConfirm}
            disabled={isReasonEmpty || isSubmitting}
            aria-disabled={isReasonEmpty || isSubmitting}
          >
            {isSubmitting ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
