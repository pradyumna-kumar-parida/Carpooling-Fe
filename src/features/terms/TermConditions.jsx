"use client";

import { useState } from "react";
import Link from "next/link";
import "../../styles/term-condition.css";
import { IoDocumentTextOutline } from "react-icons/io5";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Carpooling India platform — whether through our website or mobile application — you confirm that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.

These terms apply to all users of the platform including passengers, drivers, and visitors. Carpooling India reserves the right to update or modify these terms at any time. Continued use of the platform after changes constitutes your acceptance of the revised terms.`,
  },
  {
    id: "platform",
    title: "2. Nature of the Platform",
    content: `Carpooling India operates as a peer-to-peer ride-sharing marketplace. We connect drivers who have empty seats in their private vehicles with passengers travelling along the same route. This is a cost-sharing platform — not a commercial taxi or transportation service.

Carpooling India does not provide transportation services directly. We are a technology intermediary. Drivers and passengers contract independently with each other. Carpooling India is not a party to any agreement between drivers and passengers and accepts no liability for the performance of either party.`,
  },
  {
    id: "eligibility",
    title: "3. Eligibility & Registration",
    content: `To use Carpooling India, you must:

• Be at least 18 years of age.
• Possess a valid government-issued photo ID.
• Provide accurate, current, and complete information during registration.
• Maintain the security of your account credentials and not share them with third parties.

Drivers must additionally hold a valid driving licence and vehicle registration documents. We reserve the right to suspend or terminate accounts where information is found to be inaccurate or fraudulent.`,
  },
  {
    id: "rides",
    title: "4. Ride Posting & Booking",
    content: `Drivers are solely responsible for the accuracy of ride details they publish including route, departure time, available seats, and price per seat. Drivers must not post rides they do not intend to complete.

Passengers agree to be present at the agreed pick-up point at the scheduled time. Late arrivals may result in the driver departing without the passenger, with no refund entitlement.

Carpooling India uses an escrow mechanism to hold passenger payments until the trip is marked complete. Neither party may attempt to conduct transactions outside the platform.`,
  },
  {
    id: "pricing",
    title: "5. Pricing & Platform Commission",
    content: `Drivers set their own price per seat within the range recommended by Carpooling India. The platform charges a service commission of 15–20% on each confirmed booking. This commission is deducted automatically before driver earnings are disbursed.

All prices displayed to passengers are inclusive of the platform fee. Carpooling India reserves the right to revise commission rates with prior notice to registered users. Prices are not negotiable outside the platform.`,
  },
  {
    id: "payments",
    title: "6. Payments & Refunds",
    content: `All payments are processed securely through Razorpay. Accepted methods include UPI, credit/debit cards, net banking, and digital wallets. Carpooling India does not store card or bank account details on its servers.

Refund eligibility:
• Full refund if cancelled more than 24 hours before departure.
• 50% refund if cancelled between 2–24 hours before departure.
• No refund for cancellations less than 2 hours before departure.
• Full refund if the driver cancels for any reason.

Refunds are processed within 5–7 business days to the original payment method.`,
  },
  {
    id: "conduct",
    title: "7. User Conduct",
    content: `All users agree to treat fellow travellers with respect and dignity. The following behaviour is strictly prohibited on the platform:

• Harassment, discrimination, or abusive language directed at any user.
• Sharing inaccurate ride information or engaging in fraudulent bookings.
• Using the platform for commercial transportation or taxi services.
• Carrying prohibited goods or substances during a shared ride.
• Attempting to conduct payments outside the Carpooling India platform.

Violations may result in immediate account suspension and, where applicable, reporting to law enforcement authorities.`,
  },
  {
    id: "safety",
    title: "8. Safety & Verification",
    content: `Carpooling India implements a multi-layer trust and safety system including government ID verification, driving licence checks, vehicle document validation, and a community ratings and review system.

However, Carpooling India cannot guarantee the conduct of any user. Passengers and drivers use the platform at their own discretion. We strongly recommend:

• Reviewing driver/passenger profiles and ratings before confirming a ride.
• Sharing your trip details with a trusted contact.
• Using the in-app SOS feature in case of emergency, which alerts our safety team and shares your live location.

Carpooling India reserves the right to remove any user whose behaviour compromises platform safety.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, Carpooling India, its directors, employees, and affiliates shall not be liable for:

• Any indirect, incidental, or consequential damages arising from use of the platform.
• Loss or damage to personal property during a shared ride.
• Injuries sustained during a trip facilitated through the platform.
• Delays, cancellations, or changes to ride details made by drivers.

