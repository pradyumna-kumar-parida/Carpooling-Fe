import { getPopularRoutes } from "@/services/server/rideService";
import React from "react";

const FRPopularRoutes = async () => {
  const popularRoute = await getPopularRoutes();

  console.log("popular routes", popularRoute);

  return (
    <section className="fr-routes-section">
      <div className="fr-routes-wrapper">
        <h2 className="fr-routes-title">
          Travel for less on these popular routes
        </h2>

        <div className="fr-routes-list">
          {popularRoute.data?.map((route, index) => (
            <div key={index} className="fr-route-item">
              <div className="fr-route-details">
                <span className="fr-route-from">{route.origin}</span>

                <span className="fr-route-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="fr-route-to">{route.destination}</span>
              </div>

              <button className="fr-route-btn" type="button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FRPopularRoutes;
