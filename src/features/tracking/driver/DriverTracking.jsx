"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { BiSolidSend } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { FaRightLong } from "react-icons/fa6";
import { FiMaximize } from "react-icons/fi";
import { GiRailRoad } from "react-icons/gi";
import { useRouter, useSearchParams } from "next/navigation";

import trackingCar from "@/assets/images/trackingCar.png";
import {
  FiPhone,
  FiHeadphones,
  FiPlus,
  FiMinus,
  FiClock,
  FiMapPin,
  FiCalendar,
  FiTruck,
} from "react-icons/fi";
import { FaCarSide, FaFlagCheckered } from "react-icons/fa";

import SosFloating from "@/components/SOS";
import { completeRideApi } from "@/services/client/rideService";

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
/*  Rotating "nav camera" tuning                                       */
/*  Leaflet has no native map-rotation. The trick: render the map      */
/*  inside an oversized hidden container and CSS-rotate that container */
/*  so the car's current heading always points "up" (Google-Maps-style */
/*  nav mode). Because the container is bigger than the visible        */
/*  window, every zoom Leaflet computes must be bumped up by           */
/*  log2(MAP_OVERSIZE_FACTOR) or the map will look too zoomed out.     */
/* ------------------------------------------------------------------ */
// Rotor is sized 260% / offset -80% in the CSS (.driver-track-map-rotor) —
// keep MAP_OVERSIZE_FACTOR in sync with that value if you ever change it.
const MAP_OVERSIZE_FACTOR = 2.6;
const MAP_ZOOM_COMPENSATION = Math.log2(MAP_OVERSIZE_FACTOR);

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

