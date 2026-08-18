"use client";

import React from "react";

const ErrorPage = ({ reset }) => {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <h2>Something went wrong</h2>

        <p>We’re unable to load this page right now. Please try again.</p>

        <button onClick={() => reset()}>Try Again</button>
      </div>
    </div>
  );
};

export default ErrorPage;
