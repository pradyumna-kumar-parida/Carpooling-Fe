"use client";

import { useState } from "react";
import Head from "next/head";
import "../../styles/help-support.css";
import needHelp from "../../assets/images/help-img.jpg";
import driverVerify from "../../assets/images/verify-driver.png";
// MUI components used sparingly for interactive elements
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ChatIcon from "@mui/icons-material/Chat";
import Link from "next/link";

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = [
  {
    id: "booking",
    label: "Booking a Ride",
    icon: <AirlineSeatReclineNormalIcon />,
  },
  { id: "offering", label: "Offering a Ride", icon: <DirectionsCarIcon /> },
  { id: "payments", label: "Payments & Wallet", icon: <PaymentIcon /> },
  { id: "safety", label: "Safety & Trust", icon: <VerifiedUserIcon /> },
  { id: "cancellation", label: "Cancellations", icon: <CancelIcon /> },
  { id: "reviews", label: "Ratings & Reviews", icon: <StarIcon /> },
];

const faqs = {
  booking: [
    {
      q: "How do I search for a ride?",
      a: "Enter your departure city, destination, travel date, and number of passengers in the search bar on the homepage. You'll see a list of available rides sorted by departure time. Use filters to narrow results by price, number of stops, or driver preferences.",
    },
    {
      q: "What is instant booking?",
      a: "Some drivers enable Instant Booking, meaning your seat is confirmed immediately without waiting for driver approval. Look for the lightning bolt icon on a ride listing. Other rides require you to send a request, which the driver must accept.",
    },
    {
      q: "Can I book multiple seats at once?",
      a: "Yes. When searching, set the passenger count to how many seats you need. The system only shows rides with that many seats available. All seats in a single booking are confirmed or rejected together.",
    },
    {
      q: "What details do I see before booking?",
      a: "You can view the driver's verified profile, their rating and reviews from past passengers, the vehicle make and model, the full route with pick-up and drop-off points, price per seat, ride preferences (smoking, pets, music), and estimated travel time.",
    },
    {
      q: "How do I find the driver on the day of travel?",
      a: "After booking, you get the driver's phone number and can message them directly in the app. The pick-up point is shown on an in-app map. Arrive 5 minutes early and confirm with the driver before boarding.",
    },
  ],
  offering: [
    {
      q: "How do I post a ride?",
      a: "Click 'Offer a Ride' from the navigation. Enter your departure and destination cities, travel date and time, number of seats you're offering, and your price per seat. You can also set preferences such as whether you allow pets, smoking, or require only 2 passengers in the back row.",
    },
    {
      q: "How is the recommended price calculated?",
      a: "Our platform suggests a fair price based on distance, current fuel costs, and comparable rides on the same route. The price covers a share of your running costs — not a profit. You can set any price within the allowed range; going lower or at the suggested price tends to attract more bookings faster.",
    },
    {
      q: "Can I accept or decline booking requests?",
      a: "Yes. Unless you enable Instant Booking, each passenger request shows you their profile, rating, and a short introduction. You have 24 hours to accept or decline. If you don't respond within that window, the request expires automatically.",
    },
    {
      q: "What happens if I need to cancel my posted ride?",
      a: "Go to 'My Rides', select the ride, and tap 'Cancel Ride'. All confirmed passengers are notified immediately and receive a full refund. Frequent last-minute cancellations affect your driver rating and may limit your ability to post rides in future.",
    },
    {
      q: "When do I receive my earnings?",
      a: "Your earnings are held in escrow until the ride is completed. Once the trip is marked complete, funds are released to your Carpooling Wallet within 24 hours. You can withdraw to your bank account at any time — minimum withdrawal is ₹200.",
    },
  ],
  payments: [
    {
      q: "What payment methods are accepted?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), debit and credit cards (Visa, Mastercard, RuPay), and net banking. You can also pay from your Carpooling Wallet if you have a sufficient balance. Cash payments are not supported.",
    },
    {
      q: "Is my payment information stored securely?",
      a: "We do not store your full card or bank details on our servers. Payments are processed through a PCI-DSS compliant gateway (Razorpay). Your financial data is encrypted end-to-end and never shared with drivers.",
    },
    {
      q: "What is the Carpooling Wallet?",
      a: "The Wallet is an in-app balance you can top up and use for bookings, or receive earnings and refunds into. It makes repeat bookings faster and holds any refunds from cancellations. You can withdraw your wallet balance to a linked bank account at any time.",
    },
    {
      q: "How does the platform commission work?",
      a: "Carpooling charges a service fee of 15–20% on each transaction. This covers payment processing, platform maintenance, customer support, and the escrow service that protects both driver and passenger. The fee is shown transparently before you confirm any booking.",
    },
    {
      q: "I was charged but the booking failed. What now?",
      a: "If a payment is debited but the booking is not confirmed, the amount is automatically reversed to your original payment method within 5–7 business days. If it doesn't appear after 7 days, contact support with your transaction reference number.",
    },
  ],
  safety: [
    {
      q: "How are drivers verified?",
      a: "Drivers must complete profile verification before posting rides. This includes a mobile OTP, government-issued photo ID (Aadhaar, PAN, or Driving Licence), and optionally a vehicle RC check. Verified badges appear on profiles once all checks pass.",
    },
    {
      q: "What should I do if I feel unsafe during a ride?",
      a: "Use the SOS button in the trip screen to immediately share your live location with your emergency contacts and our safety team. You can also call the 24/7 helpline directly from the app. After the trip, report the incident through the Help Centre so we can investigate.",
    },
    {
      q: "Are ride details shared with anyone?",
      a: "Your trip details — departure, destination, and co-traveller names — are only visible to confirmed co-passengers and the driver for that ride. We never sell your data to third parties. You can read our full privacy policy in the footer.",
    },
    {
      q: "What is the community rating system?",
      a: "After every completed trip, both drivers and passengers rate each other out of 5 stars and can leave a written review. Ratings are cumulative and permanently public. Accounts that fall below a 3.0 average are reviewed and may be suspended.",
    },
    {
      q: "Can I block or report another user?",
      a: "Yes. From any user profile or trip, tap the three-dot menu and choose 'Block' or 'Report'. Blocking prevents that person from booking your rides or messaging you. Reports are reviewed by our trust and safety team within 48 hours.",
    },
  ],
  cancellation: [
    {
      q: "What is the cancellation policy for passengers?",
      a: "Cancel more than 24 hours before departure: full refund. Cancel between 2–24 hours before departure: 50% refund. Cancel less than 2 hours before departure or no-show: no refund. Refunds go to your Carpooling Wallet or original payment method within 5 days.",
    },
    {
      q: "What is the cancellation policy for drivers?",
      a: "Drivers can cancel any time before the ride departs. All affected passengers receive a full refund automatically. Repeated last-minute cancellations lead to reduced search ranking for your future rides and, after three instances in a month, a temporary posting restriction.",
    },
    {
      q: "The driver cancelled — what happens next?",
      a: "You'll receive an in-app notification and a full refund to your Wallet immediately. The app will also surface alternative rides on the same route and date to help you rebook quickly.",
    },
    {
      q: "Can I modify a booking instead of cancelling?",
      a: "Date or seat changes require cancelling your current booking and making a new one. You cannot transfer a booking to a different ride. If you cancel within the refund window, the normal policy applies to the original booking.",
    },
  ],
  reviews: [
    {
      q: "When can I leave a review?",
      a: "The review window opens as soon as the trip is marked complete and stays open for 14 days. After 14 days, the option closes. You can leave one review per trip.",
    },
    {
      q: "Can I edit or delete my review?",
      a: "Reviews can be edited within 48 hours of submission. After that they are permanent. We do not delete reviews unless they violate our community guidelines — for example, reviews containing personal attacks or false information.",
    },
    {
      q: "A review about me seems unfair. Can I dispute it?",
      a: "You can flag any review from your profile page. Our team reviews flagged content against our guidelines within 72 hours. Reviews that are false, discriminatory, or violate policy are removed. Factual negative reviews, even if you disagree with them, are not removed.",
    },
  ],
};

