"use client";
import { FaCarAlt, FaUserAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArcLoader from "../../../components/Loader";
import Link from "next/link";
import { useSignupForm } from "./hooks/useSignupForm";
import { ICONS } from "./constants/signupConstants";
import OtpVerificationModal from "./components/OtpVerificationModal";
import FieldInput from "./components/FieldInput";
import PasswordField from "./components/PasswordField";
import FieldSelect from "./components/FieldSelect";

function PageLoader() {
  return (
    <div className="loader-back-wrapper">
      <ArcLoader />
    </div>
  );
}

export default function Signup({ roles }) {
  const {
    formData,
    handleChange,
    roleOptions,
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
  } = useSignupForm(roles);

  const phoneComplete = /^\d{10}$/.test(formData.phone);

  return (
    <>
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
            <p className="signup-desc">Join us and start your journey today</p>

            <form
              className="registration-form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="signup-form-grid">
                <FieldInput
                  id="fullname"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullname}
                  onChange={handleChange}
                  icon={ICONS.user}
                />
                <FieldInput
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={ICONS.email}
                  autoComplete="off"
                />
                <FieldInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={ICONS.phone}
                  maxLength={10}
                  suffix={
                    phoneComplete && (
                      <button
                        type="button"
                        className={`verify-btn ${phoneVerified ? "verified" : ""}`}
                        onClick={handleOpenOtpModal}
                        disabled={phoneVerified}
                      >
                        {phoneVerified ? (
                          <IoMdCheckmarkCircleOutline />
                        ) : (
                          "Verify"
                        )}
                      </button>
                    )
                  }
                />
                <FieldSelect
                  id="usertype"
                  label="User Type"
                  value={formData.usertype}
                  onChange={handleChange}
                  icon={ICONS.group}
                  options={roleOptions}
                />
                <PasswordField
                  id="password"
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

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

              <button
                type="submit"
                className="register-btn"
                style={{ width: "100%", opacity: loading ? 0.75 : 1 }}
                disabled={loading}
              >
                Sign Up
              </button>
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
