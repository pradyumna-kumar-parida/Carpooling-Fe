"use client";

import { Box, Container, Chip } from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import "../../styles/privacy-policy.css";

const sections = [
  {
    id: "01",
    title: "Information we collect",
    body: [
      "When you create an account, we collect your name, mobile number, email address and profile photo so other riders and drivers know who they're travelling with.",
      "To keep the community safe, drivers go through ID and vehicle verification (driving licence, RC, government ID). This data is used only for trust and safety checks.",
      "We collect ride details you publish or book — pickup and drop locations, dates, seats and price — and your live location while a ride is in progress, so passengers and drivers can find each other.",
      "Payment information is processed by our payment partners. We store transaction references, not your full card or bank details.",
    ],
  },
  {
    id: "02",
    title: "How we use your information",
    body: [
      "To match drivers and passengers travelling the same route, confirm bookings, and send trip reminders by SMS, push notification or email.",
      "To run ratings and reviews after a completed ride, building the trust profile that helps everyone choose who to travel with.",
      "To detect fraud, fake profiles and policy violations, and to keep the marketplace fair for genuine drivers and passengers.",
      "To improve ride matching, pricing suggestions and search relevance over time.",
    ],
  },
  {
    id: "03",
    title: "Sharing with other people and partners",
    body: [
      "Once a booking is confirmed, the driver and passenger can see each other's name, photo, phone number and rating — this is what makes the ride possible.",
      "We share data with payment gateways, mapping providers and SMS/email partners only to the extent needed to process payments, show routes and deliver notifications.",
      "We never sell your personal data to advertisers, and we don't share your ID documents with other members.",
    ],
  },
  {
    id: "04",
    title: "Location and navigation data",
    body: [
      "Pickup, drop and en-route location data is used to display the ride on the map, calculate ETAs, and power the in-app SOS feature during an active trip.",
      "You can turn off location access in your device settings, but this will limit live tracking and the ability to publish or search rides accurately.",
    ],
  },
  {
    id: "05",
    title: "Data retention",
    body: [
      "Ride, booking and payment records are kept for as long as needed for accounting, dispute resolution and legal requirements, generally up to 7 years.",
      "ID verification documents are stored securely and deleted once they're no longer required for safety checks or fraud prevention.",
      "You can request deletion of your account at any time; some data may be retained where the law requires it.",
    ],
  },
  {
    id: "06",
    title: "Your choices and rights",
    body: [
      "You can review and update your profile, vehicle details and notification preferences from your account settings at any time.",
      "You can request a copy of the personal data we hold about you, ask us to correct it, or ask us to delete your account.",
      "You can opt out of marketing messages while still receiving essential trip and safety notifications.",
    ],
  },
  {
    id: "07",
    title: "Keeping your data secure",
    body: [
      "Passwords are stored using industry-standard hashing, and all traffic between your device and our servers is encrypted.",
      "Payments are handled through PCI-compliant gateways — we never see or store your full card details.",
      "Access to ID verification data is restricted to a small trust-and-safety team and logged for audit purposes.",
    ],
  },
  {
    id: "08",
    title: "Children's privacy",
    body: [
      "Carpooling is intended for users 18 years and older. We don't knowingly collect data from anyone below this age, and accounts found to violate this are removed.",
    ],
  },
  {
    id: "09",
    title: "Changes to this policy",
    body: [
      "We may update this policy as the platform evolves. Material changes will be notified in-app or by email before they take effect.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="page">
      <section className="hero">
        <Container maxWidth="md">
          <Chip
            icon={
              <VerifiedUserOutlinedIcon
                sx={{ color: "var(--custom-one) !important" }}
              />
            }
            label="Trust & safety"
            className="heroChip"
          />
          <h1 className="heroTitle">Privacy Policy</h1>
          <p className="heroSubtitle">
            How Carpooling collects, uses and protects your information —
            written in plain language, for drivers and passengers alike.
          </p>
          <p className="heroMeta">Last updated: June 2026</p>
        </Container>
      </section>

      <Container maxWidth="md" className="content">
        <p className="intro">
          Carpooling connects drivers with empty seats to passengers heading the
          same way. To make that possible — and safe — we need to collect a
          limited amount of personal information. This page explains exactly
          what we collect, why, and the choices you have.
        </p>

        <nav className="toc" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#section-${s.id}`} className="tocLink">
              <span className="tocIndex">{s.id}</span>
              {s.title}
            </a>
          ))}
        </nav>

        <div className="sectionList">
          {sections.map((s) => (
            <article key={s.id} id={`section-${s.id}`} className="card">
              <div className="cardHead">
                <span className="cardIndex">{s.id}</span>
                <h2 className="cardTitle">{s.title}</h2>
              </div>
              <div className="cardBody">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <Box className="contactBox">
          <h2 className="contactTitle">Questions about your data?</h2>
          <p className="contactText">
            Reach our trust &amp; safety team and we'll respond within 48 hours.
          </p>
          <a href="mailto:privacy@carpooling.in" className="contactBtn">
            Contact privacy team
          </a>
        </Box>
      </Container>
    </main>
  );
}
