import React from "react";

import "../../../styles/publish-ride.css";
import PRHero from "./components/PRHero";
import PRBenefits from "./components/PRBenefits";
import PRTestimonials from "./components/PRTestimonials";
import PRHowItWorks from "./components/PRHowItWorks";
import PRSupport from "./components/PRSupport";
import PRFaq from "./components/PRFaq";
import { FaRegHourglassHalf } from "react-icons/fa6";
const PublishRide = ({vehiclesFetch,profileData}) => {


  return (
    <>
      <div className="pr-container">
        <PRHero vehiclesFetch={vehiclesFetch} profileData={profileData}/>
        <PRBenefits />
        <PRTestimonials />
        <PRHowItWorks />
        <PRSupport />
        <PRFaq />
        {/* <PRCta /> */}
      </div>
    </>
  );
};

export default PublishRide;
