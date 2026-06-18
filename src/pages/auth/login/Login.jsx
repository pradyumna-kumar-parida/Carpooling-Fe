"use client";
import { FaCarAlt, FaUserAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArcLoader from "../../../components/Loader";

import { useLoginForm } from "./hooks/useLoginForm";
import LoginTabToggle from "./components/LoginTabToggle";
import EmailLoginForm from "./components/EmailLoginForm";
import MobileOtpForm from "./components/MobileOtpForm";
import Link from "next/link";

// ── Full-screen loader overlay ─────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArcLoader />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Login() {
  const {
    activeTab,
    handleTabSwitch,
    loading,
    alert,
    setAlert,
    formData,
    rememberMe,
    setRememberMe,
    handleEmailChange,
    handleEmailSubmit,
    mobileNumber,
    handleMobileChange,
    enteredOtp,
    setEnteredOtp,
    otpSent,
    resendTimer,
    handleSendOtp,
    handleMobileSubmit,
  } = useLoginForm();

  return (
    <>
      {/* ── Global alert ── */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={() => setAlert((a) => ({ ...a, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={alert.type}
          variant="filled"
          onClose={() => setAlert((a) => ({ ...a, open: false }))}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {loading && <PageLoader />}

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
            <h1>Your Journey Starts Here</h1>
            <p>
              Experience seamless travel with our premium ride booking service.
              Safe, reliable, and always on time.
            </p>
          </div>
          <Link href="/" className="back-btn">
            <FaArrowLeft /> Back
          </Link>
        </div>

        {/* ── Right form panel ── */}
        <div className="form-section">
          <div className="form-container">
            <Link href="/" className="auth-back-btn">
              <FaArrowLeft />
            </Link>
            <div className="logo-section">
              <div className="logo-icon">
                <FaUserAlt />
              </div>
            </div>
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to continue your journey</p>

            <LoginTabToggle activeTab={activeTab} onSwitch={handleTabSwitch} />

            {activeTab === "email" && (
              <EmailLoginForm
                formData={formData}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onChange={handleEmailChange}
                onSubmit={handleEmailSubmit}
                loading={loading}
              />
            )}

            {activeTab === "mobile" && (
              <MobileOtpForm
                mobileNumber={mobileNumber}
                onMobileChange={handleMobileChange}
                enteredOtp={enteredOtp}
                setEnteredOtp={setEnteredOtp}
                otpSent={otpSent}
                resendTimer={resendTimer}
                onSendOtp={handleSendOtp}
                onSubmit={handleMobileSubmit}
                loading={loading}
              />
            )}

            <div className="signup-link">
              Don&apos;t have an account?{" "}
              <Link href="/signup">Create your account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
