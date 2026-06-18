// src/pages/Auth/login/utils/loginHelpers.js

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\d{10}$/;

export function validateLoginForm({ identifier, password }) {
  if (!identifier.trim())
    return "Email or phone number is required.";
  if (!EMAIL_RE.test(identifier) && !PHONE_RE.test(identifier))
    return "Enter a valid email address or 10-digit phone number.";
  if (!password)
    return "Password is required.";
  return null;
}

export function mapRole(rawRole) {
  const r = String(rawRole);
  if (r === "1") return "admin";
  if (r === "2") return "driver";
  if (r === "3") return "passenger";
  return null;
}