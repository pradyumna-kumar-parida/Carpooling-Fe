"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import img1 from "../../../assets/images/empty-seat.jpg";
import img2 from "../../../assets/images/need-ride.jpg";
import img3 from "../../../assets/images/driver-image.jpg";
import img4 from "../../../assets/images/passenger.webp";
import { getRole, getToken } from "@/lib/cookie";

const buildCards = (role, token) => {
  const isLoggedIn = Boolean(token);
  const showDriver = role === "driver" || !isLoggedIn;
  const showPassenger = role === "passenger" || !isLoggedIn;

  return [
    // DRIVER CARDS
    ...(showDriver
      ? [
          {
            id: 1,
            theme: "",
            title: "Have empty seats?",
            subtitle: "Share your ride & earn money",
            features: [
              "Set your own price",
              "Choose your co-travelers",
              "Travel together, save together",
            ],
            buttonText: "Offer a Ride",
            buttonClass: "btn-blue",
            image: img1,
          },
          ...(isLoggedIn
            ? [
                {
                  id: 3,
                  theme: "green-theme",
                  title: "Publish Your Ride",
                  subtitle: "Start accepting passengers today",
                  features: [
                    "Post your trip easily",
                    "Fill empty seats",
                    "Reduce travel expenses",
                  ],
                  buttonText: "Publish Ride",
                  buttonClass: "btn-green",
                  image: img3,
                },
              ]
            : []),
        ]
      : []),

    // PASSENGER CARDS
    ...(showPassenger
      ? [
          {
            id: 2,
            theme: "green-theme",
            title: "Need a ride?",
            subtitle: "Find affordable travel",
            features: [
              "Thousands of routes",
              "Verified drivers",
              "Secure & easy booking",
            ],
            buttonText: "Find a Ride",
            buttonClass: "btn-green",
            image: img2,
          },
          ...(isLoggedIn
            ? [
                {
                  id: 4,
                  theme: "blue-theme",
                  title: "Book Your Seat",
                  subtitle: "Travel safely with trusted drivers",
                  features: [
                    "Instant ride booking",
                    "Comfortable journeys",
                    "Affordable shared travel",
                  ],
                  buttonText: "Book Now",
                  buttonClass: "btn-blue",
                  image: img4,
                },
              ]
            : []),
        ]
      : []),
  ];
};

const DetailedCards = () => {
  const router = useRouter();

  // getRole()/getToken() read from cookies, which aren't reliably available
  // during SSR. We read them after mount so cards start empty and populate
  // once we know the client-side auth state, avoiding a hydration mismatch.
  const [authState, setAuthState] = useState({ role: null, token: null });

  useEffect(() => {
    setAuthState({
      role: getRole(),
      token: getToken(),
    });
  }, []);

  const cards = buildCards(authState.role, authState.token);

  const handleNavigate = (buttonText) => {
    if (buttonText === "Offer a Ride" || buttonText === "Publish Ride") {
      router.push("/offer-ride");
    } else {
      router.push("/find-ride");
    }
  };

  return (
    <div className="detailed-container">
      {cards.map((card) => (
        <div key={card.id} className={`card ${card.theme}`}>
          <div className="card-content">
            <h2 className="card-title">{card.title}</h2>

            <p className="card-subtitle">{card.subtitle}</p>

            <ul className="features-list">
              {card.features.map((feature, index) => (
                <li key={index}>
                  <div className="check-icon"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`btn ${card.buttonClass}`}
              onClick={() => handleNavigate(card.buttonText)}
            >
              {card.buttonText}
            </button>
          </div>

          <Image src={card.image} alt="" className="card-image" />
        </div>
      ))}
    </div>
  );
};

export default DetailedCards;
