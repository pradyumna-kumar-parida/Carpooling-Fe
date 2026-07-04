"use client";
import { Input } from "antd";
import { LiaPhoneSolid } from "react-icons/lia";
import { type ChangeEvent, type FormEvent, type Dispatch, type SetStateAction } from "react";

type MobileOtpFormProps = {
  mobileNumber: string;
  onMobileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  enteredOtp: string;
  setEnteredOtp: Dispatch<SetStateAction<string>>;
  otpSent: boolean;
  resendTimer: number;
  onSendOtp: () => void;
  onSubmitAction: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

export default function MobileOtpForm({
  mobileNumber,
  onMobileChange,
  enteredOtp,
  setEnteredOtp,
  otpSent,
  resendTimer,
  onSendOtp,
  onSubmitAction,
  loading,
}: MobileOtpFormProps) {
  return (
    <form onSubmit={onSubmitAction}>
      {/* ── Mobile number ── */}
      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number</label>
        <div className="input-wrapper" style={{ position: "relative" }}>
          <span className="input-icon">
            <LiaPhoneSolid />
          </span>
          <input
            type="tel"
            id="mobileNumber"
            placeholder="Enter your 10-digit mobile number"
            required
            value={mobileNumber}
            onChange={onMobileChange}
            maxLength={10}
            style={{ paddingRight: otpSent ? "10px" : "90px" }}
          />
        </div>
      </div>

      {/* ── OTP input (shown after send) ── */}
      {otpSent && (
        <div className="form-group">
          <label>Enter OTP</label>
          <div className="otp-input-wrap">
            <Input.OTP
              length={6}
              value={enteredOtp}
              onChange={(val) => setEnteredOtp(val)}
            />
          </div>
          <div
            className="resend-otp"
            style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}
          >
            {resendTimer > 0 ? (
              <span>
                Resend OTP in{" "}
                <strong style={{ color: "#0033a1" }}>{resendTimer}s</strong>
              </span>
            ) : (
              <span>
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  onClick={onSendOtp}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#0033a1",
                    fontWeight: 700,
                    fontSize: 12,
                    padding: 0,
                  }}
                >
                  Resend OTP
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="auth-login-btn"
        disabled={loading}
        style={{ opacity: loading ? 0.75 : 1, marginTop: 8 }}
      >
        {otpSent ? "Verify & Sign In" : "Get OTP"}
      </button>
    </form>
  );
}
