"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { BiSolidSend } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { FaRightLong } from "react-icons/fa6";

import { FaLocationDot } from "react-icons/fa6";
import { FiMaximize, FiX } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";
import { TbCurrentLocationFilled } from "react-icons/tb";
import { GiRailRoad } from "react-icons/gi";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import trackingCar from "@/assets/images/trackingCar.png";
import {
  FiArrowLeft,
  FiMenu,
  FiBell,
  FiPhone,
  FiMessageSquare,
  FiShare2,
  FiAlertTriangle,
  FiHeadphones,
  FiPlus,
  FiMinus,
  FiCrosshair,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiSquare,
  FiUsers,
  FiChevronRight,
  FiTruck,
} from "react-icons/fi";
import { FaCarSide, FaFlagCheckered, FaTachometerAlt } from "react-icons/fa";

const RIDE_DATA = {
  rideId: "#BKGC8364",
  status: "driver_on_way", // scheduled | driver_on_way | arrived | in_progress | completed
  startedAt: "05:28 PM",
  departureTime: "5:50 PM",
  expectedArrival: "8:05 PM",

  from: {
    label: "KIIT Square, Bhubaneswar, Odisha 751024",
    city: "Bhubaneswar",
    lat: 20.356,
    lng: 85.818,
  },
  to: {
    label: "Puri, Odisha 752001",
    city: "Puri",
    lat: 19.8135,
    lng: 85.8312,
  },

  currentSpeedKmph: 42,
  etaLabel: "2h 15m",
  totalDistanceKm: 145,
  distanceCoveredKm: 28,
  distanceRemainingKm: 117,

  vehicle: { number: "OD 02 AB 1234", model: "Maruti Swift Dzire" },
  totalSeats: 4,
  bookedSeats: 3,
  earnings: 1890,
  paidCount: 3,

  passengers: [
    { id: 1, name: "Rahul Sharma", seat: 1, status: "paid", initials: "RS" },
    { id: 2, name: "Priya Mishra", seat: 2, status: "paid", initials: "PM" },
    { id: 3, name: "Aman Verma", seat: 3, status: "paid", initials: "AV" },
  ],
};

const STEPS = [
  { key: "scheduled", label: "Scheduled", icon: FiCalendar },
  { key: "driver_on_way", label: "Driver On Way", icon: FaCarSide },
  { key: "arrived", label: "Arrived", icon: FiMapPin },
  { key: "in_progress", label: "In Progress", icon: FiTruck },
  { key: "completed", label: "Completed", icon: FaFlagCheckered },
];

const CAR_STEP_PER_TICK = 1;
const CAR_TICK_MS = 1000;

