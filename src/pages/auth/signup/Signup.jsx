"use client";
import { FaCarAlt, FaUserAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArcLoader from "../../../components/Loader";
import Link from "next/link";
import { useSignupForm } from "./hooks/useSignupForm";
import {
  DRIVER_STEPS,
  FIELD_META,
  FILE_FIELDS,
  ICONS,
} from "./constants/signupConstants";
import StepDots from "./components/StepDots";
import OtpVerificationModal from "./components/OtpVerificationModal";
import FieldInput from "./components/FieldInput";
import PasswordField from "./components/PasswordField";
import FieldSelect from "./components/FieldSelect";
import FileField from "./components/FileField";

// ── Full-screen loader ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="loader-back-wrapper">
      <ArcLoader />
    </div>
  );
}

// ── Step content renderer ─────────────────────────────────────────────────
function StepContent({
  step,
  formData,
  onChange,
  roleOptions,
  phoneVerified,
  onVerifyClick,
}) {
  // Step 0 — basic info
  if (step === 0) {
    const phoneComplete = /^\d{10}$/.test(formData.phone);
    return (
      <div className="signup-form-grid">
        <FieldInput
          id="fullname"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullname}
          onChange={onChange}
          icon={ICONS.user}
        />
        <FieldInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={onChange}
          icon={ICONS.email}
        />
        <FieldInput
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={onChange}
          icon={ICONS.phone}
          maxLength={10}
          suffix={
            phoneComplete && (
              <button
                type="button"
                className={`verify-btn ${phoneVerified ? "verified" : ""}`}
                onClick={onVerifyClick}
                disabled={phoneVerified}
              >
                {phoneVerified ? <IoMdCheckmarkCircleOutline /> : "Verify"}
              </button>
            )
          }
        />
        <FieldSelect
          id="usertype"
          label="User Type"
          value={formData.usertype}
          onChange={onChange}
          icon={ICONS.group}
          options={roleOptions}
        />
        <PasswordField
          id="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={onChange}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={onChange}
        />
      </div>
    );
  }

  // Steps 1-3 — driver steps
  const driverStep = DRIVER_STEPS[step - 1];
  return (
    <>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary, #6b7280)",
          marginBottom: 14,
          marginTop: -4,
        }}
      >
        {driverStep.subtitle}
      </p>
      <div className="signup-form-grid">
        {driverStep.fields.map((fieldId) => {
          const meta = FIELD_META[fieldId];
          if (!meta) return null;
          return FILE_FIELDS.has(fieldId) ? (
            <FileField
              key={fieldId}
              id={fieldId}
              label={meta.label}
              value={formData[fieldId]}
              onChange={onChange}
            />
          ) : (
            <FieldInput
              key={fieldId}
              id={fieldId}
              label={meta.label}
              type={meta.type}
              placeholder={meta.placeholder}
              value={formData[fieldId]}
              onChange={onChange}
              icon={meta.icon}
            />
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Signup() {
  const {
    formData,
    handleChange,
    roleOptions,
    step,
    totalSteps,
    isFinalStep,
    isDriver,
    handleNext,
    handleBack,
    handleSubmit,
    loading,
    openAlert,
    setOpenAlert,
    alertMessage,
    alertType,
    openOtpModal,
    handleOpenOtpModal,
    handleCloseOtpModal,
    phoneVerified,
    otp,
    setOtp,
    isVerified,
    handleVerifyOtp,
  } = useSignupForm();

  return (
    <>
      {/* ── Global alert ── */}
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={alertType}
          variant="filled"
          onClose={() => setOpenAlert(false)}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {loading && <PageLoader />}

      {/* ── OTP modal ── */}
      <OtpVerificationModal
        open={openOtpModal}
        onClose={handleCloseOtpModal}
        phone={formData.phone}
        otp={otp}
        setOtp={setOtp}
        isVerified={isVerified}
        onVerify={handleVerifyOtp}
      />

      <div className="auth-container">
        {/* ── Left decorative panel ── */}
        <div className="image-section">
          <div className="floating-shapes">
            <div className="shape" />
            <div className="shape" />
            <div className="shape" />
          </div>
          <div className="image-overlay">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <FaCarAlt />
              </div>
              <h2>Carpooling</h2>
            </div>
            <h1>Create Your Account &amp; Start Riding</h1>
            <p>
              Join our ride-sharing platform and unlock a smarter way to travel.
            </p>
          </div>
          <Link href="/" className="back-btn">
            <FaArrowLeft /> Back
          </Link>
        </div>

        {/* ── Right form panel ── */}
        <div className="form-section">
          <div className="signup-wrapper">
            <Link href="/" className="auth-back-btn">
              <FaArrowLeft />
            </Link>
            <div className="logo-section">
              <div className="logo-icon">
                <FaUserAlt />
              </div>
            </div>

            <h2 className="signup-title">Create Account</h2>
            <p
              className="signup-desc"
              style={isDriver && step > 0 ? { fontWeight: 600 } : {}}
            >
              {isDriver && step > 0
                ? DRIVER_STEPS[step - 1].title
                : "Join us and start your journey today"}
            </p>

            {isDriver && <StepDots total={totalSteps} current={step} />}

            <form className="registration-form" onSubmit={handleSubmit}>
              <StepContent
                step={step}
                formData={formData}
                onChange={handleChange}
                roleOptions={roleOptions}
                phoneVerified={phoneVerified}
                onVerifyClick={handleOpenOtpModal}
              />

              {/* ── Terms checkbox (final step only) ── */}
              {isFinalStep && (
                <div className="terms-section">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      id="terms"
                      className="checkbox-input"
                      required
                      checked={formData.terms}
                      onChange={handleChange}
                    />
                    <span className="checkbox-text">
                      I agree to the{" "}
                      <Link href="/term-conditions" className="terms-link">
                        Terms &amp; Conditions
                      </Link>
                    </span>
                  </label>
                </div>
              )}

              {/* ── Navigation buttons ── */}
              <div style={{ display: "flex", gap: 12 }}>
                {step > 0 && (
                  <button
                    type="button"
                    className="register-btn register-back-btn"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="register-btn"
                  style={{ flex: 1, opacity: loading ? 0.75 : 1 }}
                  disabled={loading}
                >
                  {isFinalStep ? "Sign Up" : "Next"}
                </button>
              </div>
            </form>

            <div className="login-redirect">
              Already have an account?{" "}
              <Link href="/login" className="redirect-link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
