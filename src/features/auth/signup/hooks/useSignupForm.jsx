"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signupApi } from "../../../../services/client/authService";
import { INITIAL_FORM } from "../constants/signupConstants";
import {
  isDriverRole,
  mapRole,
  validateStep,
  buildFormPayload,
} from "../utils/signupHelpers";

import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { setAuthCookies } from "@/lib/cookie";
import { registerBrowserForNotifications } from "@/lib/notifications/register";

export function useSignupForm(roles) {
  const router = useRouter();
  const dispatch = useDispatch();
  const alertTimerRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const isDriver = isDriverRole(formData.usertype, roles);

  const roleOptions = roles.map((r) => ({
    value: String(r.id),
    label: r.name,
  }));

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

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    clearAlert();

    if (id === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((p) => ({ ...p, phone: digits }));
      if (phoneVerified) setPhoneVerified(false);
      return;
    }

    setFormData((p) => ({
      ...p,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validateStep(formData);
    if (err) {
      showAlert("error", err);
      return;
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
      const payload = buildFormPayload(formData);
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

        setTimeout(() => {
          dispatch(loginUser(userObj));
          // NOTE: once the driver profile-completion page/API exists,
          // send drivers there instead of home so they can add docs
          // and wait for verification before publishing rides:
          // router.replace(role === "driver" ? "/complete-profile" : "/");
              registerBrowserForNotifications().catch((error) => {
      console.error("Notification registration failed:", error);
    });
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
    formData,
    handleChange,
    roleOptions,
    isDriver,
    handleSubmit,
    loading,
    openAlert,
    setOpenAlert,
    alertMessage,
    alertType,
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