const contactOptions = [
  {
    icon: <ChatIcon style={{ fontSize: 32 }} />,
    title: "Live Chat",
    desc: "Talk to a support agent in real time.",
    detail: "Available Mon–Sat, 8 AM – 10 PM",
    cta: "Start Chat",
    href: "#chat",
  },
  {
    icon: <EmailIcon style={{ fontSize: 32 }} />,
    title: "Email Support",
    desc: "Send us a detailed message and we'll reply within 24 hours.",
    detail: "support@carpoolingindia.com",
    cta: "Send Email",
    href: "mailto:support@carpoolingindia.com",
  },
  {
    icon: <PhoneIcon style={{ fontSize: 32 }} />,
    title: "Phone Helpline",
    desc: "For urgent safety concerns, call our 24/7 helpline.",
    detail: "+91 1800-XXX-XXXX (Toll Free)",
    cta: "Call Now",
    href: "tel:+911800000000",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function HelpSupport() {
  const [activeCategory, setActiveCategory] = useState("booking");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const currentFaqs =
    searchResults !== null ? searchResults : faqs[activeCategory] || [];

  return (
    <>
      <Head>
        <title>Help &amp; Support — Carpooling India</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="help-page">
        {/* ── HERO ── */}
        <section className="help-hero">
          <div className="help-hero-inner">
            <p className="help-hero-eyebrow">Help Centre</p>
            <h1 className="help-hero-heading">
              How can we <span className="help-hero-accent">help you?</span>
            </h1>
            <p className="help-hero-sub">
              Search our guides or browse topics below — most answers are just a
              click away.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=70"
            alt="People travelling together in a car"
            className="help-hero-bg"
          />
        </section>

        {/* ── HOW IT WORKS BANNER ── */}
        <section className="help-how-section">
          <div className="help-container">
            <div className="help-how-grid">
              <div className="help-how-text">
                <p className="help-section-label">Before you ask</p>
                <h2 className="help-how-heading">New to Carpooling?</h2>
                <p className="help-how-desc">
                  Carpooling India is a peer-to-peer ride marketplace. Drivers
                  heading somewhere offer empty seats, passengers riding the
                  same route book them — splitting the fuel cost fairly. No
                  commercial taxis, no surge pricing.
                </p>
                <ul className="help-how-list">
                  <li>
                    <span className="help-dot" /> Search a route and pick a
                    verified driver
                  </li>
                  <li>
                    <span className="help-dot" /> Pay securely — funds held in
                    escrow until the trip is complete
                  </li>
                  <li>
                    <span className="help-dot" /> Travel, arrive, and rate each
                    other
                  </li>
                </ul>
              </div>
              <div className="help-how-image-wrap">
                <img
                  src={needHelp.src}
                  alt="Inside a carpooling vehicle"
                  className="help-how-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        <section className="help-faq-section">
          <div className="help-container">
            <div className="help-faq-layout">
              {/* Category sidebar */}
              <aside className="help-sidebar">
                <p className="help-section-label">Browse by topic</p>
                <nav className="help-cat-nav">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`help-cat-btn ${activeCategory === cat.id && !searchResults ? "help-cat-btn-active" : ""}`}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSearchResults(null);
                        setSearchQuery("");
                      }}
                    >
                      <span className="help-cat-icon">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Accordion panel */}
              <div className="help-faq-panel">
                {searchResults !== null && (
                  <p className="help-search-result-meta">
                    {searchResults.length === 0
                      ? "No results found. Try a different keyword or browse a topic from the left."
                      : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`}
                  </p>
                )}

                {searchResults === null && (
                  <h2 className="help-faq-heading">
                    {categories.find((c) => c.id === activeCategory)?.label}
                  </h2>
                )}

                <div className="help-accordion-list">
                  {currentFaqs.map((item, i) => (
                    <Accordion
                      key={i}
                      disableGutters
                      elevation={0}
                      className="help-accordion"
                      sx={{
                        "&:before": { display: "none" },
                        borderRadius: "10px !important",
                        mb: 1.5,
                        border: "1px solid #e5eaf2",
                        overflow: "hidden",
                        "&.Mui-expanded": {
                          border: "1px solid #1e40af",
                          boxShadow: "0 4px 16px rgba(30,64,175,0.10)",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ color: "#1e40af" }} />
                        }
                        sx={{
                          px: 3,
                          py: 1.5,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.97rem",
                          color: "#111",
                          backgroundColor: "#fff",
                          "&.Mui-expanded": { backgroundColor: "#f0f4ff" },
                        }}
                      >
                        {item.q}
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          px: 3,
                          pb: 2.5,
                          pt: 0,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.92rem",
                          color: "#555",
                          lineHeight: 1.75,
                          backgroundColor: "#fff",
                        }}
                      >
                        {item.a}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SAFETY HIGHLIGHT ── */}
        <section className="help-safety-section">
          <div className="help-container">
            <div className="help-safety-grid">
              <div className="help-safety-image-wrap">
                <img
                  src={driverVerify.src}
                  alt="Driver showing verified ID badge"
                  className="help-safety-image"
                />
                <div className="help-safety-badge">
                  <VerifiedUserIcon
                    style={{ color: "#1e40af", fontSize: 22 }}
                  />
                  <span>ID-Verified Driver</span>
                </div>
              </div>
              <div className="help-safety-text">
                <p className="help-section-label">Your safety, always</p>
                <h2 className="help-safety-heading">
                  Built for trust on every journey
                </h2>
                <p className="help-safety-desc">
                  Every driver completes government ID verification before
                  posting a single ride. Passenger identities are confirmed via
                  mobile OTP. Ratings are permanent, payment is handled in
                  secure escrow, and a 24/7 SOS button is one tap away
                  throughout your trip.
                </p>
                <div className="help-safety-cols">
                  <div className="help-safety-item">
                    <strong>Govt ID Check</strong>
                    <p>
                      Aadhaar, PAN, or Driving Licence verified before first
                      ride.
                    </p>
                  </div>
                  <div className="help-safety-item">
                    <strong>Secure Escrow</strong>
                    <p>
                      Your payment is only released to the driver after you
                      arrive safely.
                    </p>
                  </div>
                  <div className="help-safety-item">
                    <strong>SOS Button</strong>
                    <p>
                      Shares your live location with emergency contacts
                      instantly.
                    </p>
                  </div>
                  <div className="help-safety-item">
                    <strong>Permanent Ratings</strong>
                    <p>
                      Mutual reviews after every trip keep the community
                      accountable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="help-contact-section">
          <div className="help-container">
            <p className="help-section-label" style={{ textAlign: "center" }}>
              Still need help?
            </p>
            <h2 className="help-contact-heading">Reach our support team</h2>
            <p className="help-contact-sub">
              Can't find the answer above? We're here for you — pick the channel
              that works best.
            </p>
            <div className="help-contact-grid">
              {contactOptions.map((opt) => (
                <div className="help-contact-card" key={opt.title}>
                  <div className="help-contact-icon-wrap">{opt.icon}</div>
                  <h3 className="help-contact-card-title">{opt.title}</h3>
                  <p className="help-contact-card-desc">{opt.desc}</p>
                  <p className="help-contact-card-detail">{opt.detail}</p>
                  <Link href={opt.href} className="help-contact-cta">
                    {opt.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
