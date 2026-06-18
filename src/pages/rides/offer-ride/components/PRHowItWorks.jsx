"use client";
import React from "react";
import rideBanner from "../../../../assets/images/car-ride-banner.jpg";
import Image from "next/image";
const PRHowItWorks = () => {
  const steps = [
    {
      id: 1,

      title: "Create a Carpooling account",
      description:
        "Add your profile picture, a few words about you and your phone number to increase trust between members.",
    },
    {
      id: 2,

      title: "Publish your ride",
      description:
        "Indicate departure and arrival points, the date of the ride and check our recommended price to increase your chances of getting your first passengers and ratings.",
    },
    {
      id: 3,

      title: "Accept booking requests",
      description:
        "Review passenger profiles and accept their requests to ride with you. That's how easy it is to start saving on travel costs!",
    },
  ];

  return (
    <section className="pr-how-it-works">
      <h2 className="pr-how-title">Publish your ride in just minutes</h2>

      <div className="pr-how-content">
        <div className="pr-how-visual">
          <div className="pr-video-placeholder">
            <Image
              src={rideBanner}
              alt="How it works"
              className="pr-video-thumbnail"
            />
          </div>
        </div>

        <div className="pr-how-steps">
          {steps.map((step) => (
            <div key={step.id} className="pr-step">
              <div className="pr-step-number">{step.id}</div>
              <div className="pr-step-content">
                <h3 className="pr-step-title">{step.title}</h3>
                <p className="pr-step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PRHowItWorks;