export default function DriverActiveRide({ ride = RIDE_DATA, onRideComplete }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("rideId");

  const mapElRef = useRef(null);
  const mapRotorRef = useRef(null); // oversized div that gets CSS-rotated
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const coveredLayerRef = useRef(null);
  const carMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const leafletRef = useRef(null);

  const routeCoordsRef = useRef([]);
  const carIndexRef = useRef(0);
  const carIntervalRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const currentStepIndex = STEPS.findIndex((s) => s.key === ride.status);

  useEffect(() => {
    if (!rideId) {
      console.warn(
        "DriverActiveRide: no rideId found in URL — /driver/tracking must be opened as /driver/tracking?rideId=<id>",
      );
    }
  }, [rideId]);

  const updateCarMarkerRotation = (bearing) => {
    const el = carMarkerRef.current?.getElement();
    const dot = el?.querySelector(".driver-track-car-dot");
    if (dot) dot.style.transform = `rotate(${bearing}deg)`;
  };

  const updatePinRotation = (markerRef, angleDeg) => {
    const el = markerRef.current?.getElement();
    const rotor = el?.querySelector(".driver-track-pin-rotor");
    if (rotor) rotor.style.transform = `rotate(${angleDeg}deg)`;
  };

  /* Rotates the whole map so `rawBearingDeg` (the raw direction-of-travel,
     0 = north) points to the top of the screen, then counter-rotates the
     pickup/destination pins so they stay upright instead of spinning with
     the map — matches Google Maps nav-mode behaviour. */
  const applyMapRotation = useCallback((rawBearingDeg) => {
    const rotateDeg = -rawBearingDeg;
    if (mapRotorRef.current) {
      mapRotorRef.current.style.transform = `rotate(${rotateDeg}deg)`;
    }
    updatePinRotation(pickupMarkerRef, rawBearingDeg);
    updatePinRotation(destMarkerRef, rawBearingDeg);
  }, []);

  const moveCarToIndex = useCallback(
    (index) => {
      const coords = routeCoordsRef.current;
      if (!coords.length || !carMarkerRef.current) return;

      const clamped = Math.min(Math.max(index, 0), coords.length - 1);
      const pos = coords[clamped];
      const lookAhead = coords[Math.min(clamped + 1, coords.length - 1)];
      const rawBearing = bearingBetween(
        pos[0],
        pos[1],
        lookAhead[0],
        lookAhead[1],
      );

      carMarkerRef.current.setLatLng(pos);
      updateCarMarkerRotation(rawBearing + 180);
      coveredLayerRef.current?.setLatLngs(coords.slice(0, clamped + 1));
      applyMapRotation(rawBearing);

      // Keep the car centred in view as it advances (nav-camera follow).
      mapRef.current?.panTo(pos, {
        animate: true,
        duration: CAR_TICK_MS / 1000,
        easeLinearity: 1,
      });

      carIndexRef.current = clamped;
    },
    [applyMapRotation],
  );

  /* ---------------- Leaflet map bootstrap + OSRM route ---------------- */
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapElRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapElRef.current, {
        zoomControl: false,
        attributionControl: false,
        // Fractional zoom so we can precisely compensate for the oversized
        // rotor container (see MAP_ZOOM_COMPENSATION above).
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        // Dragging is disabled on purpose: once the map is CSS-rotated,
        // a manual drag gesture no longer matches the screen direction.
        // Recenter / zoom buttons remain fully functional.
        dragging: false,
      }).setView([ride.from.lat, ride.from.lng], 8 + MAP_ZOOM_COMPENSATION);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      const pickupIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: '<div class="driver-track-pin-rotor"><div class="driver-track-pin driver-track-pin-pickup"></div></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 20],
      });
      const destIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: '<div class="driver-track-pin-rotor"><div class="driver-track-pin driver-track-pin-dest"></div></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 20],
      });

      pickupMarkerRef.current = L.marker([ride.from.lat, ride.from.lng], {
        icon: pickupIcon,
      }).addTo(map);
      destMarkerRef.current = L.marker([ride.to.lat, ride.to.lng], {
        icon: destIcon,
      }).addTo(map);

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
        color: "#1e40af",
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
        color: "#9FA6B3",
        weight: 6,
        opacity: 1,
        lineCap: "round",
      }).addTo(map);

      const startPos = coords[startIndex];
      const startLookAhead =
        coords[Math.min(startIndex + 1, coords.length - 1)];
      const startRawBearing = bearingBetween(
        startPos[0],
        startPos[1],
        startLookAhead[0],
        startLookAhead[1],
      );

      const carIcon = L.divIcon({
        className: "driver-track-leaflet-icon",
        html: `
    <div class="driver-track-car-marker">
      <span class="driver-track-car-pulse"></span>
      <div class="driver-track-car-dot" style="transform: rotate(${startRawBearing + 180}deg)">
        <img src="${trackingCar.src}" width="28" height="28" alt="" />
      </div>
    </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      carMarkerRef.current = L.marker(startPos, { icon: carIcon }).addTo(map);
      carIndexRef.current = startIndex;

      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
      map.setZoom(map.getZoom() + MAP_ZOOM_COMPENSATION, { animate: false });

      // Orient the map + pins for the very first frame: direction of
      // travel points up, source sits behind (bottom), destination ahead
      // (top) — same math the live ticker uses below.
      applyMapRotation(startRawBearing);

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
        mapRef.current.setZoom(
          mapRef.current.getZoom() + MAP_ZOOM_COMPENSATION,
          {
            animate: false,
          },
        );
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
    mapRef.current.flyTo(
      carMarkerRef.current.getLatLng(),
      12 + MAP_ZOOM_COMPENSATION,
      {
        duration: 0.6,
      },
    );
  }, []);

  const [swipePosition, setSwipePosition] = useState(0);

  const swipeStartX = useRef(0);
  const isSwiping = useRef(false);

  /* Fires once the swipe gesture crosses the completion threshold.
     Calls the real complete-ride API with the rideId from the URL,
     stops the live-position interval, then navigates to the
     ride-complete screen — only on success. On failure the thumb
     resets so the driver can try again. */
  const handleCompleteRide = useCallback(async () => {
    if (!rideId) {
      console.error("Cannot complete ride: missing rideId in URL");
      setCompleteError("Missing ride reference. Please reopen this ride.");
      setSwipePosition(0);
      return;
    }
    if (completing || rideCompleted) return;

    setCompleting(true);
    setCompleteError(null);

    try {
      const { data } = await completeRideApi(rideId);
      const completedRideId = data?.data?.rideId ?? rideId;

      if (carIntervalRef.current) {
        clearInterval(carIntervalRef.current);
        carIntervalRef.current = null;
      }

      setRideCompleted(true);
      onRideComplete?.(ride);

      router.push(`/driver/ride-complete?rideId=${completedRideId}`);
    } catch (err) {
      console.error("Failed to complete ride:", err);
      setCompleteError("Failed to complete the ride. Please try again.");
      setSwipePosition(0); // reset thumb so the driver can retry
    } finally {
      setCompleting(false);
    }
  }, [rideId, completing, rideCompleted, onRideComplete, ride, router]);

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

  const swipeLabel = rideCompleted
    ? "Ride Completed"
    : completing
      ? "Completing…"
      : "Complete Ride";

  return (
    <div className="driver-track-page">
      {/* Floating SOS icon + emergency modal, fully self-contained */}
      <SosFloating fallbackLat={ride.from.lat} fallbackLng={ride.from.lng} />

      <main className="driver-track-container">
        {/* ---------------- Ride header ---------------- */}
        <section className="driver-track-card driver-track-header-card">
          <div className="driver-track-header-left">
            <div>
              <div className="driver-track-title-row">
                <h1 className="driver-track-title">
                  {ride.from.label} <FaRightLong /> {ride.to.label}
                </h1>
                <span className="driver-track-badge driver-track-badge-live">
                  <span className="driver-track-live-dot" /> LIVE
                </span>
              </div>
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
                {swipeLabel}
              </span>

              <div
                className="swipe-end-ride-thumb"
                style={{
                  transform: `translateX(${swipePosition}px)`,
                  opacity: completing ? 0.7 : 1,
                  cursor: rideCompleted || completing ? "default" : "grab",
                }}
                onPointerDown={
                  rideCompleted || completing ? undefined : handleSwipeStart
                }
              >
                <BiSolidSend size={22} />
              </div>
            </div>
          </div>
        </section>

        {completeError && (
          <p className="driver-track-complete-error">{completeError}</p>
        )}

        {/* ---------------- Map ---------------- */}
        <section className="driver-track-card driver-track-map-card">
          <div className="driver-track-map-wrap">
            {/* Oversized rotor: CSS-rotated so the car's heading always
                points up, like Google Maps nav mode. The wrap above clips
                the overflow so no empty corners show. */}
            <div ref={mapRotorRef} className="driver-track-map-rotor">
              <div ref={mapElRef} className="driver-track-map" />
            </div>

            {!mapReady && (
              <div className="driver-track-map-loading">Loading live map…</div>
            )}

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
          </div>
        </section>
      </main>
    </div>
  );
}
