import React from "react";
import SearchRide from "../../../components/SearchRide";
import FRPopularRoutes from "./PopularRoutes";
import "../../../styles/find-ride.css";

const BookRide = () => {
  return (
    <>
      <div className="fr-container">
        <div className="find-ride-search">
          <h1 className="fr-page-title">Find a ride</h1>
          <SearchRide />
        </div>
        <FRPopularRoutes />
      </div>
    </>
  );
};

export default BookRide;
