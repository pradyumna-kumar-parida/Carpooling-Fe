"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { CiMail } from "react-icons/ci";
import PasswordField from "./PasswordField";
import Link from "next/link";

type LoginFormData = {
  identifier: string;
  password: string;
};

type EmailLoginFormProps = {
  formData: LoginFormData;
  rememberMe: boolean;
  setRememberMe: Dispatch<SetStateAction<boolean>>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

export default function EmailLoginForm({
  formData,
  rememberMe,
  setRememberMe,
  onChange,
  onSubmitAction,
  loading,
}: EmailLoginFormProps) {
  return (
    <form onSubmit={onSubmitAction}>
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
      <PasswordField value={formData.password} onChangeAction={onChange} />

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
