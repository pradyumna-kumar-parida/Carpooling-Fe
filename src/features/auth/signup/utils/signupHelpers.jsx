// src/pages/Auth/signup/utils/signupHelpers.js

import {
  DRIVER_STEPS,
  FILE_FIELDS,
  FIELD_META,
} from "../constants/signupConstants";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\d{10}$/;

export function isDriverRole(usertype, roles) {
  const matched = roles.find((r) => r.name.toLowerCase() === "driver");
  return matched ? String(matched.id) === String(usertype) : false;
}

export function mapRole(rawRole) {
  const r = String(rawRole);
  if (r === "1") return "admin";
  if (r === "2") return "driver";
  if (r === "3") return "passenger";
  return null;
}

export function validateStep(formData) {
  if (!formData.fullname?.trim()) return "Full name is required.";
  if (!EMAIL_RE.test(formData.email))
    return "Please enter a valid email address.";
  if (!PHONE_RE.test(formData.phone))
    return "Phone number must be exactly 10 digits.";
  if (!formData.usertype) return "Please select a user type.";
  if (formData.password.length < 8)
    return "Password must be at least 8 characters.";
  if (formData.password !== formData.confirmPassword)
    return "Passwords do not match.";
  return null;
}

export function validateDriverStep(stepIndex, formData) {
  const step = DRIVER_STEPS[stepIndex];
  for (const fieldId of step.fields) {
    const meta = FIELD_META[fieldId];
    if (!meta) continue;
    if (FILE_FIELDS.has(fieldId)) {
      if (!formData[fieldId]) return `Please upload your ${meta.label}.`;
    } else {
      if (!formData[fieldId]?.trim()) return `${meta.label} is required.`;
    }
  }
  return null;
}

export function buildFormPayload(formData, isDriver) {
  const payload = new FormData();
  payload.append("name", formData.fullname);
  payload.append("email", formData.email);
  payload.append("phone", formData.phone);
  payload.append("role_id", formData.usertype);
  payload.append("password", formData.password);

  if (!isDriver) return payload;

  payload.append("city", formData.city);
  payload.append("state", formData.state);
  payload.append("country", formData.country);
  payload.append("postal_code", formData.postalCode);
  payload.append("address", formData.address);
  payload.append("bank_account_holder", formData.bankAccountHolder);
  payload.append("bank_account_number", formData.bankAccountNumber);
  payload.append("bank_account_ifsc", formData.bankIFSC);
  payload.append("bank_branch_name", formData.bankBranchName);

  if (formData.driverLicense)
    payload.append("driver_license", formData.driverLicense);
  if (formData.aadhaarCard) payload.append("adhhar_card", formData.aadhaarCard);
  if (formData.panCard) payload.append("pan_card", formData.panCard);
  if (formData.bankAccountDetails)
    payload.append("bank_account", formData.bankAccountDetails);
  if (formData.profilePicture)
    payload.append("profile_picture", formData.profilePicture);

  return payload;
}
