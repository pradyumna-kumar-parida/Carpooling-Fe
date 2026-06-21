"use client";

import {
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import "../../../styles/find-ride.css"
import ArcLoader from "../../../components/Loader";
import { STEPS } from "./constants/vehicleConstants";
import { useVehicleForm } from "./hooks/useVehicleForm";

import SuccessScreen from "./components/SuccessScreen";
import StepBasicInfo from "./components/StepBasicInfo";
import StepDocuments from "./components/StepDocuments";
import StepInsurance from "./components/StepInsurance";
import StepFeaturesPhotos from "./components/StepFeaturesPhotos";
import { useRouter } from "next/navigation";

// ── Maps step index to its component ──────────────────────────────────────
function StepContent({
  step,
  vehicleData,
  filePreview,
  errors,
  onChange,
  onFileChange,
  onFileRemove,
}) {
  const shared = {
    vehicleData,
    filePreview,
    errors,
    onChange,
    onFileChange,
    onFileRemove,
  };
  if (step === 0) return <StepBasicInfo {...shared} />;
  if (step === 1) return <StepDocuments {...shared} />;
  if (step === 2) return <StepInsurance {...shared} />;
  if (step === 3) return <StepFeaturesPhotos {...shared} />;
  return null;
}

// ── Full-screen loader ─────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArcLoader />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function VehicleRegistration() {
  const router = useRouter();

  const {
    activeStep,
    completedSteps,
    vehicleData,
    filePreview,
    errors,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    handleNext,
    handleBack,
    handleSubmit,
    loading,
    isSuccess,
    toast,
    closeToast,
  } = useVehicleForm();

  return (
    <>
      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <MuiAlert
          severity={toast.severity}
          variant="filled"
          onClose={closeToast}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>

      {loading && <PageLoader />}

      <div className="vehicledetails-page">
        <div className="vehicledetails-container">
          {/* ── Page header ── */}
          <div className="vehicledetails-header">
            <h1 className="vehicledetails-title">Vehicle Registration</h1>
            <p className="vehicledetails-subtitle">
              Complete your vehicle details to start earning with us
            </p>
          </div>

          {/* ── Stepper (hidden on success) ── */}
          {!isSuccess && (
            <div className="vehicledetails-stepper-wrapper">
              <Stepper
                activeStep={activeStep}
                className="vehicledetails-stepper"
              >
                {STEPS.map((label, index) => (
                  <Step key={label} completed={completedSteps.includes(index)}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <LinearProgress
                variant="determinate"
                value={(activeStep / (STEPS.length - 1)) * 100}
                className="vehicledetails-progress"
              />
            </div>
          )}

          <div className="vehicledetails-content">
            {isSuccess ? (
              <SuccessScreen
                onViewDetails={() => router.push("/vehicle-details")}
                onGoHome={() => router.push("/")}
              />
            ) : (
              <>
                <StepContent
                  step={activeStep}
                  vehicleData={vehicleData}
                  filePreview={filePreview}
                  errors={errors}
                  onChange={handleInputChange}
                  onFileChange={handleFileChange}
                  onFileRemove={handleRemoveFile}
                />

                {/* ── Navigation buttons ── */}
                <div className="vehicledetails-actions">
                  {activeStep > 0 && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                      className="vehicledetails-btn-back"
                    >
                      Back
                    </Button>
                  )}
                  <div className="vehicledetails-actions-right">
                    {activeStep < STEPS.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                        className="vehicledetails-btn-next"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="vehicledetails-btn-submit"
                        style={{ opacity: loading ? 0.85 : 1 }}
                      >
                        Submit for Verification
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
