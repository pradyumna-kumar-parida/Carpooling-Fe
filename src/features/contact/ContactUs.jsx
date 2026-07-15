"use client";

import { useState } from "react";
import Link from "next/link";
import "../../styles/contact.css";
import { BsChatDots } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { FaCarRear } from "react-icons/fa6";
import { LiaWalletSolid } from "react-icons/lia";
import { FaUserAstronaut } from "react-icons/fa6";
import { AiOutlineSafety } from "react-icons/ai";
import { MdCancelPresentation } from "react-icons/md";
import { BsChatQuote } from "react-icons/bs";
import { MdCheckCircleOutline } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import { MdSupportAgent } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";

const reasons = [
  { icon: <FaCarRear />, label: "Ride Issue" },
  { icon: <LiaWalletSolid size={17} />, label: "Payment / Refund" },
  { icon: <FaUserAstronaut />, label: "Account Help" },
  { icon: <AiOutlineSafety size={15} />, label: "Safety Concern" },
  { icon: <MdCancelPresentation size={15} />, label: "Cancellation" },
  { icon: <BsChatQuote size={14} />, label: "General Query" },
];

const officeHours = [
  { day: "Monday – Friday", time: "9:00 AM – 9:00 PM" },
  { day: "Saturday", time: "9:00 AM – 6:00 PM" },
  { day: "Sunday", time: "10:00 AM – 4:00 PM" },
];

const channels = [
  {
    icon: <BsChatDots />,
    title: "Live Chat",
    desc: "Instant replies from our team",
    tag: "2 min wait",
    tagColor: "green",
    action: "Start Chat ",
    href: "#chat",
  },
  {
    icon: <MdOutlineMail />,
    title: "Email Us",
    desc: "We respond within 24 hours",
    tag: "24 hr response",
    tagColor: "blue",
    action: "support@carpoolingindia.com",
    href: "mailto:support@carpoolingindia.com",
  },
  {
    icon: <FiPhoneCall />,
    title: "Call Us",
    desc: "Talk to a real person",
    tag: "Mon–Sat 9AM–8PM",
    tagColor: "orange",
    action: "1800-123-4567",
    href: "tel:18001234567",
  },
];

