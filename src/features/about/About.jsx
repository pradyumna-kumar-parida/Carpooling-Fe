import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import "../../styles/about.css";
import rideImg from "../../assets/images/about-ride-img.jpg";
import safeDrive from "../../assets/images/safeDrive.jpg";
import Link from "next/link";
/* ─── Data ─────────────────────────────────────────────── */

const stats = [
  { value: "27M+", label: "Registered Members" },
  { value: "600K+", label: "Daily Rides" },
  { value: "22", label: "Countries Active" },
  { value: "99.9%", label: "Platform Uptime" },
];

const values = [
  {
    icon: <VerifiedUserIcon fontSize="large" />,
    title: "Trust & Safety",
    desc: "Every driver is verified through government ID checks. Ratings and ride history ensure accountability across the community.",
  },
  {
    icon: <PeopleAltIcon fontSize="large" />,
    title: "Community First",
    desc: "We're not a taxi platform — we're a peer-to-peer network built on shared journeys, real conversations, and meaningful connections.",
  },
  {
    icon: <EmojiObjectsIcon fontSize="large" />,
    title: "Affordable Travel",
    desc: "Drivers cover their fuel costs, passengers save big. Everyone wins. Our commission model keeps prices fair for both sides.",
  },
  {
    icon: <PublicIcon fontSize="large" />,
    title: "Greener Roads",
    desc: "Every shared seat means one fewer car on the highway. We reduce traffic, cut emissions, and make intercity travel sustainable.",
  },
];

const team = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "Former product lead at Ola. Passionate about sustainable mobility across Tier-2 India.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Product",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    bio: "10 years shipping consumer apps. Believes great UX is the best trust signal.",
  },
  {
    name: "Rohit Das",
    role: "CTO",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    bio: "Microservices architect. Built ride-matching engines handling millions of daily queries.",
  },
];

const testimonials = [
  {
    quote:
      "I travel Bhubaneswar–Kolkata every month. Carpooling cut my cost by 60% and I've made genuine friends along the way.",
    name: "Rahul K.",
    city: "Delhi",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80",
  },
  {
    quote:
      "5 years, dozens of journeys, not a single disappointment. The verification system really makes you feel safe.",
    name: "Simon T.",
    city: "Mumbai",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
  },
];

const milestones = [
  { year: "2020", text: "Platform launched in 3 pilot cities across India" },
  {
    year: "2021",
    text: "Reached 1M registered users; Razorpay payments integrated",
  },
  {
    year: "2022",
    text: "Expanded to 22 cities; real-time GPS tracking shipped",
  },
  {
    year: "2023",
    text: "AI-based ride-matching engine deployed; 10M rides milestone",
  },
  { year: "2024", text: "600K+ daily rides; entered Southeast Asian markets" },
];

