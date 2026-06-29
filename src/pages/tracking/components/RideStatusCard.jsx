import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { FaCalendarAlt, FaCar, FaClock, FaCheckCircle } from "react-icons/fa";

import { FaLocationDot } from "react-icons/fa6";

const STEPS = [
  { key: "scheduled", label: "Scheduled", icon: FaCalendarAlt },
  { key: "driver_on_way", label: "Driver On Way", icon: FaCar },
  { key: "arrived", label: "Arrived", icon: FaLocationDot },
  { key: "in_progress", label: "In Progress", icon: FaClock },
  { key: "completed", label: "Completed", icon: FaCheckCircle },
];

const COLORS = {
  blue: "#1a56db",
  gray: "#94a3b8",
  white: "#ffffff",
};

function StepIconCustom(props) {
  const { active, completed, icon } = props;

  const IconComponent = STEPS[Number(icon) - 1]?.icon || FaCalendarAlt;

  const isBlue = active || completed;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        borderRadius: "50%",
        boxSizing: "border-box",
        background: COLORS.white,
        border: `2.5px solid ${isBlue ? COLORS.blue : COLORS.gray}`,
        transition: "all 0.3s ease",
      }}
      aria-hidden="true"
    >
      <IconComponent size={18} color={isBlue ? COLORS.blue : COLORS.gray} />
    </div>
  );
}

const RideStatusCard = ({ rideStatus = "scheduled" }) => {
  const currentStepIndex = STEPS.findIndex(
    (step) => step.key === rideStatus.toLowerCase(),
  );

  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;
  console.log(" curr", currentStepIndex);

  return (
    <div className="chatpanel-card ride-status-card">
      <h3 className="card-title" style={{ marginBottom: 18 }}>
        Ride Status
      </h3>

      <Box sx={{ width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepLabel-label": {
              color: COLORS.gray,
              fontSize: "11px",
              fontWeight: 500,
              marginTop: "8px",
              transition: "color 0.3s ease",
            },

            "& .MuiStepLabel-label.Mui-active": {
              color: COLORS.blue,
              fontWeight: 700,
            },

            "& .MuiStepLabel-label.Mui-completed": {
              color: COLORS.blue,
              fontWeight: 600,
            },

            "& .MuiStepConnector-root": {
              top: "22px",
            },

            "& .MuiStepConnector-line": {
              borderColor: COLORS.gray,
              borderTopWidth: 2.5,
              transition: "border-color 0.3s ease",
            },

            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: COLORS.blue,
            },

            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: COLORS.blue,
            },
          }}
        >
          {STEPS.map((step) => (
            <Step key={step.key} aria-label={`Step: ${step.label}`}>
              <StepLabel StepIconComponent={StepIconCustom}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};

export default RideStatusCard;
