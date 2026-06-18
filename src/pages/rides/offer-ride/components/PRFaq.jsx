"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
const PRFaq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I set the passenger contribution for my ride?",
      answer:
        "We recommend a contribution per passenger on your rides (these most likely to get your seats filled) but can still be adjusted within a margin of our recommendation. The contribution is calculated based on the distance and the number of passengers.",
    },
    {
      id: 2,
      question: "When do I get my money?",
      answer:
        "We send you your money within 48 hours after the ride if you travelled as planned. You'll get your money by 5 weekdays (not counting weekends and holidays) after we send it.",
    },
    {
      id: 3,
      question: "What should I do if there's an error with my ride?",
      answer:
        "You should edit your ride as soon as you spot the error. If you can't edit your ride because passengers have already booked, contact them to inform them of the changes.",
    },
    {
      id: 4,
      question: "How do I cancel a carpool ride as a driver or a rider?",
      answer:
        "It only takes a minute to cancel a listed ride. However, if a driver cannot fulfill a ride that has been booked by passengers, it is crucial for the driver to inform passengers in a timely manner to allow the passenger time to adjust their plans. Before cancelling we advise drivers to let passengers know.",
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="pr-faq">
      <h2 className="pr-faq-title">
        Everything you need as a driver, in our Help Centre
      </h2>

      <div className="pr-faq-grid">
        {faqs.map((faq) => (
          <div key={faq.id} className="pr-faq-item">
            <button
              className={`pr-faq-question ${openFaq === faq.id ? "active" : ""}`}
              onClick={() => toggleFaq(faq.id)}
            >
              <span>{faq.question}</span>
              <span
                className={`pr-faq-icon ${openFaq === faq.id ? "rotated" : ""}`}
              >
                <FaAngleDown />
              </span>
            </button>

            {openFaq === faq.id && (
              <div className="pr-faq-answer">
                <p>{faq.answer}</p>
                <Link href="#" className="pr-faq-link">
                  Read more →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pr-faq-actions">
        <button className="pr-btn pr-btn-secondary">See more answers</button>
      </div>
    </section>
  );
};

export default PRFaq;
