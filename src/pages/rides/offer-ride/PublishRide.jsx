import React from "react";

import "../../../styles/publish-ride.css";
import PRHero from "./components/PRHero";
import PRBenefits from "./components/PRBenefits";
import PRTestimonials from "./components/PRTestimonials";
import PRHowItWorks from "./components/PRHowItWorks";
import PRSupport from "./components/PRSupport";
import PRFaq from "./components/PRFaq";

const PublishRide = () => {
  return (
    <>
      <div className="pr-container">
        <PRHero />
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
