"use client";
import { useState } from "react";
import { RxLockClosed } from "react-icons/rx";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function PasswordField({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <div className="input-wrapper" style={{ position: "relative" }}>
        <span className="input-icon">
          <RxLockClosed />
        </span>
        <input
          type={visible ? "text" : "password"}
          id="password"
          placeholder="Enter your password"
          required
          value={value}
          onChange={onChange}
          style={{ paddingRight: "40px" }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="password-toggle-btn"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
        </button>
      </div>
    </div>
  );
}
