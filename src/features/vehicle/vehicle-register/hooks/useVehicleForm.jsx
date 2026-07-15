"use client";
import { useState } from "react";
import { vehicleRegistrationApi } from "../../../../services/client/vehicleService";
import { INITIAL_VEHICLE_DATA } from "../constants/vehicleConstants";
import { validateStep, buildVehiclePayload } from "../utils/vehicleHelpers";
import { useSelector } from "react-redux";

export function useVehicleForm() {
  // const { fetchVehicleList } = useVehicleList();
  // ── Stepper ───────────────────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // ── Form data ─────────────────────────────────────────────────────────
  const [vehicleData, setVehicleData] = useState(INITIAL_VEHICLE_DATA);
  const [filePreview, setFilePreview] = useState({});
  const [errors, setErrors] = useState({});

  // ── UI state ──────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // ── Toast helpers ─────────────────────────────────────────────────────
  const showToast = (message, severity = "error") =>
    setToast({ open: true, message, severity });
  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((p) => ({ ...p, open: false }));
  };

  // ── Input change ──────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicleData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ── File change ───────────────────────────────────────────────────────
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    console.log("FILE SAVED →", fieldName, file);
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        [fieldName]: "File size should not exceed 5MB",
      }));
      return;
    }
    setVehicleData((p) => ({ ...p, [fieldName]: file }));
    const reader = new FileReader();
    reader.onloadend = () =>
      setFilePreview((p) => ({ ...p, [fieldName]: reader.result }));
    reader.readAsDataURL(file);
    if (errors[fieldName]) setErrors((p) => ({ ...p, [fieldName]: "" }));
  };

  const handleRemoveFile = (fieldName) => {
    setVehicleData((p) => ({ ...p, [fieldName]: null }));
    setFilePreview((p) => ({ ...p, [fieldName]: null }));
  };

  // ── Step validation wrapper ───────────────────────────────────────────
  const runValidation = (step) => {
    const e = validateStep(step, vehicleData);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ────────────────────────────────────────────────────────
  const handleNext = () => {
    if (!runValidation(activeStep)) return;
    setCompletedSteps((p) => [...p, activeStep]);
    setActiveStep((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setActiveStep((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const user = useSelector((state) => state.auth.user)

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!runValidation(activeStep)) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("vehicleData before submit →", vehicleData);
      const payload = buildVehiclePayload(vehicleData, user);
      for (let [key, value] of payload.entries()) {
        console.log(
          key,
          "→",
          value instanceof File
            ? `FILE: ${value.name} (${value.size} bytes)`
            : value,
        );
      }
      const response = await vehicleRegistrationApi(payload);
      if ([200, 201].includes(response.status)) {
        setIsSuccess(true);
        // await fetchVehicleList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showToast(
          response.data?.message || "Submission failed. Please try again.",
        );
      }
    } catch (err) {
      console.log("422 details →", err?.response?.data);
      showToast(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    // stepper
    activeStep,
    completedSteps,
    // form
    vehicleData,
    filePreview,
    errors,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    // navigation
    handleNext,
    handleBack,
    handleSubmit,
    // ui
    loading,
    isSuccess,
    toast,
    closeToast,
  };
}
