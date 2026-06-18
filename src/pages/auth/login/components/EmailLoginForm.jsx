"use client";

import { CiMail } from "react-icons/ci";
import PasswordField from "./PasswordField";
import Link from "next/link";

export default function EmailLoginForm({
  formData,
  rememberMe,
  setRememberMe,
  onChange,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit}>
      {/* ── Identifier ── */}
      <div className="form-group">
        <label htmlFor="identifier">Email</label>
        <div className="input-wrapper">
          <span className="input-icon">
            <CiMail />
          </span>
          <input
            type="text"
            id="identifier"
            placeholder="Enter your email or phone number"
            required
            value={formData.identifier}
            onChange={onChange}
          />
        </div>
      </div>

      {/* ── Password ── */}
      <PasswordField value={formData.password} onChange={onChange} />

      {/* ── Remember me + Forgot ── */}
      <div className="forgot-password">
        <label className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={rememberMe}
            onChange={() => setRememberMe((v) => !v)}
          />
          <span className="checkbox-text">Remember me</span>
        </label>
        <Link href="/forgot">Forgot Password?</Link>
      </div>

      <button
        type="submit"
        className="auth-login-btn"
        disabled={loading}
        style={{ opacity: loading ? 0.75 : 1 }}
      >
        Sign In
      </button>
    </form>
  );
}
