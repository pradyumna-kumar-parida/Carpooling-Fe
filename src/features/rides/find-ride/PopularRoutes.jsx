import { getPopularRoutes } from "@/services/server/rideService";
import Link from "next/link";
import React from "react";

const FRPopularRoutes = async () => {
  const popularRoutes = await getPopularRoutes();

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <section className="fr-routes-section">
      <div className="fr-routes-wrapper">
        <h2 className="fr-routes-title">
          Travel for less on these popular routes
        </h2>

        <div className="fr-routes-list">
          {popularRoutes.data?.map((route, index) => {
            const params = new URLSearchParams({
              from: route.origin,
              to: route.destination,
              date,
              passengers: "1",
            });

            return (
              <Link
                key={index}
                href={`/all-rides?${params.toString()}`}
                className="fr-route-item"
              >
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
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FRPopularRoutes;
