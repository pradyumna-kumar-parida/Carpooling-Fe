"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCarAlt, FaUserAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import {
  IoLocationOutline,
  IoCloudUploadOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";

import { CiGlobe } from "react-icons/ci";
import { PiBankLight, PiHashStraightLight } from "react-icons/pi";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArcLoader from "@/components/Loader";
import { UpdateProfilepApi } from "@/services/client/authService";
import { showAlert } from "@/lib/toast";

// ── Static config ───────────────────────────────────────────────────────
const ICONS = {
  map: IoLocationOutline,
  bank: PiBankLight,
  hash: PiHashStraightLight,
  globe: CiGlobe,
};

const STEPS = [
  {
    title: "Basic Details",
    subtitle: "Tell us where you're based",
    fields: ["city", "state", "country", "postalCode", "address"],
  },
  {
    title: "Bank Details",
    subtitle: "For secure earnings transfer",
    fields: [
      "bankAccountHolder",
      "bankAccountNumber",
      "bankIFSC",
      "bankBranchName",
    ],
  },
  {
    title: "Upload Documents",
    subtitle: "Required for driver verification",
    fields: [
      "driverLicense",
      "aadhaarCard",
      "panCard",
      "bankAccountDetails",
      "profilePicture",
    ],
  },
];

const FILE_FIELDS = new Set([
  "driverLicense",
  "aadhaarCard",
  "panCard",
  "bankAccountDetails",
  "profilePicture",
]);

const FIELD_META = {
  city: {
    label: "City",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your city",
  },
  state: {
    label: "State",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your state",
  },
  country: {
    label: "Country",
    icon: ICONS.globe,
    type: "text",
    placeholder: "Enter your country",
  },
  postalCode: {
    label: "Postal Code",
    icon: ICONS.hash,
    type: "text",
    placeholder: "Enter postal code",
  },
  address: {
    label: "Address",
    icon: ICONS.map,
    type: "text",
    placeholder: "Enter your full address",
  },
  bankAccountHolder: {
    label: "Account Holder Name",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Name on bank account",
  },
  bankAccountNumber: {
    label: "Bank Account Number",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter account number",
  },
  bankIFSC: {
    label: "Bank IFSC Code",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter IFSC code",
  },
  bankBranchName: {
    label: "Bank Name",
    icon: ICONS.bank,
    type: "text",
    placeholder: "Enter bank name",
  },
  driverLicense: { label: "Driving License" },
  aadhaarCard: { label: "Aadhaar Card" },
  panCard: { label: "PAN Card" },
  bankAccountDetails: { label: "Bank Account Details" },
  profilePicture: { label: "Profile Picture" },
};

const INITIAL_FORM = {
  city: "",
  state: "",
  country: "",
  postalCode: "",
  address: "",

  bankAccountHolder: "",
  bankAccountNumber: "",
  bankIFSC: "",
  bankBranchName: "",

  driverLicense: null,
  aadhaarCard: null,
  panCard: null,
  bankAccountDetails: null,
  profilePicture: null,
};

// ── Validation ───────────────────────────────────────────────────────────
function validateStepFields(stepIndex, formData, steps) {
  const step = steps[stepIndex];
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

// ── Payload builder (maps to backend keys) ────────────────────────────────
function buildPayload(formData) {
  const payload = new FormData();
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

// ── Small shared bits ──────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="loader-back-wrapper">
      <ArcLoader />
    </div>
  );
}

function StepDots({ total, current }) {
  return (
    <div className="step-dotts">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? "24px" : "8px",
            height: "8px",
            borderRadius: "4px",
            background:
              i === current
                ? "var(--custom-one)"
                : i < current
                  ? "#8395f3"
                  : "var(--ntfy-border)",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}

function FieldInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}) {
  const Icon = icon;
  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-input-box">
        <span className="field-icon">{Icon && <Icon />}</span>
        <input
          type={type}
          id={id}
          name={id}
          className="field-input"
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function FileField({ id, label, value, onChange }) {
  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div
        className="field-input-box"
        style={{ cursor: "pointer", position: "relative" }}
      >
        <span className="field-icon">
          <IoCloudUploadOutline />
        </span>
        <span
          className="file-upload-field-icon field-input"
          style={{ color: value ? "inherit" : "#aaa" }}
        >
          {value ? value.name : "Choose file…"}
        </span>
        <input
          type="file"
          id={id}
          accept="image/*,.pdf"
          onChange={onChange}
          className="file-upload-suggestation"
        />
      </div>
    </div>
  );
}

