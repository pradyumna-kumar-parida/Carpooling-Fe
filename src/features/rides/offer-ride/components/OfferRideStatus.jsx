"use client";
import React from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
/**
 * OfferRideStatus
 * ----------------
 * Pure "gate" component for the Offer Ride page. Owns five steps:
 *   1. Login
 *   2. Profile Completion    (profileCompleted: boolean)
 *   3. Profile Verification  (profileStatus: "pending" | "active" | "blocked" | undefined)
 *   4. Vehicle Registration  (vehicleCount > 0)
 *   5. Vehicle Verification  (approvedVehicleCount > 0)
 *
 * Steps 4 and 5 are deliberately split: a driver can register a vehicle any
 * time after logging in (independent of profile approval), but they can't
 * offer a ride until at least one registered vehicle is active. If a
 * driver has several vehicles and only some are active, this component
 * still reports "verified" — the per-vehicle pending/blocked filtering for
 * an individual ride happens in PRHero's vehicle picker.
 *
 * Returns `null` when every step is cleared, signalling the caller to render
 * the actual publish-ride form instead of this checklist.
 */
export default function OfferRideStatus({
  isLoggedIn,
  profileCompleted,
  profileStatus,
  vehicleCount = 0,
  approvedVehicleCount = 0,
  vehicleVerificationTone = "pending", // "pending" | "rejected" — only matters once vehicleCount > 0
  onLoginRedirect,
  onCompleteProfileRedirect,
  onReviewProfileRedirect,
  onRegisterVehicleRedirect,
  onReviewVehicleRedirect,
}) {
    console.log("profile status",profileStatus);
    
  const profileVerified =
    isLoggedIn && !!profileCompleted && profileStatus === "active";
  const hasVehicle = isLoggedIn && vehicleCount > 0;
  const vehicleVerified = hasVehicle && approvedVehicleCount > 0;
  const isCleared = profileVerified && vehicleVerified;

  if (isCleared) return null;

  // Anything other than an explicit "active"/"blocked" reads as pending —
  // covers profileStatus being null/undefined while the API hasn't set it yet.
  const profileTone = profileStatus === "blocked" ? "rejected" : "pending";
  const vehicleTone =
    vehicleVerificationTone === "rejected" ? "rejected" : "pending";

  const STATUS_META = {
    pending: {
      icon: <FaRegHourglassHalf />,
      title: "Verification Pending",
      tone: "pending",
    },
    rejected: {
      icon: <FaExclamationTriangle />,
      title: "Verification Failed",
      tone: "rejected",
    },
  };

  const steps = [
    {
      key: "login",
      label: "Account Login",
      done: isLoggedIn,
      locked: false,
    },
    {
      key: "profile",
      label: "Profile Completion",
      done: isLoggedIn && !!profileCompleted,
      locked: !isLoggedIn,
    },
    {
      key: "verification",
      label: "Profile Verification",
      done: profileVerified,
      locked: !isLoggedIn || !profileCompleted,
    },
    {
      key: "vehicle",
      label: "Vehicle Registration",
      done: hasVehicle,
      // Independent of profile verification — a driver can register a
      // vehicle any time after logging in, even while approval is pending.
      locked: !isLoggedIn,
    },
    {
      key: "vehicleVerification",
      label: "Vehicle Verification",
      done: vehicleVerified,
      // Only meaningful once at least one vehicle has been registered.
      locked: !hasVehicle,
    },
  ];

  return (
    <div className="ors-card">
      <div className="ors-card-head">
        <h3>Get ready to offer a ride</h3>
        <p>Complete the steps below to unlock the publish form.</p>
      </div>

      <ul className="ors-steps">
        {steps.map((step) => (
          <li
            key={step.key}
            className={`ors-step${step.done ? " ors-step--done" : ""}${
              step.locked ? " ors-step--locked" : ""
            }`}
          >
            <span className="ors-step-marker" aria-hidden="true">
              {step.done ? <FaCheck size={11} /> : null}
            </span>

            <div className="ors-step-body">
              <span className="ors-step-label">{step.label}</span>

              {/* Step 1: Login */}
              {step.key === "login" && !isLoggedIn && (
                <div className="ors-step-action">
                  <p className="ors-step-caption">
                    Log in to start offering rides.
                  </p>
                  <button
                    type="button"
                    className="ors-btn"
                    onClick={onLoginRedirect}
                  >
                    Log in 
                  </button>
                </div>
              )}

              {/* Step 2: Profile completion */}
              {step.key === "profile" && isLoggedIn && !profileCompleted && (
                <div className="ors-step-action">
                  <p className="ors-step-caption">
                    Add your details to complete your driver profile.
                  </p>
                  <button
                    type="button"
                    className="ors-btn"
                    onClick={onCompleteProfileRedirect}
                  >
                    Complete Profile 
                  </button>
                </div>
              )}

              {/* Step 3: Profile verification */}
              {step.key === "verification" &&
                isLoggedIn &&
                profileCompleted &&
                !step.done && (
                  <div
                    className={`ors-badge ors-badge--${STATUS_META[profileTone].tone}`}
                  >
                    <span className="ors-badge-icon">
                      {STATUS_META[profileTone].icon}
                    </span>
                    <div>
                      <p className="ors-badge-title">
                        {STATUS_META[profileTone].title}
                      </p>
                      <p className="ors-badge-desc">
                        {profileTone === "rejected"
                          ? "Your profile verification wasn't approved. Please review and resubmit the required details."
                          : "Your profile is under verification. You can't offer any ride until it's approved."}
                      </p>
                    </div>
                  </div>
                )}

              {step.key === "verification" &&
                isLoggedIn &&
                profileCompleted &&
                profileTone === "rejected" && (
                  <button
                    type="button"
                    className="ors-btn ors-btn--outline"
                    onClick={onReviewProfileRedirect}
                  >
                    Review Profile 
                  </button>
                )}

              {/* Step 4: Vehicle registration */}
              {step.key === "vehicle" && isLoggedIn && !hasVehicle && (
                <div className="ors-step-action">
                  <p className="ors-step-caption">
                    You haven't registered a vehicle yet — add one to start
                    offering rides.
                  </p>
                  <button
                    type="button"
                    className="ors-btn"
                    onClick={onRegisterVehicleRedirect}
                  >
                    Register Vehicle 
                  </button>
                </div>
              )}

              {/* Step 5: Vehicle verification */}
              {step.key === "vehicleVerification" &&
                hasVehicle &&
                !vehicleVerified && (
                  <div
                    className={`ors-badge ors-badge--${STATUS_META[vehicleTone].tone}`}
                  >
                    <span className="ors-badge-icon">
                      {STATUS_META[vehicleTone].icon}
                    </span>
                    <div>
                      <p className="ors-badge-title">
                        {STATUS_META[vehicleTone].title}
                      </p>
                      <p className="ors-badge-desc">
                        {vehicleTone === "rejected"
                          ? "Your vehicle verification wasn't approved. Please review and update your vehicle documents."
                          : "Your vehicle is under verification. Once it's approved, you'll be able to offer a ride."}
                      </p>
                    </div>
                  </div>
                )}

              {step.key === "vehicleVerification" &&
                hasVehicle &&
                vehicleTone === "rejected" && (
                  <button
                    type="button"
                    className="ors-btn ors-btn--outline"
                    onClick={onReviewVehicleRedirect}
                  >
                    Review Vehicle 
                  </button>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
