"use client";
import React, { useEffect, useState } from "react";

import SearchRide from "../../components/SearchRide";

import Hero from "./components/Hero";
import DetailedCards from "./components/DetailedCards";
import WhyChoose from "./components/WhyChoose";
import Testimonials from "./components/Testimonials";
import { getRole } from "@/lib/cookie";

function Landingpage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  const isDriver = role === "driver";

  return (
    <div className="App">
      <Hero />
      <div className={isDriver ? "search-disappear" : "landingpage-search"}>
        {!isDriver && <SearchRide />}
      </div>
      <div className="container" id="find">
        <DetailedCards />
        <WhyChoose />
        <Testimonials />
      </div>
    </div>
  );
}

export default Landingpage;