// ── Step content renderer ─────────────────────────────────────────────────
function StepContent({ currentStep, formData, onChange, hasProfilePicture }) {
  console.log("has profile",hasProfilePicture);
  
  return (
    <>
      <p className="cp-step-subtitle">{currentStep.subtitle}</p>

      {/* {hasProfilePicture && currentStep.title === "Upload Documents" && (
        <p className="cp-step-subtitle" style={{ marginTop: -8 }}>
          Your profile photo is already uploaded — no need to add it again.
        </p>
      )} */}

      <div className="signup-form-grid">
        {currentStep.fields.map((fieldId) => {
          const meta = FIELD_META[fieldId];
          if (!meta) return null;
          return FILE_FIELDS.has(fieldId) ? (
            <FileField
              key={fieldId}
              id={fieldId}
              label={meta.label}
              value={formData[fieldId]}
              onChange={onChange}
            />
          ) : (
            <FieldInput
              key={fieldId}
              id={fieldId}
              label={meta.label}
              type={meta.type}
              placeholder={meta.placeholder}
              value={formData[fieldId]}
              onChange={onChange}
              icon={meta.icon}
            />
          );
        })}
      </div>
    </>
  );
}

// ── Pending verification screen ────────────────────────────────────────────
function PendingVerification() {
  return (
    <div className="cp-pending-wrap">
      <div className="cp-pending-card">
        <div className="cp-pending-icon">
          <IoCheckmarkCircle />
        </div>
        <h2 className="cp-pending-title">Profile Submitted</h2>
        <p className="cp-pending-text">
          Thanks! Your details and documents are now with our team for
          verification. This usually takes a short while — we'll notify you once
          your account is approved.
        </p>
        <p className="cp-pending-note">
          {/* <IoInformationCircleOutline  size={18}/> */}
          You won't be able to publish rides until verification is complete.
        </p>
        <Link href="/" className="register-btn cp-pending-btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default function CompleteProfile({ hasProfilePicture: initialHasProfilePicture }) {
  const router = useRouter();

  const [hasProfilePicture, setHasProfilePicture] = useState(
    initialHasProfilePicture ?? false
  );

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
useEffect(() => {
  const profilePhotoAdded =
    sessionStorage.getItem("profilePhotoadded") === "true";

  setHasProfilePicture(profilePhotoAdded);
}, []);
  // Skip the "profilePicture" field entirely if the user already uploaded
  // one via the profile page's quick-upload (+) flow.
  const steps = useMemo(() => {
    if (!hasProfilePicture) return STEPS;
    return STEPS.map((s, idx) =>
      idx === 2
        ? { ...s, fields: s.fields.filter((f) => f !== "profilePicture") }
        : s,
    );
  }, [hasProfilePicture]);

  const totalSteps = steps.length;
  const isFinalStep = step === totalSteps - 1;

  // const showAlert = (severity, message) => {
  //   setAlertType(severity);
  //   setAlertMessage(message);
  //   setOpenAlert(true);
  // };

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setFormData((p) => ({
      ...p,
      [id]: type === "file" ? files[0] || null : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const err = validateStepFields(step, formData, steps);
    if (err) {
      showAlert("error", err);
      return;
    }
    setOpenAlert(false);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setOpenAlert(false);
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFinalStep) {
      handleNext(e);
      return;
    }

    const err = validateStepFields(step, formData, steps);
    if (err) {
      showAlert("error", err);
      return;
    }

    setLoading(true);
    setOpenAlert(false);

    try {
      const payload = buildPayload(formData);
      const response = await UpdateProfilepApi(payload);
      showAlert(
        "success",
        response?.data?.message || "Profile submitted for verification.",
      );
      setSubmitted(true);
    } catch (err) {
      showAlert(
        "error",
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          severity={alertType}
          variant="filled"
          onClose={() => setOpenAlert(false)}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar> */}

      {loading && <PageLoader />}

      <div className="complete-profile-container">
        {submitted ? (
          <PendingVerification />
        ) : (
          <>
            {/* ── Left decorative panel ── */}
            <div className="image-section">
              <div className="floating-shapes">
                <div className="shape" />
                <div className="shape" />
                <div className="shape" />
              </div>
              <div className="image-overlay">
                <div className="auth-logo">
                  <div className="auth-logo-icon">
                    <FaCarAlt />
                  </div>
                  <h2>Carpooling</h2>
                </div>
                <h1>Complete Your Driver Profile</h1>
                <p>
                  Add your location, bank details and documents so we can verify
                  your account and get you on the road.
                </p>
              </div>
              <Link href="/" className="back-btn">
                <FaArrowLeft /> Back
              </Link>
            </div>

            {/* ── Right form panel ── */}
            <div className="cp-form-panel">
              <div className="cp-form-wrapper">
                <div className="logo-section">
                  <div className="logo-icon">
                    <FaUserAlt />
                  </div>
                </div>
                <h2 className="cp-title">Complete Your Profile</h2>
                <p className="cp-desc">{steps[step].title}</p>

                <StepDots total={totalSteps} current={step} />

                <form
                  className="registration-form"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <StepContent
                    currentStep={steps[step]}
                    formData={formData}
                    onChange={handleChange}
                    hasProfilePicture={hasProfilePicture}
                  />

                  <div style={{ display: "flex", gap: 12 }}>
                    {step > 0 && (
                      <button
                        type="button"
                        className="register-btn register-back-btn"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="submit"
                      className="register-btn"
                      style={{ flex: 1, opacity: loading ? 0.75 : 1 }}
                      disabled={loading}
                    >
                      {isFinalStep ? "Submit for Verification" : "Next"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