export default function ContactUs() {
  const [selectedReason, setSelectedReason] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !selectedReason) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-root">
      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          <span className="contact-eyebrow">We're here for your journey</span>
          <h1 className="contact-hero-title">
            Hit a bump on the road?
            <br />
            <span className="contact-hero-accent">We've got you covered.</span>
          </h1>
          <p className="contact-hero-sub">
            Whether it's a ride issue, payment query, or safety concern — our
            support team is ready to help you get back on track.
          </p>

          {/* quick stats */}
          <div className="contact-hero-stats">
            <div className="contact-hero-stat">
              <strong>2 min</strong>
              <span>Live chat response</span>
            </div>
            <div className="contact-hero-stat-divider" />
            <div className="contact-hero-stat">
              <strong>24 hrs</strong>
              <span>Email turnaround</span>
            </div>
            <div className="contact-hero-stat-divider" />
            <div className="contact-hero-stat">
              <strong>7 days</strong>
              <span>Support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Channel cards ── */}
      <div className="contact-channels-bar">
        <div className="contact-wrapper">
          <div className="contact-channels-grid">
            {channels.map((c) => (
              <a key={c.title} href={c.href} className="contact-channel-card">
                <div className="contact-channel-icon">{c.icon}</div>
                <div className="contact-channel-body">
                  <div className="contact-channel-top">
                    <span className="contact-channel-title">{c.title}</span>
                    <span
                      className={`contact-channel-tag contact-channel-tag-${c.tagColor}`}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <p className="contact-channel-desc">{c.desc}</p>
                  <span className="contact-channel-action">{c.action}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="contact-main">
        <div className="contact-wrapper">
          <div className="contact-grid">
            {/* ── Left: form ── */}
            <div className="contact-form-col">
              <span className="contact-section-eyebrow">Send a Message</span>
              <h2 className="contact-section-title">
                Tell us what happened on your trip
              </h2>
              <p className="contact-section-sub">
                Give us as much detail as you can. The more we know, the faster
                we can resolve it.
              </p>

              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">
                    <MdCheckCircleOutline size={33} />
                  </div>
                  <h3 className="contact-success-title">Message received!</h3>
                  <p className="contact-success-text">
                    Thanks <strong>{form.name}</strong>! We've received your
                    query about <em>{selectedReason}</em> and will get back to
                    you at <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button
                    className="contact-success-btn"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", message: "" });
                      setSelectedReason("");
                    }}
                  >
                    Submit another query
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {/* reason selector */}
                  <div className="contact-field-group">
                    <label className="contact-label">
                      What's your query about?
                    </label>
                    <div className="contact-reasons">
                      {reasons.map((r) => (
                        <button
                          type="button"
                          key={r.label}
                          className={`contact-reason-btn ${selectedReason === r.label ? "contact-reason-active" : ""}`}
                          onClick={() => setSelectedReason(r.label)}
                        >
                          <span className="suggest-icons">{r.icon}</span>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* name + email */}
                  <div className="contact-row">
                    <div className="contact-field-group">
                      <label className="contact-label" htmlFor="name">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="contact-input"
                        placeholder="Rahul Sharma"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="contact-field-group">
                      <label className="contact-label" htmlFor="email">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="contact-input"
                        placeholder="rahul@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* phone */}
                  <div className="contact-field-group">
                    <label className="contact-label" htmlFor="phone">
                      Phone Number{" "}
                      <span className="contact-optional">(optional)</span>
                    </label>
                    <div className="contact-phone-wrap">
                      <span className="contact-phone-prefix">🇮🇳 +91</span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="contact-input contact-input-phone"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* message */}
                  <div className="contact-field-group">
                    <label className="contact-label" htmlFor="message">
                      Describe your issue
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="contact-textarea"
                      placeholder="E.g. My driver cancelled 30 minutes before departure and I haven't received a refund yet..."
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                    <span className="contact-char-count">
                      {form.message.length} / 500
                    </span>
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    <TbSend size={20} />
                    Send Message
                  </button>

                  <p className="contact-form-note">
                    By submitting, you agree to our{" "}
                    <Link
                      href="/term-conditions"
                      className="contact-inline-link"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="contact-inline-link"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>

            {/* ── Right: info panel ── */}
            <div className="contact-info-col">
              {/* office hours */}
              <div className="contact-info-card">
                <div className="contact-info-card-header">
                  <MdSupportAgent size={25} />

                  <span className="contact-info-card-title">Support Hours</span>
                </div>
                <div className="contact-hours-list">
                  {officeHours.map((h) => (
                    <div key={h.day} className="contact-hours-row">
                      <span className="contact-hours-day">{h.day}</span>
                      <span className="contact-hours-time">{h.time}</span>
                    </div>
                  ))}
                </div>
                <div className="contact-sos-strip">
                  <FiAlertTriangle size={15} />

                  <span>Emergency SOS available 24/7 in the app</span>
                </div>
              </div>

              {/* route info box */}
              <div className="contact-info-card contact-info-card-route">
                <div className="contact-info-card-header">
                  <HiOutlineLocationMarker size={20} />

                  <span className="contact-info-card-title">Our Office</span>
                </div>
                <div className="contact-address-block">
                  <p className="contact-address-line">
                    Carpooling India Pvt. Ltd.
                  </p>
                  <p className="contact-address-line">
                    Plot No. 24, Infocity Area
                  </p>
                  <p className="contact-address-line">
                    Bhubaneswar, Odisha – 751024
                  </p>
                  <p className="contact-address-line">India</p>
                </div>
                {/* mini road visual */}
                <div className="contact-mini-road">
                  <div className="contact-mini-road-track">
                    <div className="contact-mini-road-pin contact-mini-road-pin-start">
                      A
                    </div>
                    <div className="contact-mini-road-dashes">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="contact-mini-road-pin contact-mini-road-pin-end">
                      B
                    </div>
                  </div>
                  <p className="contact-mini-road-label">Bhubaneswar HQ</p>
                </div>
              </div>

              {/* help centre nudge */}
              <div className="contact-info-card contact-info-card-help">
                <p className="contact-help-nudge-text">
                  Most queries are answered instantly in our
                </p>
                <Link href="/help-support" className="contact-help-nudge-link">
                  Help &amp; Support Centre
                </Link>
                <p className="contact-help-nudge-topics">
                  Bookings · Refunds · Driver guide · Cancellations · Safety
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom journey banner ── */}
      <div className="contact-bottom-banner">
        <div className="contact-bottom-content">
          <h2 className="contact-bottom-title">Back on the road in no time.</h2>
          <p className="contact-bottom-sub">
            Our team resolves 95% of queries within the same day.
          </p>
          <div className="contact-bottom-btns">
            <Link href="/find-ride" className="contact-bottom-btn-primary">
              Find a Ride
            </Link>
            <Link href="/offer-ride" className="contact-bottom-btn-outline">
              Offer a Ride
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