/* ------------------------------------------------------------------ */
/*  Small geo helpers                                                  */
/* ------------------------------------------------------------------ */
function bearingBetween(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function DriverActiveRide({ ride = RIDE_DATA }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const coveredLayerRef = useRef(null);
  const carMarkerRef = useRef(null);
  const leafletRef = useRef(null);

  const routeCoordsRef = useRef([]);
  const carIndexRef = useRef(0);
  const carIntervalRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationLabel, setUserLocationLabel] = useState("");

  const currentStepIndex = STEPS.findIndex((s) => s.key === ride.status);

  const updateCarMarkerRotation = (bearing) => {
    const el = carMarkerRef.current?.getElement();
    const dot = el?.querySelector(".driver-track-car-dot");
    if (dot) dot.style.transform = `rotate(${bearing}deg)`;
  };

  const moveCarToIndex = useCallback((index) => {
    const coords = routeCoordsRef.current;
    if (!coords.length || !carMarkerRef.current) return;

    const clamped = Math.min(Math.max(index, 0), coords.length - 1);
    const pos = coords[clamped];
    const lookAhead = coords[Math.min(clamped + 1, coords.length - 1)];
    const bearing =
      bearingBetween(pos[0], pos[1], lookAhead[0], lookAhead[1]) + 180;

    carMarkerRef.current.setLatLng(pos);
    updateCarMarkerRotation(bearing);
    coveredLayerRef.current?.setLatLngs(coords.slice(0, clamped + 1));

    carIndexRef.current = clamped;
  }, []);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("userLocation");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (
        parsed &&
        typeof parsed.latitude === "number" &&
        typeof parsed.longitude === "number"
      ) {
        setUserLocation({
          lat: parsed.latitude,
          lng: parsed.longitude,
        });
      }
    } catch (err) {
      console.warn("Invalid userLocation in sessionStorage", err);
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchLabel = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${userLocation.lat}&lon=${userLocation.lng}&zoom=18&addressdetails=1`,
        );
        const data = await response.json();
        const address = data?.address;
        if (address) {
          const parts = [
            address.road,
            address.neighbourhood,
            address.suburb,
            address.hamlet,
            address.village,
            address.town,
            address.city_district,
            address.city,
            address.state,
            address.country,
          ];

          const label = parts
            .filter(Boolean)
            .map((value) => value.trim())
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(", ");

          setUserLocationLabel(
            label || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
          );
        }
      } catch (err) {
        console.warn("Failed to resolve user location label", err);
        setUserLocationLabel(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
      }
    };

    fetchLabel();
  }, [userLocation]);

  /* ---------------- Leaflet map bootstrap + OSRM route ---------------- */
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      leafletRef.current = L;

      const map = L.map(mapElRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([ride.from.lat, ride.from.lng], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      const pickupIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: '<div class="driver-track-pin driver-track-pin-pickup"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 20],
      });
      const destIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: '<div class="driver-track-pin driver-track-pin-dest"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 20],
      });

      L.marker([ride.from.lat, ride.from.lng], { icon: pickupIcon }).addTo(map);
      L.marker([ride.to.lat, ride.to.lng], { icon: destIcon }).addTo(map);

      /* Fetch the road route from OSRM (same approach as the rider-side map) */
      let coords = [
        [ride.from.lat, ride.from.lng],
        [ride.to.lat, ride.to.lng],
      ];

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${ride.from.lng},${ride.from.lat};${ride.to.lng},${ride.to.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.routes?.[0]?.geometry?.coordinates?.length) {
          coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
          ]);
        }
      } catch (e) {
        // Fall back silently to the straight line already set above.
      }

      if (cancelled) return;

      routeCoordsRef.current = coords;

      routeLayerRef.current = L.polyline(coords, {
        color: "#babdc2",
        weight: 6,
        opacity: 1,
        lineCap: "round",
      }).addTo(map);

      const progressRatio = Math.min(
        1,
        ride.distanceCoveredKm / ride.totalDistanceKm,
      );
      const startIndex = Math.max(
        0,
        Math.min(coords.length - 1, Math.floor(coords.length * progressRatio)),
      );

      coveredLayerRef.current = L.polyline(coords.slice(0, startIndex + 1), {
        color: "#1e40af",
        weight: 6,
        opacity: 1,
        lineCap: "round",
      }).addTo(map);

      const startPos = coords[startIndex];
      const startLookAhead =
        coords[Math.min(startIndex + 1, coords.length - 1)];
      const startBearing =
        bearingBetween(
          startPos[0],
          startPos[1],
          startLookAhead[0],
          startLookAhead[1],
        ) + 180;

      const carIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: `
    <div class="driver-track-car-marker">
      <span class="driver-track-car-pulse"></span>
      <div class="driver-track-car-dot" style="transform: rotate(${startBearing}deg)">
        <img src="${trackingCar.src}" width="28" height="28" alt="" />
      </div>
    </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      carMarkerRef.current = L.marker(startPos, { icon: carIcon }).addTo(map);
      carIndexRef.current = startIndex;

      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });

      /* Leaflet reads the container's pixel size the instant L.map()
         runs. In Next.js the container can still be 0x0 at that
         moment (stylesheet/hydration timing), which leaves the map
         stuck zoomed all the way out. Forcing a size recheck once
         layout has actually settled fixes it, and the ResizeObserver
         keeps it correct through later layout changes. */
      requestAnimationFrame(() => {
        if (!mapRef.current) return;
        mapRef.current.invalidateSize();
        mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
      });

      const resizeObserver = new ResizeObserver(() => {
        mapRef.current?.invalidateSize();
      });
      resizeObserver.observe(mapElRef.current);
      mapRef.current._driverTrackResizeObserver = resizeObserver;

      setMapReady(true);

      /* ---- Simulated live movement, source -> destination ----
         Every CAR_TICK_MS, step the car forward along the static
         route. Once you have a real feed, drop this setInterval and
         call moveCarToIndex(nextIndex) (or a lat/lng based variant)
         whenever a new position arrives from your API/socket. */
      carIntervalRef.current = setInterval(() => {
        const allCoords = routeCoordsRef.current;
        if (!allCoords.length) return;

        const nextIndex = carIndexRef.current + CAR_STEP_PER_TICK;

        if (nextIndex >= allCoords.length - 1) {
          moveCarToIndex(allCoords.length - 1);
          clearInterval(carIntervalRef.current);
          carIntervalRef.current = null;
          return;
        }

        moveCarToIndex(nextIndex);
      }, CAR_TICK_MS);
    })();

    return () => {
      cancelled = true;
      if (carIntervalRef.current) {
        clearInterval(carIntervalRef.current);
        carIntervalRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current._driverTrackResizeObserver?.disconnect();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), []);
  const recenter = useCallback(() => {
    if (!mapRef.current || !carMarkerRef.current) return;
    mapRef.current.flyTo(carMarkerRef.current.getLatLng(), 12, {
      duration: 0.6,
    });
  }, []);

  const [swipePosition, setSwipePosition] = useState(0);
  const [openSosModal, setOpenSosModal] = useState(false);

  const swipeStartX = useRef(0);
  const isSwiping = useRef(false);

  const handleOpenSosModal = () => setOpenSosModal(true);
  const handleCloseSosModal = () => setOpenSosModal(false);

  const handleSwipeStart = (e) => {
    e.preventDefault();

    swipeStartX.current = e.clientX;
    isSwiping.current = true;

    const handlePointerMove = (event) => {
      if (!isSwiping.current) return;

      const diff = event.clientX - swipeStartX.current;

      const maxSwipe = 220;

      const position = Math.max(0, Math.min(diff, maxSwipe));

      setSwipePosition(position);
    };

    const handlePointerUp = (event) => {
      if (!isSwiping.current) return;

      isSwiping.current = false;

      const diff = event.clientX - swipeStartX.current;

      if (diff >= 190) {
        // Swipe completed
        setSwipePosition(220);

        handleCompleteRide();
      } else {
        // Not enough → reset
        setSwipePosition(0);
      }

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="driver-track-page">
      {/* ---------------- Top nav ---------------- */}

      <main className="driver-track-container">
        {/* ---------------- Ride header ---------------- */}
        <section className="driver-track-card driver-track-header-card">
          <div className="driver-track-header-left">
            <div>
              <div className="driver-track-title-row">
                <h1 className="driver-track-title">{ride.from.label} <FaRightLong />
 {ride.to.label}</h1>
                <span className="driver-track-badge driver-track-badge-live">
                  <span className="driver-track-live-dot" /> LIVE
                </span>
              </div>
              {/* <p className="driver-track-subtitle">Ride ID: {ride.rideId}</p> */}
            </div>
          </div>
          <div className="driver-track-btn driver-track-btn-outline-danger driver-track-end-ride-top swipe-end-ride">
            <div className="swipe-end-ride-track">
              <span
                className="swipe-end-ride-text"
                style={{
                  opacity: Math.max(0, 1 - swipePosition / 70),
                }}
              >
                Complete Ride
              </span>

              <div
                className="swipe-end-ride-thumb"
                style={{
                  transform: `translateX(${swipePosition}px)`,
                }}
                onPointerDown={handleSwipeStart}
              >
                <BiSolidSend size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Status stepper ---------------- */}
        {/* <section className="driver-track-card driver-track-stepper-card">
          <ol className="driver-track-stepper">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const state =
                i < currentStepIndex
                  ? "done"
                  : i === currentStepIndex
                    ? "active"
                    : "upcoming";
              return (
                <li
                  key={step.key}
                  className={`driver-track-step driver-track-step-${state}`}
                >
                  <span className="driver-track-step-icon">
                    <Icon />
                  </span>
                  <span className="driver-track-step-label">{step.label}</span>
                  {i < STEPS.length - 1 && (
                    <span className="driver-track-step-connector" />
                  )}
                </li>
              );
            })}
          </ol>
        </section> */}

        {/* ---------------- Map ---------------- */}
        <section className="driver-track-card driver-track-map-card">
          <div className="driver-track-map-wrap">
            <div ref={mapElRef} className="driver-track-map" />

            {!mapReady && (
              <div className="driver-track-map-loading">Loading live map…</div>
            )}

            {/* <div className="driver-track-chip driver-track-chip-here">
                <span className="driver-track-chip-dot" />
                <div>
                    <strong>You are here</strong>
                    <p>{ride.from.label}</p>
                </div>
                </div> */}

            {/* <div className="driver-track-chip driver-track-chip-dest">
              <FiMapPin className="driver-track-chip-dest-icon" />
              <div>
                <strong>Destination</strong>
                <p>{ride.to.label}</p>
              </div>
            </div> */}

            <div className="driver-track-bottom-chips">
              <div className="driver-track-chip">
                <p>

                <GiRailRoad />
                </p>
                <div>
                  <span className="driver-track-chip-label">Distance Left</span>
                  <strong>{ride.distanceRemainingKm} km</strong>
                </div>
              </div>

              <div className="driver-track-chip">
                <p>

                <LuUsers />
                </p>
                <div>
                  <span className="driver-track-chip-label">Passenger</span>
                  <strong>{ride?.paidCount}</strong>
                </div>
              </div>

              <div className="driver-track-chip">
                <p>

                <FiClock />
                </p>
                <div>
                  <span className="driver-track-chip-label">Eta</span>
                  <strong>{ride.etaLabel}</strong>
                </div>
              </div>
            </div>

            <div className="driver-track-map-controls">
              <button
                onClick={recenter}
                className="driver-track-map-btn"
                aria-label="Recenter"
              >
                <FiMaximize />
              </button>
              <button
                onClick={zoomIn}
                className="driver-track-map-btn"
                aria-label="Zoom in"
              >
                <FiPlus />
              </button>
              <button
                onClick={zoomOut}
                className="driver-track-map-btn"
                aria-label="Zoom out"
              >
                <FiMinus />
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- Trip info bar ---------------- */}
        {/* <section className="driver-track-card driver-track-info-bar">
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <span className="driver-track-dot-green" /> From
            </span>
            <strong>{ride.from.city}</strong>
          </div>
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <FiMapPin className="driver-track-info-icon-red" /> To
            </span>
            <strong>{ride.to.city}</strong>
          </div>
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <FiCalendar /> Departure Time
            </span>
            <strong>{ride.departureTime}</strong>
          </div>
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <FaCarSide /> Vehicle
            </span>
            <strong>{ride.vehicle.number}</strong>
            <span className="driver-track-info-sub">{ride.vehicle.model}</span>
          </div>
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <FiUsers /> Total Seats
            </span>
            <strong>{ride.totalSeats}</strong>
          </div>
          <div className="driver-track-info-item">
            <span className="driver-track-info-label">
              <FiUsers /> Booked
            </span>
            <strong>{ride.bookedSeats}</strong>
          </div>
        </section> */}

        {/* ---------------- Passengers + Ride summary ---------------- */}
        {/* <section className="driver-track-grid-2">
          <div className="driver-track-card">
            <div className="driver-track-card-head">
              <h2>Passengers ({ride.passengers.length})</h2>
              <button className="driver-track-link-btn">
                View All Details <FiChevronRight />
              </button>
            </div>
            <ul className="driver-track-passenger-list">
              {ride.passengers.map((p) => (
                <li key={p.id} className="driver-track-passenger-row">
                  <span className="driver-track-avatar driver-track-avatar-passenger">
                    {p.initials}
                  </span>
                  <div className="driver-track-passenger-info">
                    <strong>{p.name}</strong>
                    <span>Seat {p.seat}</span>
                  </div>
                  <span
                    className={`driver-track-badge driver-track-badge-${
                      p.status === "paid" ? "success" : "amber"
                    }`}
                  >
                    {p.status === "paid" ? "PAID" : "PENDING"}
                  </span>
                  <div className="driver-track-passenger-actions">
                    <button
                      className="driver-track-icon-btn driver-track-icon-btn-outline"
                      aria-label={`Call ${p.name}`}
                    >
                      <FiPhone />
                    </button>
                    <button
                      className="driver-track-icon-btn driver-track-icon-btn-outline"
                      aria-label={`Message ${p.name}`}
                    >
                      <FiMessageSquare />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="driver-track-card">
            <div className="driver-track-card-head">
              <h2>Ride Summary</h2>
            </div>
            <ul className="driver-track-summary-list">
              <li>
                <span>Total Distance</span>
                <strong>{ride.totalDistanceKm} km</strong>
              </li>
              <li>
                <span>Distance Covered</span>
                <strong>{ride.distanceCoveredKm} km</strong>
              </li>
              <li>
                <span>Remaining Distance</span>
                <strong>{ride.distanceRemainingKm} km</strong>
              </li>
              <li>
                <span>ETA to Destination</span>
                <strong>{ride.etaLabel}</strong>
              </li>
              <li>
                <span>Expected Arrival</span>
                <strong>{ride.expectedArrival}</strong>
              </li>
              <li>
                <span>Earnings</span>
                <strong>₹{ride.earnings.toLocaleString("en-IN")}</strong>
              </li>
           
            </ul>
          </div>
        </section> */}

        {/* ---------------- Live location + Ride controls ---------------- */}
        {/* <section className="driver-track-grid-2">
          <div className="driver-track-card driver-track-live-card">
            <div className="driver-track-card-head">
              <h2>Live Location</h2>
              <span className="driver-track-badge driver-track-badge-live">
                <span className="driver-track-live-dot" /> LIVE
              </span>
            </div>
            <p className="driver-track-muted">
              Your location is being shared with passengers
            </p>
            <button className="driver-track-btn driver-track-btn-primary driver-track-full">
              <FiShare2 /> Share Live Location
            </button>
            <p className="driver-track-hint">
              Location updates every 5 seconds
            </p>
          </div >

          <div className="driver-track-card">
            <div className="driver-track-card-head">
              <h2>Ride Controls</h2>
            </div>
            <button className="driver-track-btn driver-track-btn-danger driver-track-full">
              <FiSquare /> End Ride
            </button>
            <div className="driver-track-controls-row">
              <button className="driver-track-btn driver-track-btn-outline-primary">
                <FiPhone /> Call All Passengers
              </button>
              <button className="driver-track-btn driver-track-btn-outline-amber">
                <FiAlertTriangle /> Report an Issue
              </button>
            </div>
          </div>
        </section> */}

        {/* ---------------- Need help ---------------- */}
        <section className="driver-track-card driver-track-help-bar">
          <div className="driver-track-help-left">
            <span className="driver-track-help-icon">
              <FiHeadphones />
            </span>
            <div>
              <strong>Need Help?</strong>
              <p>24/7 Support is available for you</p>
            </div>
          </div>
          <div className="driver-track-foot-btn">
            <button className="driver-track-btn driver-track-btn-outline-primary">

              <FiPhone /> Call Support
            </button>
            {/* <button className="driver-track-btn driver-track-btn-outline-amber">
              <FiAlertTriangle /> Report an Issue
            </button> */}
            <button className="driver-track-btn sos-btn" onClick={handleOpenSosModal}>
          <span>    <AiFillAlert  /></span>
              SOS Emergency
            </button>
          </div>
        </section>
      </main>

  <Dialog
  open={openSosModal}
  onClose={handleCloseSosModal}
  maxWidth="xs"
  fullWidth
  className="sos-dialog"
