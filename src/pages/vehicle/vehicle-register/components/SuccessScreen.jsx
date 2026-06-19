"use client";
import { Button } from "@mui/material";
import { FaHourglassHalf } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import sucessBedge from "../../../../assets/images/sucess-bedge.png";
import Image from "next/image";

const CHECKLIST = [
  "Basic information saved",
  "RC document uploaded",
  "Insurance document uploaded",
  "Vehicle photos uploaded",
];

export default function SuccessScreen({ onViewDetails, onGoHome }) {
  return (
    <div className="registration--sucess-box">
      <div className="sucess-status-badge">
        <FaHourglassHalf /> Pending verification
      </div>
      <div className="sucessBedge">
        <Image
          src={sucessBedge}
          alt="success-badge"
          width={300}
          height={300}
          className="success-badge-image"
        />
      </div>
      <h2 className="sucess-heading">Registration Successful!</h2>
      <p className="sucess-subheading">
        Your vehicle details have been submitted. Our team will review and
        verify your documents within 24–48 hours.
      </p>
      <div className="basicDetails-registration">
        {CHECKLIST.map((item) => (
          <div className="details-Items" key={item}>
            <IoMdCheckmarkCircleOutline
              color="#3b82f6"
              size={14}
              style={{ flexShrink: 0 }}
            />
            {item}
          </div>
        ))}
      </div>
      <div className="fotter-registration-btn">
        <Button
          variant="contained"
          onClick={onViewDetails}
          className="vehicledetails-btn-next"
        >
          View Vehicle Details
        </Button>
        <Button
          variant="outlined"
          onClick={onGoHome}
          className="vehicledetails-btn-back"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