The total liability of Carpooling India in connection with any claim shall not exceed the amount paid by the user for the specific booking giving rise to the claim.`,
  },
  {
    id: "privacy",
    title: "10. Privacy & Data Protection",
    content: `Your personal data is collected and processed in accordance with our Privacy Policy. By using the platform, you consent to the collection, storage, and use of your data as described therein.

We implement industry-standard encryption for payment data and sensitive personal information. We do not sell your personal data to third parties. Data may be shared with law enforcement agencies where required by law.

You have the right to request access to, correction of, or deletion of your personal data at any time by contacting our support team.`,
  },
  {
    id: "ip",
    title: "11. Intellectual Property",
    content: `All content on the Carpooling India platform — including but not limited to the logo, design, text, graphics, software, and code — is the intellectual property of Carpooling India or its licensors and is protected under applicable copyright and trademark laws.

You may not reproduce, distribute, modify, or create derivative works from any platform content without prior written consent from Carpooling India. User-generated content (reviews, profile information) remains the property of the respective user but grants Carpooling India a non-exclusive licence to display such content on the platform.`,
  },
  {
    id: "termination",
    title: "12. Account Termination",
    content: `Carpooling India reserves the right to suspend or permanently terminate any account at its sole discretion, with or without notice, for reasons including but not limited to:

• Breach of these Terms and Conditions.
• Fraudulent activity or misrepresentation.
• Conduct that endangers the safety of other users.
• Extended periods of inactivity.

Users may also delete their own account at any time via Settings. Pending transactions will be settled before account closure.`,
  },
  {
    id: "governing",
    title: "13. Governing Law & Disputes",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Bhubaneswar, Odisha, India.

We encourage users to first attempt resolution through our in-platform dispute resolution mechanism. Unresolved disputes may be escalated to our support team at legal@carpoolingindia.com before formal legal proceedings are initiated.`,
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: `If you have any questions, concerns, or requests regarding these Terms and Conditions, you may reach us at:

Carpooling India Pvt. Ltd.
Email: legal@carpoolingindia.com
Phone: 1800-123-4567
Support Hours: Monday – Saturday, 9 AM – 8 PM IST

For general support queries, please visit our Help & Support page.`,
  },
];

export default function TermsCondition() {
  const [activeId, setActiveId] = useState("acceptance");

  return (
    <div className="terms-condition-root">
      {/* ── Hero ── */}
      <div className="terms-condition-hero">
        <div className="terms-condition-hero-overlay" />
        <div className="terms-condition-hero-content">
          <span className="terms-condition-eyebrow">Legal</span>
          <h1 className="terms-condition-hero-title">
            Terms &amp;{" "}
            <span className="terms-condition-hero-accent">Conditions</span>
          </h1>
          <p className="terms-condition-hero-sub">
            Please read these terms carefully before using the Carpooling India
            platform.
          </p>
          <div className="terms-condition-hero-meta">
            <span className="terms-condition-meta-tag">
              Effective: 1 January 2025
            </span>
            <span className="terms-condition-meta-dot" />
            <span className="terms-condition-meta-tag">
              Last updated: 25 June 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="terms-condition-wrapper">
        {/* ── Sidebar TOC ── */}

        {/* ── Content ── */}
        <main className="terms-condition-content">
          <span className="terms-condition-intro-banner">
            <span className="terms-condition-intro-icon">
              <IoDocumentTextOutline size={20} color="#1e40af" />
            </span>
            <p className="terms-condition-intro-text">
              By creating an account or using any feature of the Carpooling
              India platform, you confirm that you have read, understood, and
              accepted these Terms and Conditions. These terms are designed to
              ensure a safe, secure, and reliable experience for all members of
              our community. If you do not agree with any part of these terms,
              please discontinue use of the platform and its services.
            </p>
          </span>

          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="terms-condition-section"
              onMouseEnter={() => setActiveId(s.id)}
            >
              <h2 className="terms-condition-section-title">{s.title}</h2>
              <div className="terms-condition-divider" />
              {s.content.split("\n\n").map((para, i) => (
                <p key={i} className="terms-condition-para">
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* ── Acceptance box ── */}
          <div className="terms-condition-accept-box">
            <h3 className="terms-condition-accept-title">
              Thank You for Choosing Carpooling India
            </h3>

            <p className="terms-condition-accept-text">
              These Terms and Conditions help ensure a safe, reliable, and
              respectful experience for every member of our community. By
              continuing to use Carpooling India, you agree to follow these
              terms and contribute to a trusted ride-sharing platform.
            </p>

            <div className="terms-condition-accept-links">
              <Link href="/help-support" className="terms-condition-link-btn">
                Visit Help Centre
              </Link>

              <Link
                href="/privacy-policy"
                className="terms-condition-link-outline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
