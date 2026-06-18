import React from "react";

const FRPopularRoutes = () => {
  const routes = [
    { id: 1, from: "New Delhi", to: "Chandigarh" },
    { id: 2, from: "New Delhi", to: "Jaipur" },
    { id: 3, from: "New Delhi", to: "Agra" },
    { id: 4, from: "Mumbai", to: "Pune" },
    { id: 5, from: "Agra", to: "New Delhi" },
    { id: 6, from: "Jaipur", to: "New Delhi" },
    { id: 7, from: "Chandigarh", to: "New Delhi" },
  ];

  return (
    <section className="fr-routes-section">
      <div className="fr-routes-wrapper">
        <h2 className="fr-routes-title">
          Travel for less on these popular routes
        </h2>

        <div className="fr-routes-list">
          {routes.map((route) => (
            <div key={route.id} className="fr-route-item">
              <div className="fr-route-details">
                <span className="fr-route-from">{route.from}</span>
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
                <span className="fr-route-to">{route.to}</span>
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
