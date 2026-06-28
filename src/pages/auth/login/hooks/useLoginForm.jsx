"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { loginApi } from "../../../../services/client/authService";
import { loginUser } from "@/redux/slices/authSlice";
import {
  EMAIL_RE,
  PHONE_RE,
  validateLoginForm,
  mapRole,
} from "../utils/loginHelpers";
import { setAuthCookies } from "@/lib/cookie";

export function useLoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("from") || "/";

  // ── Timers ────────────────────────────────────────────────────────────
  const alertTimerRef = useRef(null);
  const otpTimerRef = useRef(null);

  // ── UI state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // ── Email form state ──────────────────────────────────────────────────
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  // ── Mobile OTP state ──────────────────────────────────────────────────
  const [mobileNumber, setMobileNumber] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ── On mount: restore remembered email ───────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("rememberedUser");
    if (saved) {
      setFormData((p) => ({ ...p, identifier: saved }));
      setRememberMe(true);
    }
    return () => {
      clearTimeout(alertTimerRef.current);
      clearInterval(otpTimerRef.current);
    };
  }, []);

  // ── Alert helpers ─────────────────────────────────────────────────────
  const showAlert = (type, message) => {
    clearTimeout(alertTimerRef.current);
    setAlert({ open: true, message, type });
    alertTimerRef.current = setTimeout(
      () => setAlert((a) => ({ ...a, open: false })),
      5000,
    );
  };

  const clearAlert = () => {
    clearTimeout(alertTimerRef.current);
    setAlert((a) => ({ ...a, open: false }));
  };

  // ── Save user to Redux + localStorage after any login ─────────────────
  const persistUser = (userData, token) => {
    const role = mapRole(userData.role);
    const userObj = { ...userData, role, token: token || null };

    dispatch(loginUser({ token, userData: userObj }));

    // if (token) localStorage.setItem("token", token);
    // if (role) localStorage.setItem("role", role);
    // else localStorage.removeItem("role");
    setAuthCookies(token, role);
    if (rememberMe) localStorage.setItem("rememberedUser", formData.identifier);
    else localStorage.removeItem("rememberedUser");
  };

  // ── Navigate back after login ─────────────────────────────────────────
  const redirectAfterLogin = () => router.replace(redirectTo);

  // ── Tab switch: reset all OTP state ──────────────────────────────────
  const handleTabSwitch = (tab) => {
    clearAlert();
    setActiveTab(tab);
    setOtpSent(false);
    setEnteredOtp("");
    setGeneratedOtp("");
    setMobileNumber("");
    setResendTimer(0);
    clearInterval(otpTimerRef.current);
  };

  // ── Email login ───────────────────────────────────────────────────────
  const handleEmailChange = (e) => {
    const { id, value } = e.target;
    clearAlert();
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const error = validateLoginForm(formData);
    if (error) {
      showAlert("error", error);
      return;
    }

    setLoading(true);
    clearAlert();
    try {
      const payload = {
        password: formData.password,
        ...(EMAIL_RE.test(formData.identifier)
          ? { email: formData.identifier }
          : { phone: formData.identifier }),
      };
      const res = await loginApi(payload);
      const responseData = res?.data ?? res;
      const { status, message = "Login successful!", token } = responseData;
      const user = responseData?.user;

      if (!user) {
        showAlert("error", "Unexpected response from server.");
        return;
      }

      persistUser(user, token);
      showAlert(status === "success" ? "success" : "info", message);
      if (status === "success") {
        setFormData({ identifier: "", password: "" });
        setTimeout(redirectAfterLogin, 500);
      }
    } catch (err) {
      showAlert(
        err?.response?.data?.severity || "error",
        err?.response?.data?.message || err?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Mobile OTP ────────────────────────────────────────────────────────
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    clearAlert();
    if (otpSent) {
      setOtpSent(false);
      setEnteredOtp("");
      setGeneratedOtp("");
      clearInterval(otpTimerRef.current);
      setResendTimer(0);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    clearInterval(otpTimerRef.current);
    otpTimerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(otpTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    if (!PHONE_RE.test(mobileNumber)) {
      showAlert("error", "Enter a valid 10-digit mobile number.");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setEnteredOtp("");
    startResendTimer();
    clearAlert();
    showAlert("success", `OTP sent to +91 ${mobileNumber}`);
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (enteredOtp.length !== 6) {
      showAlert("error", "Please enter the 6-digit OTP.");
      return;
    }
    if (enteredOtp !== generatedOtp) {
      showAlert("error", "Invalid OTP. Please try again.");
      return;
    }

    setLoading(true);
    clearAlert();
    try {
      const res = await loginApi({ phone: mobileNumber, otp: enteredOtp });
      const responseData = res?.data ?? res;
      const { status, message = "Login successful!", token } = responseData;
      const user = responseData?.user;

      if (!user) {
        showAlert("error", "Unexpected response from server.");
        return;
      }

      persistUser(user, token);
      showAlert(status === "success" ? "success" : "info", message);
      if (status === "success") setTimeout(redirectAfterLogin, 500);
    } catch (err) {
      showAlert(
        err?.response?.data?.severity || "error",
        err?.response?.data?.message || err?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    // ui
    activeTab,
    handleTabSwitch,
    loading,
    alert,
    setAlert,
    // email form
    formData,
    rememberMe,
    setRememberMe,
    handleEmailChange,
    handleEmailSubmit,
    // mobile otp
    mobileNumber,
    handleMobileChange,
    enteredOtp,
    setEnteredOtp,
    otpSent,
    resendTimer,
    handleSendOtp,
    handleMobileSubmit,
  };
}
