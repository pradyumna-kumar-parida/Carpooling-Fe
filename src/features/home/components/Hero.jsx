"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/lib/cookie";

const slides = [
  {
    id: 1,
    role: "passenger",
    title: "Travel Smarter",
    subtitle: "Share the journey with every ride.",
    description:
      "Connect with verified drivers and travelers for comfortable, affordable trips across the city.",
    buttonText: "Find a Ride",
    buttonPath: "/find-ride",
  },
  {
    id: 2,
    role: "driver",
    title: "Drive purpose",
    subtitle: "Earn from empty seats.",
    description:
      "Publish your ride, choose your price, and welcome passengers on every route.",
    buttonText: "Offer a Ride",
    buttonPath: "/offer-ride",
  },
  {
    id: 3,
    role: "passenger",
    title: "Safe journeys",
    subtitle: "Verified drivers, real reviews.",
    description:
      "Book confidently with trusted profiles, secure payments and smooth pickup experiences.",
    buttonText: "Book Your Seat",
    buttonPath: "/find-ride",
  },
  {
    id: 4,
    role: "driver",
    title: "Flexible routes",
    subtitle: "Choose when and where you go.",
    description:
      "Search popular trips, compare prices, and ride together for smarter commute savings.",
    buttonText: "Start Your Trip",
    buttonPath: "/offer-ride",
  },
];

const getSlidesForRole = (role, token) => {
  const isLoggedIn = Boolean(token);
  if (!isLoggedIn) return slides;

  const filtered = slides.filter((slide) => slide.role === role);
  // Fallback: logged in but role is missing/unrecognized — show everything
  // rather than rendering a blank hero.
  return filtered.length > 0 ? filtered : slides;
};

const Hero = () => {
  const [authState, setAuthState] = useState({ role: null, token: null });
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // getRole()/getToken() read from cookies, which aren't reliably available
  // during SSR, so we read them after mount to avoid a hydration mismatch.
  useEffect(() => {
    setAuthState({
      role: getRole(),
      token: getToken(),
    });
  }, []);

  const visibleSlides = getSlidesForRole(authState.role, authState.token);

  // Reset to the first slide whenever the visible slide set changes (e.g.
  // once auth state loads after mount) so we never point past the end.
  useEffect(() => {
    setCurrentSlide(0);
  }, [visibleSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % visibleSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [visibleSlides.length]);

  const slide = visibleSlides[currentSlide];

  return (
    <section className="hero">
      <div className="hero-content">
        <div key={slide.id} className="hero-text hero-slide">
          <h1 className="hero-head-title">
            {slide.title}
            <br />
            <span>{slide.subtitle}</span>
          </h1>

          <p>{slide.description}</p>

          <button
            className="hero-cta"
            onClick={() => router.push(slide.buttonPath)}
          >
            {slide.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;