"use client";
import React, { useState } from "react";
import profile1 from "../../../../assets/images/offer-ride-profile-1.jpg";
import profile2 from "../../../../assets/images/offer-ride-profile-2.jpg";
import profile3 from "../../../../assets/images/offer-ride-profile-3.jpg";
import Image from "next/image";
const PRTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "5 years of using Carpooling, dozens of journeys, as many meetings and exchanges, not a single disappointment. THANK YOU!",
      author: "Simon",
      avatar: profile1,
    },
    {
      id: 2,
      text: "Great platform for sharing rides! I've saved so much money and met wonderful people along the way.",
      author: "Maria",
      avatar: profile2,
    },
    {
      id: 3,
      text: "Easy to use, reliable drivers, and fantastic support team. Highly recommended for long distance travel!",
      author: "Raj",
      avatar: profile3,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="pr-testimonials">
      <div className="pr-testimonials-container">
        <button
          type="button"
          className="pr-testimonial-arrow pr-testimonial-prev"
          onClick={prevTestimonial}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="pr-testimonial-content">
          <div key={currentIndex} className="pr-testimonial-card">
            <div className="pr-testimonial-avatars">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`pr-testimonial-avatar ${index === currentIndex ? "active" : ""}`}
                >
                  <Image src={testimonial.avatar} alt={testimonial.author} />
                </div>
              ))}
            </div>

            <p className="pr-testimonial-text">
              {testimonials[currentIndex].text}
            </p>

            <p className="pr-testimonial-author">
              {testimonials[currentIndex].author}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="pr-testimonial-arrow pr-testimonial-next"
          onClick={nextTestimonial}
        >
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

      <div className="pr-testimonial-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`pr-testimonial-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default PRTestimonials;
