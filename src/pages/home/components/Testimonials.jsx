"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import testimonialImg1 from "../../../assets/images/testimonial-Img1.jpg";
import testimonialImg2 from "../../../assets/images/testimonial-Img2.avif";
import testimonialImg3 from "../../../assets/images/testimonial-Img3.jpg";
import quotation from "../../../assets/images/quotation.png";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 600) {
        setCardsPerView(1);
      } else if (window.innerWidth < 900) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCards();
    window.addEventListener("resize", updateCards);

    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // DATA
  const testimonials = [
    {
      id: 1,
      text: "Very affordable and comfortable ride! The driver was polite and the car was clean.",
      name: "Rahul",
      location: "Delhi",
      avatar: testimonialImg1,
      rating: 5,
    },
    {
      id: 2,
      text: "Found a great ride from Mumbai to Pune. Saved money and had a pleasant journey.",
      name: "Priya",
      location: "Mumbai",
      avatar: testimonialImg2,
      rating: 5,
    },
    {
      id: 3,
      text: "Offering rides is easy and I've met amazing people while traveling.",
      name: "Amit",
      location: "Bangalore",
      avatar: testimonialImg3,
      rating: 5,
    },
    {
      id: 4,
      text: "Smooth booking process and very reliable service!",
      name: "Ankit",
      location: "Hyderabad",
      avatar: testimonialImg1,
      rating: 4,
    },
    {
      id: 5,
      text: "Affordable rides and great experience overall.",
      name: "Sneha",
      location: "Chennai",
      avatar: testimonialImg2,
      rating: 5,
    },
    {
      id: 6,
      text: "Loved the journey and the people I met!",
      name: "Karan",
      location: "Kolkata",
      avatar: testimonialImg3,
      rating: 5,
    },
  ];

  const totalSlides = Math.ceil(testimonials.length / cardsPerView);

  // NAVIGATION
  const handleScroll = (direction) => {
    if (direction === "next") {
      setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
    } else {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  const renderStars = (rating) => "★".repeat(rating);

  return (
    <div className="testimonials-section">
      {/* TITLE */}
      <h2>What Our Users Say</h2>

      <div className="testimonials-wrapper">
        {/* LEFT BUTTON */}
        <button
          className="arrow-btn"
          onClick={() => handleScroll("prev")}
          disabled={currentIndex === 0}
        >
          <FaAngleDoubleLeft />
        </button>

        {/* SLIDER */}
        <div className="testimonials-grid-wrapper">
          <div
            className="testimonials-grid"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div className="slide" key={slideIndex}>
                {testimonials
                  .slice(
                    slideIndex * cardsPerView,
                    slideIndex * cardsPerView + cardsPerView,
                  )
                  .map((item) => (
                    <div key={item.id} className="testimonial-card">
                      {/* QUOTE ICON */}
                      <div className="quote-icon">
                        <Image
                          src={quotation}
                          alt="quote"
                          loading="lazy"
                          width={15}
                        />
                      </div>

                      {/* TEXT */}
                      <p className="testimonial-text">{item.text}</p>

                      {/* USER */}
                      <div className="reviewer">
                        <div className="avatar-circle">
                          <div className="profile-img">
                            <Image
                              src={item.avatar}
                              alt={item.name}
                             
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                        </div>

                        <div className="reviewer-info">
                          <div className="name">
                            {item.name}, <span>{item.location}</span>
                          </div>
                          <div className="stars">
                            {renderStars(item.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <button
          className="arrow-btn"
          onClick={() => handleScroll("next")}
          disabled={currentIndex === totalSlides - 1}
        >
          <FaAngleDoubleRight />
        </button>
      </div>

      {/* DOTS */}
      <div className="dots">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
