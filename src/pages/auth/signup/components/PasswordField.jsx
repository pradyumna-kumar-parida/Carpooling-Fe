"use client";
import { useState } from "react";
import { RxLockClosed } from "react-icons/rx";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-input-box" style={{ position: "relative" }}>
        <span className="field-icon">
          <RxLockClosed />
        </span>
        <input
          type={visible ? "text" : "password"}
          id={id}
          className="field-input"
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          style={{ paddingRight: "40px" }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="passowrd-field-toggle-icon"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
        </button>
      </div>
    </div>
  );
}
