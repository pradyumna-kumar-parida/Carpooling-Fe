// src/pages/Vehicle/vehicle-registration/utils/vehicleHelpers.js

export function validateStep(step, vehicleData) {
  const e = {};

  if (step === 0) {
    if (!vehicleData.brand) e.brand = "Please select brand";
    if (!vehicleData.model) e.model = "Please enter model";
    if (!vehicleData.color) e.color = "Please select color";
    if (!vehicleData.registrationNumber) e.registrationNumber = "Please enter registration number";
  }

  if (step === 1) {
    if (!vehicleData.rcNumber) e.rcNumber = "Please enter RC number";
    if (!vehicleData.rcExpiryDate) e.rcExpiryDate = "Please select RC expiry date";
    if (!vehicleData.rcDocument) e.rcDocument = "Please upload RC document";
  }

  if (step === 2) {
    if (!vehicleData.insuranceProvider) e.insuranceProvider = "Please enter insurance provider";
    if (!vehicleData.policyNumber) e.policyNumber = "Please enter policy number";
    if (!vehicleData.insuranceExpiryDate) e.insuranceExpiryDate = "Please select insurance expiry date";
    if (!vehicleData.manufacturyDate) e.manufacturyDate = "Please select vehicle manufacture year";
    if (!vehicleData.insuranceDocument) e.insuranceDocument = "Please upload insurance document";
  }

  if (step === 3) {
    if (!vehicleData.numberOfSeats) e.numberOfSeats = "Please select number of seats";
    if (!vehicleData.fuelType) e.fuelType = "Please select fuel type";
    if (!vehicleData.frontPhoto) e.frontPhoto = "Please upload front photo";
    if (!vehicleData.backPhoto) e.backPhoto = "Please upload back photo";
    if (!vehicleData.sidePhoto) e.sidePhoto = "Please upload side photo";
    if (!vehicleData.numberPlatePhoto) e.numberPlatePhoto = "Please upload number plate photo";
  }

  return e;
}

export function buildVehiclePayload(vehicleData, user) {
  const payload = new FormData();

  // ── Text fields ───────────────────────────────────────────────────────
  payload.append("user_id", user?.id);
  payload.append("brand", vehicleData.brand);
  payload.append("model", vehicleData.model);
  payload.append("manufacture_year", vehicleData.manufacturyDate);
  payload.append("registration_number", vehicleData.registrationNumber);
  payload.append("color", vehicleData.color);
  payload.append("seats", vehicleData.numberOfSeats);
  payload.append("available_seats", vehicleData.numberOfSeats);
  payload.append("fuel_type", vehicleData.fuelType);
  payload.append("rc_number", vehicleData.rcNumber);
  payload.append("rc_expiry_date", vehicleData.rcExpiryDate);
  payload.append("insurance_provider", vehicleData.insuranceProvider);
  payload.append("policy_number", vehicleData.policyNumber);
  payload.append("insurance_expiry", vehicleData.insuranceExpiryDate);

  // ── File fields — only append if file exists (never append empty string) ──
  if (vehicleData.frontPhoto) payload.append("front_image", vehicleData.frontPhoto);
  if (vehicleData.backPhoto) payload.append("back_image", vehicleData.backPhoto);
  if (vehicleData.sidePhoto) payload.append("side_image", vehicleData.sidePhoto);
  if (vehicleData.numberPlatePhoto) payload.append("number_plate_image", vehicleData.numberPlatePhoto);
  if (vehicleData.rcDocument) payload.append("rc_file", vehicleData.rcDocument);
  if (vehicleData.insuranceDocument) payload.append("insurance_file", vehicleData.insuranceDocument);

  return payload;
}