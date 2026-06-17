"use client";
import React, { useEffect, useState } from "react";

// import SearchRide from "../Rides/find-ride/SearchRide";
import { useAuth } from "@/context/AuthContext";
import Hero from "./components/Hero";
import DetailedCards from "./components/DetailedCards";
import WhyChoose from "./components/WhyChoose";
import Testimonials from "./components/Testimonials";

function Landingpage() {
  const [role, setRole] = useState("");
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);
  const { user } = useAuth();
  console.log("User in landing page:", user);
  return (
    <div className="App">
      <Hero />
      <div
        className={
          role !== "driver" ? "landingpage-search" : "search-disappear"
        }
      >
        {/* {role !== "driver" && <SearchRide />} */}
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
