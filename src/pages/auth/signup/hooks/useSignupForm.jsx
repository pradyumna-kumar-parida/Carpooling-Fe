"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRolesApi, signupApi } from "../../../../services/authService";
import { INITIAL_FORM } from "../constants/signupConstants";
import {
  isDriverRole,
  mapRole,
  validateStep,
  validateDriverStep,
  buildFormPayload,
} from "../utils/signupHelpers";

import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { setAuthCookies } from "@/lib/cookie";

export function useSignupForm() {
  const router = useRouter();

  const dispatch = useDispatch();

  const alertTimerRef = useRef(null);

  // ── Form + stepper ────────────────────────────────────────────────────
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // ── Alert ─────────────────────────────────────────────────────────────
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  // ── OTP / phone verification ──────────────────────────────────────────
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────
  const isDriver = isDriverRole(formData.usertype, roles);
  const totalSteps = isDriver ? 1 + 3 : 1;
  const isFinalStep = step === totalSteps - 1;

  // ── Fetch roles on mount ──────────────────────────────────────────────
  useEffect(() => {
    getRolesApi()
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));
    return () => clearTimeout(alertTimerRef.current);
  }, []);

  const roleOptions = roles.map((r) => ({
    value: String(r.id),
    label: r.name,
  }));

  // ── Alert helpers ─────────────────────────────────────────────────────
  const showAlert = (severity, message) => {
    clearTimeout(alertTimerRef.current);
    setAlertType(severity);
    setAlertMessage(message);
    setOpenAlert(true);
    alertTimerRef.current = setTimeout(() => setOpenAlert(false), 5000);
  };

  const clearAlert = () => {
    clearTimeout(alertTimerRef.current);
    setOpenAlert(false);
  };

  // ── OTP handlers ──────────────────────────────────────────────────────
  const handleOpenOtpModal = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtp("");
    setIsVerified(false);
    alert(`Your OTP is: ${randomOtp}`); // replace with real SMS API
    setOpenOtpModal(true);
  };

  const handleCloseOtpModal = () => {
    setOpenOtpModal(false);
    setOtp("");
    setIsVerified(false);
    setGeneratedOtp("");
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      showAlert("error", "Please enter the OTP");
      return;
    }
    if (otp === generatedOtp) {
      setIsVerified(true);
      setPhoneVerified(true);
      showAlert("success", "Phone number verified successfully!");
      setTimeout(handleCloseOtpModal, 1500);
    } else {
      showAlert("error", "Invalid OTP. Please try again.");
    }
  };

  // ── Form change ───────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    clearAlert();

    if (id === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, phone: digits }));
      if (phoneVerified) setPhoneVerified(false);
      return;
    }

    if (id === "usertype") {
      setStep(0);
    }

    setFormData((p) => ({
      ...p,
      [id]:
        type === "checkbox"
          ? checked
          : type === "file"
            ? files[0] || null
            : value,
    }));
  };

  // ── Step navigation ───────────────────────────────────────────────────
  const handleNext = (e) => {
    e.preventDefault();
    const err =
      step === 0
        ? validateStep(formData)
        : isDriver
          ? validateDriverStep(step - 1, formData)
          : null;
    if (err) {
      showAlert("error", err);
      return;
    }
    clearAlert();
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    clearAlert();
    setStep((s) => s - 1);
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFinalStep) {
      handleNext(e);
      return;
    }

    const baseErr = validateStep(formData);
    if (baseErr) {
      showAlert("error", baseErr);
      return;
    }

    if (isDriver) {
      const err = validateDriverStep(step - 1, formData);
      if (err) {
        showAlert("error", err);
        return;
      }
    }
    if (!formData.terms) {
      showAlert(
        "warning",
        "You must agree to the Terms & Conditions to proceed.",
      );
      return;
    }

    setLoading(true);
    clearAlert();

    try {
      const payload = buildFormPayload(formData, isDriver);
      const response = await signupApi(payload);
      const {
        status,
        message = "Registration successful!",
        token,
      } = response.data;

      if (token) localStorage.setItem("token", token);
      showAlert(status === "success" ? "success" : "info", message);

      if (status === "success") {
        const role = mapRole(response.data.user.role);

        const userObj = {
          ...response.data.user,
          role,
          token: token || null,
        };

        setAuthCookies(token, role);
        setFormData(INITIAL_FORM);
        setStep(0);

        setTimeout(() => {
          dispatch(loginUser(userObj));
          router.replace("/");
        }, 500);
      }
    } catch (err) {
      showAlert(
        err?.response?.data?.severity || "error",
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    // form
    formData,
    handleChange,
    roleOptions,
    // stepper
    step,
    totalSteps,
    isFinalStep,
    isDriver,
    handleNext,
    handleBack,
    handleSubmit,
    // loading
    loading,
    // alert
    openAlert,
    setOpenAlert,
    alertMessage,
    alertType,
    // otp
    openOtpModal,
    handleOpenOtpModal,
    handleCloseOtpModal,
    phoneVerified,
    otp,
    setOtp,
    isVerified,
    handleVerifyOtp,
  };
}
