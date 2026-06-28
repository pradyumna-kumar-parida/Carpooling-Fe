"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCarRear } from "react-icons/fa6";

import "leaflet/dist/leaflet.css";
import trackingCar from "../../../assets/images/trackingCar.png";
const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", dot: "#1a56db" },
  driver_on_way: { label: "Driver On The Way", dot: "#d97706" },
  arrived: { label: "Driver Arrived", dot: "#059669" },
  in_progress: { label: "In Progress", dot: "#7c3aed" },
  completed: { label: "Completed", dot: "#16a34a" },
};

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

const MapPanel = ({
  ride,
  rideStatus,
  trackingEnabled,
  mapFullscreen,
  setMapFullscreen,
  formatDate,
  formatTime,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeCoordsRef = useRef([]);
  const moveIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const completedRouteRef = useRef(null);
  const remainingRouteRef = useRef(null);
  const [eta, setEta] = useState("--");
  const [distanceLeft, setDistanceLeft] = useState("--");
  const [avatarSrc, setAvatarSrc] = useState(ride.driver_profile_picture);

  const status = STATUS_CONFIG[rideStatus] || STATUS_CONFIG.scheduled;

  // Reset the avatar whenever the ride (and therefore the driver) changes.
  useEffect(() => {
    setAvatarSrc(ride.driver_profile_picture);
  }, [ride.driver_profile_picture]);

  // Haversine distance in km between two [lat,lng] points
  const distanceKm = (a, b) => {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  // Bearing (degrees) from point a to point b, for car rotation
  const bearing = (a, b) => {
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180) / Math.PI;
  };

  // L is now passed in explicitly rather than read off `window.L`,
  // since we get it from the dynamic `import("leaflet")` below.
  const carIcon = (L, angle = 0) =>
    L.divIcon({
      className: "",
      html: `
      <div
        style="
          width:25px;
          height:40px;
          display:flex;
          align-items:center;
          justify-content:center;
          transform: rotate(${angle + 180}deg);
          transform-origin:center center;
          transition: transform .25s linear;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,.35));
        "
      >
        <img
          src="${trackingCar.src}"
          width="40"
          height="40"
          draggable="false"
          style="
            width:40px;
            height:40px;
            user-select:none;
            pointer-events:none;
          "
        />
      </div>
    `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

  const remainingDistanceAndEta = (fromIndex) => {
    const coords = routeCoordsRef.current;
    let km = 0;
    for (let i = fromIndex; i < coords.length - 1; i++) {
      km += distanceKm(coords[i], coords[i + 1]);
    }
    const avgSpeedKmh = 35;
    const etaMin = Math.max(1, Math.round((km / avgSpeedKmh) * 60));
    return { km, etaMin };
  };

  const startDriverMovement = (map, L) => {
    clearInterval(intervalRef.current);
    const coords = routeCoordsRef.current;
    if (!coords.length) return;

    moveIndexRef.current = 0;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
    }
    driverMarkerRef.current = L.marker(coords[0], {
      icon: carIcon(L, 0),
    }).addTo(map);

    intervalRef.current = setInterval(() => {
      const idx = moveIndexRef.current;
      if (idx >= coords.length - 1) {
        clearInterval(intervalRef.current);
        return;
      }

      const current = coords[idx];
      const next = coords[idx + 1];
      const angle = bearing(current, next);

      driverMarkerRef.current.setLatLng(next);
      const travelled = coords.slice(0, idx + 2);
      const remaining = coords.slice(idx + 1);

      completedRouteRef.current.setLatLngs(travelled);
      remainingRouteRef.current.setLatLngs(remaining);
      driverMarkerRef.current.setIcon(carIcon(L, angle));

      const { km, etaMin } = remainingDistanceAndEta(idx + 1);
      if (isMountedRef.current) {
        setDistanceLeft(
          km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
        );
        setEta(`${etaMin} min`);
      }

      moveIndexRef.current += 1;
    }, 1000);
  };

  const fetchRouteAndDraw = async (map, L, srcLat, srcLng, dstLat, dstLng) => {
    try {
      const res = await fetch(
        `${OSRM_URL}/${srcLng},${srcLat};${dstLng},${dstLat}?overview=full&geometries=geojson`,
      );
      const data = await res.json();
      const geo = data?.routes?.[0]?.geometry?.coordinates;

      const coords = geo?.length
        ? geo.map(([lng, lat]) => [lat, lng])
        : [
            [srcLat, srcLng],
            [dstLat, dstLng],
          ];

      if (!isMountedRef.current) return;

      routeCoordsRef.current = coords;

      completedRouteRef.current = L.polyline([], {
        color: "#949caa",
        weight: 6,
        opacity: 0.9,
      }).addTo(map);

      remainingRouteRef.current = L.polyline(coords, {
        color: "#1a57db",
        weight: 6,
        opacity: 0.9,
      }).addTo(map);
      map.fitBounds(coords, { padding: [60, 60] });

      const { km, etaMin } = remainingDistanceAndEta(0);
      setDistanceLeft(
        km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
      );
      setEta(`${etaMin} min`);

      if (trackingEnabled) {
        startDriverMovement(map, L);
      }
    } catch (err) {
      // OSRM failed — fall back to straight line
      if (!isMountedRef.current) return;
      const coords = [
        [srcLat, srcLng],
        [dstLat, dstLng],
      ];
      routeCoordsRef.current = coords;
      L.polyline(coords, {
        color: "#1a56db",
        weight: 6,
        opacity: 0.8,
        dashArray: "10,7",
      }).addTo(map);
      map.fitBounds(coords, { padding: [60, 60] });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const initMap = async () => {
      // Dynamically import leaflet so its `window`/`document` references
      // never execute during SSR or at build time — only after this
      // effect runs in the browser.
      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;

      if (cancelled || !mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const srcLat = parseFloat(ride.source_lat);
      const srcLng = parseFloat(ride.source_lng);
      const dstLat = parseFloat(ride.destination_lat);
      const dstLng = parseFloat(ride.destination_lng);

      const map = L.map(mapRef.current, { zoomControl: false }).setView(
        [(srcLat + dstLat) / 2, (srcLng + dstLng) / 2],
        13,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.control.zoom({ position: "topleft" }).addTo(map);

      const greenIcon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;background:#16a34a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const redIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;background:#dc2626;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([srcLat, srcLng], { icon: greenIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup</b><br/>${ride.source_address}`)
        .openPopup();

      L.marker([dstLat, dstLng], { icon: redIcon })
        .addTo(map)
        .bindPopup(`<b>Drop</b><br/>${ride.destination_address}`);

      mapInstanceRef.current = map;

      fetchRouteAndDraw(map, L, srcLat, srcLng, dstLat, dstLng);
    };

    initMap();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearInterval(intervalRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride, mapFullscreen, trackingEnabled]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [mapFullscreen]);

  return (
    <div className="ms-container">
      {/* Status Badge */}
      <div className="ms-status-badge">
        <span className="ms-status-dot" style={{ background: status.dot }} />
        <span>{status.label}</span>
        <span className="ms-status-sep">·</span>
        <span className="ms-status-sub">
          Live tracking starts 30 min before departure
        </span>
      </div>

      {/* Fullscreen Toggle */}
      <button
        className="ms-expand-btn"
        onClick={() => setMapFullscreen((p) => !p)}
        title="Toggle fullscreen"
        type="button"
      >
        {mapFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path
              d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path
              d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {/* Map */}
      <div ref={mapRef} className="ms-map" />

      {/* Tracking Disabled Overlay */}
      {!trackingEnabled && (
        <div className="ms-tracking-overlay">
          <div className="ms-tracking-msg">
            <div className="ms-tracking-icon">
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="#dbeafe"
                  stroke="#1a56db"
                  strokeWidth="2"
                />
                <circle cx="12" cy="9" r="2.5" fill="#1a56db" />
              </svg>
            </div>
            <p className="ms-tracking-title">
              Ride Scheduled · {formatDate(ride.ride_date)}
            </p>
            <p className="ms-tracking-sub">
              Live tracking available 30 min before departure (
              {formatTime(ride.departure_time)})
            </p>
          </div>
        </div>
      )}

      {/* Floating Driver Card */}
      <div className="ms-driver-card">
        <Image
          src={avatarSrc}
          alt={ride.driver_name}
          width={48}
          height={48}
          className="ms-driver-avatar"
          unoptimized
        />
        <div className="ms-driver-info">
          <p className="ms-driver-name">{ride.driver_name}</p>
          <p className="ms-driver-status">
            <span className="ms-online-dot" /> Online
          </p>
          <p className="ms-driver-vehicle">
            <FaCarRear />
            {ride.brand} {ride.model} · {ride.registration_number}
          </p>
        </div>
        <div className="ms-eta-block">
          <span className="ms-eta-label">ETA to pickup</span>
          <span className="ms-eta-value">{eta}</span>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
