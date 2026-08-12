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

export function buildFormPayload(formData) {
  const payload = new FormData();
  payload.append("name", formData.fullname);
  payload.append("email", formData.email);
  payload.append("phone", formData.phone);
  payload.append("role_id", formData.usertype);
  payload.append("password", formData.password);
  return payload;
}