>
  <DialogTitle className="sos-dialog-title">
    <div className="sos-title-content">
      <span className="sos-title-icon">  <AiFillAlert /></span>
      <span>SOS ACTIVATED</span>
    </div>

    <IconButton
      edge="end"
      onClick={handleCloseSosModal}
      aria-label="Close"
      size="medium"
      className="sos-close-btn"
    >
      <FiX />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers className="sos-dialog-content">
    <div className="sos-alert-box">
      <div className="sos-alert-icon">!</div>

      <div>
        <div className="sos-alert-title">
          Emergency assistance requested
        </div>

        <div className="sos-alert-text">
    Emergency assistance has been requested. Your location is available to help responders assist you
        </div>
      </div>
    </div>

    <div className="sos-location-section">
      <div className="sos-section-title"><TbCurrentLocationFilled />
 Your current location</div>

      <div className="sos-location-box">
        <span>
          {userLocationLabel ||
            (userLocation
              ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
              : `${ride.from.lat.toFixed(4)}, ${ride.from.lng.toFixed(4)}`)}
        </span>
      </div>
    </div>
  </DialogContent>

  <DialogActions className="sos-dialog-actions">
    <Button
      variant="contained"
      color="error"
      fullWidth
      className="sos-emergency-btn"
      href="tel:112"
    >
      Call Emergency Services
    </Button>

   
  </DialogActions>
</Dialog>
    </div>
  );
}