/* ─── Component ─────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <Box className="about-root">
      {/* ── Hero ── */}
      <Box className="about-hero">
        <Box className="about-hero__overlay" />
        <Container maxWidth="md" className="about-hero__content">
          <Chip label="Our Story" className="about-eyebrow" />
          <Typography variant="h1" className="about-hero__h1">
            Moving people.
            <br />
            <span className="about-accent">Building trust.</span>
          </Typography>
          <Typography className="about-hero__sub">
            Carpooling India is a peer-to-peer ride-sharing marketplace that
            connects drivers who have empty seats with passengers heading the
            same way — making intercity travel affordable, social, and
            sustainable.
          </Typography>
        </Container>
      </Box>

      {/* ── Stats bar ── */}
      <Box className="about-stats-bar">
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {stats.map((s) => (
              <Grid item xs={6} sm={3} key={s.label}>
                <Box className="about-stat">
                  <Typography className="about-stat__value">
                    {s.value}
                  </Typography>
                  <Typography className="about-stat__label">
                    {s.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Mission ── */}
      <Box className="about-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="about-img-wrap">
                <img
                  src={rideImg.src}
                  alt="People in a car on a highway"
                  className="about-img"
                />
                <Box className="about-img-badge">
                  <DirectionsCarIcon sx={{ mr: 0.8, fontSize: 18 }} />
                  Peer-to-peer, not taxi
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className="about-section-eyebrow">
                Why We Exist
              </Typography>
              <Typography variant="h2" className="about-section-h2">
                Travel shouldn't cost a fortune
              </Typography>
              <Typography className="about-body">
                India's intercity travel market is dominated by expensive trains
                that are always sold out and buses that take forever. We built
                Carpooling to unlock the millions of private car seats that
                travel the same highways every day — empty.
              </Typography>
              <Typography className="about-body" sx={{ mt: 2 }}>
                Drivers offset their fuel and toll costs. Passengers get a
                comfortable, direct, affordable seat. The platform takes a small
                commission (~15–20%) to keep the lights on and the product
                improving.
              </Typography>
              <Box className="about-pill-row">
                {[
                  "Cost-sharing",
                  "Verified profiles",
                  "Instant booking",
                  "In-app chat",
                ].map((t) => (
                  <Chip key={t} label={t} className="about-pill" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Values ── */}
      <Box className="about-section about-section--alt">
        <Container maxWidth="lg">
          <Box className="about-section-header">
            <Typography className="about-section-eyebrow">
              What We Stand For
            </Typography>
            <Typography variant="h2" className="about-section-h2 centered">
              Our core values
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {values.map((v) => (
              <Grid item xs={12} sm={6} md={3} key={v.title}>
                <Card className="about-value-card">
                  <CardContent>
                    <Box className="about-value-icon">{v.icon}</Box>
                    <Typography className="about-value-title">
                      {v.title}
                    </Typography>
                    <Typography className="about-value-desc">
                      {v.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── How it works (visual) ── */}
      <Box className="about-section">
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            alignItems="center"
            direction="row-reverse"
          >
            <Grid item xs={12} md={6}>
              <Box className="about-img-wrap">
                <img
                  src={safeDrive.src}
                  alt="Driver hands on steering wheel"
                  className="about-img"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className="about-section-eyebrow">
                The Model
              </Typography>
              <Typography variant="h2" className="about-section-h2">
                Supply-driven, community-powered
              </Typography>
              <Typography className="about-body">
                Drivers create the inventory — they post a ride, set a fair
                price, and choose who travels with them. Passengers search by
                route and date, book instantly or send a request, and pay
                securely through the app.
              </Typography>
              <Box className="about-steps">
                {[
                  ["01", "Driver posts a ride with route, date & price"],
                  ["02", "Passengers discover & book available seats"],
                  ["03", "Payment held in escrow until trip completes"],
                  ["04", "Both sides rate the experience — trust grows"],
                ].map(([n, t]) => (
                  <Box className="about-step" key={n}>
                    <Typography className="about-step__num">{n}</Typography>
                    <Typography className="about-step__text">{t}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Timeline ── */}
      <Box className="about-section about-section--alt">
        <Container maxWidth="md">
          <Box className="about-section-header">
            <Typography className="about-section-eyebrow">
              The Journey
            </Typography>
            <Typography variant="h2" className="about-section-h2 centered">
              From idea to 27 million members
            </Typography>
          </Box>
          <Box className="about-timeline">
            {milestones.map((m, i) => (
              <Box className="about-timeline__row" key={m.year}>
                <Box className="about-timeline__left">
                  <Typography className="about-timeline__year">
                    {m.year}
                  </Typography>
                </Box>
                <Box className="about-timeline__line">
                  <Box className="about-timeline__dot" />
                  {i < milestones.length - 1 && (
                    <Box className="about-timeline__bar" />
                  )}
                </Box>
                <Box className="about-timeline__right">
                  <Typography className="about-timeline__text">
                    {m.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Team ── */}
      <Box className="about-section">
        <Container maxWidth="lg">
          <Box className="about-section-header">
            <Typography className="about-section-eyebrow">
              The People
            </Typography>
            <Typography variant="h2" className="about-section-h2 centered">
              Built by people who love travel
            </Typography>
          </Box>
          <Grid container spacing={4} sx={{ mt: 1 }} justifyContent="center">
            {team.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={m.name}>
                <Card className="about-team-card">
                  <CardContent>
                    <Avatar
                      src={m.avatar}
                      alt={m.name}
                      className="about-team-avatar"
                    />
                    <Typography className="about-team-name">
                      {m.name}
                    </Typography>
                    <Typography className="about-team-role">
                      {m.role}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography className="about-team-bio">{m.bio}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Box className="about-section about-section--dark">
        <Container maxWidth="lg">
          <Box className="about-section-header">
            <Typography className="about-section-eyebrow light">
              Real Voices
            </Typography>
            <Typography
              variant="h2"
              className="about-section-h2 centered light"
            >
              What our community says
            </Typography>
          </Box>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            {testimonials.map((t) => (
              <Grid item xs={12} md={6} key={t.name}>
                <Card className="about-testi-card">
                  <CardContent>
                    <FormatQuoteIcon className="about-testi-icon" />
                    <Typography className="about-testi-quote">
                      {t.quote}
                    </Typography>
                    <Box className="about-testi-footer">
                      <Avatar
                        src={t.avatar}
                        alt={t.name}
                        sx={{ width: 44, height: 44 }}
                      />
                      <Box sx={{ ml: 1.5 }}>
                        <Typography className="about-testi-name">
                          {t.name}
                        </Typography>
                        <Box className="about-testi-stars">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <StarIcon
                              key={i}
                              sx={{ fontSize: 14, color: "#f59e0b" }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box className="about-cta">
        <Container maxWidth="sm">
          <Typography variant="h2" className="about-cta__h2">
            Ready to share the road?
          </Typography>
          <Typography className="about-cta__sub">
            Join millions of travellers who've already discovered a smarter way
            to move.
          </Typography>
          <Box className="about-cta__btns">
            <Link href="/offer-ride" className="about-btn about-btn--primary">
              Offer a Ride
            </Link>
            <Link href="/find-ride" className="about-btn about-btn--outline">
              Find a Ride
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
