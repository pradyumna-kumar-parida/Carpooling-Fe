"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { FaCarRear } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { FiPlus, FiMinus, FiMaximize } from "react-icons/fi";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import trackingCar from "@/assets/images/trackingCar.png";
import { decodePolyline } from "../utils/Decodepolyline";

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", dot: "#1a56db" },
  driver_on_way: { label: "Driver On The Way", dot: "#d97706" },
  arrived: { label: "Driver Arrived", dot: "#059669" },
  in_progress: { label: "In Progress", dot: "#7c3aed" },
  completed: { label: "Completed", dot: "#16a34a" },
};

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

/* ------------------------------------------------------------------ */
/*  Rotating "nav camera" tuning — same trick as the driver page.      */
/*  Leaflet has no native map-rotation, so the map renders inside an   */
/*  oversized hidden container and that container gets CSS-rotated so  */
/*  the direction of travel always points "up" (Google-Maps nav mode). */
/*  Because the container is bigger than the visible window, every     */
/*  zoom Leaflet computes must be bumped up by log2(MAP_OVERSIZE_FACTOR)*/
/*  or the map looks too zoomed out. Keep this in sync with the        */
/*  260% / -80% sizing on .ms-map-rotor in the CSS.                    */
/* ------------------------------------------------------------------ */
const MAP_OVERSIZE_FACTOR = 2.6;
const MAP_ZOOM_COMPENSATION = Math.log2(MAP_OVERSIZE_FACTOR);

/**
 * `liveDriverPosition`: { lat, lng } | null
 *   Leave this null for now. Once Socket.IO is wired up on the parent,
 *   push live coordinates here — the marker will jump to each new point
 *   (bearing computed from the previous point), the map will rotate to
 *   keep the new direction of travel pointing up, the travelled/remaining
 *   route split will re-slice at the nearest point on the road, and any
 *   simulated interval movement stops permanently. No changes needed in
 *   this file when that happens.
 */
const MapPanel = ({
  ride,
  rideStatus,
  trackingEnabled,
  mapFullscreen,
  setMapFullscreen,
  formatDate,
  formatTime,
  liveDriverPosition = null,
}) => {
  const mapRef = useRef(null);
  const mapRotorRef = useRef(null); // oversized div that gets CSS-rotated
  const mapInstanceRef = useRef(null);
  const leafletRef = useRef(null); // holds the dynamically-imported `L` module
  const driverMarkerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeCoordsRef = useRef([]);
  const moveIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const completedRouteRef = useRef(null);
  const remainingRouteRef = useRef(null);
  const lastLivePosRef = useRef(null); // previous live lat/lng, for bearing calc
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

  // Bearing (degrees, 0 = north) from point a to point b
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

  /* ---- Rotation helpers -------------------------------------------- */

  // Rotates the whole map so `rawBearingDeg` (raw direction of travel,
  // 0 = north) points to the top of the screen, then counter-rotates the
  // pickup/destination pins so they stay upright instead of spinning
  // with the map — matches Google Maps nav-mode behaviour.
  const applyMapRotation = useCallback((rawBearingDeg) => {
    if (mapRotorRef.current) {
      mapRotorRef.current.style.transform = `rotate(${-rawBearingDeg}deg)`;
    }
    updatePinRotation(pickupMarkerRef, rawBearingDeg);
    updatePinRotation(destMarkerRef, rawBearingDeg);
  }, []);

  function updatePinRotation(markerRef, angleDeg) {
    const el = markerRef.current?.getElement();
    const rotor = el?.querySelector(".ms-pin-rotor");
    if (rotor) rotor.style.transform = `rotate(${angleDeg}deg)`;
  }

  // Directly manipulates the marker's own DOM (instead of calling
  // setIcon()) so the rotation animates smoothly via CSS transition
  // instead of flickering on every tick.
  const updateCarRotation = (angleDeg) => {
    const el = driverMarkerRef.current?.getElement();
    const dot = el?.querySelector(".ms-car-dot");
    if (dot) dot.style.transform = `rotate(${angleDeg}deg)`;
  };

  const carIcon = (L, angle = 0) =>
    L.divIcon({
      className: "",
      html: `
      <div class="ms-car-marker">
        <span class="ms-car-pulse"></span>
        <div class="ms-car-dot" style="transform: rotate(${angle + 180}deg)">
          <img src="${trackingCar.src}" width="28" height="28" alt="" />
        </div>
      </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
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

  const findNearestIndex = (coords, point) => {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    coords.forEach((c, i) => {
      const d = distanceKm(c, point);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });
    return nearestIdx;
  };

  // ---- Simulated movement (demo fallback, used only while no live
  // socket position is coming in) — steps the marker along the
  // decoded/fetched route one point per second, rotating the nav
  // camera and following the car as it goes. ---------------------------
  const startDriverMovement = (map, L) => {
    clearInterval(intervalRef.current);
    const coords = routeCoordsRef.current;
    if (!coords.length) return;

    moveIndexRef.current = 0;

    const initialBearing =
      coords.length > 1 ? bearing(coords[0], coords[1]) : 0;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
    }
    driverMarkerRef.current = L.marker(coords[0], {
      icon: carIcon(L, initialBearing),
    }).addTo(map);

    intervalRef.current = setInterval(() => {
      // A live position has started arriving — hand control over to it
      // and stop simulating.
      if (liveDriverPosition) {
        clearInterval(intervalRef.current);
        return;
      }

      const idx = moveIndexRef.current;
      if (idx >= coords.length - 1) {
        clearInterval(intervalRef.current);
        return;
      }

      const current = coords[idx];
      const next = coords[idx + 1];
      const angle = bearing(current, next);

      driverMarkerRef.current.setLatLng(next);
      updateCarRotation(angle + 180);

      const travelled = coords.slice(0, idx + 2);
      const remaining = coords.slice(idx + 1);
      completedRouteRef.current.setLatLngs(travelled);
      remainingRouteRef.current.setLatLngs(remaining);

      // Nav-camera: rotate the whole map so the direction of travel
      // points up, and keep the pickup/destination pins upright.
      applyMapRotation(angle);

      // Keep the car centred in view as it advances.
      map.panTo(next, {
        animate: true,
        duration: 1,
        easeLinearity: 1,
      });

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

  // ---- Route resolution: prefer the backend polyline, fall back to a
  // live OSRM lookup, fall back to a straight line. --------------------
  const resolveRouteCoords = async (srcLat, srcLng, dstLat, dstLng) => {
    if (ride.polyline) {
      const decoded = decodePolyline(ride.polyline);
      if (decoded.length > 1) return decoded;
    }

    try {
      const res = await fetch(
        `${OSRM_URL}/${srcLng},${srcLat};${dstLng},${dstLat}?overview=full&geometries=geojson`,
      );
      const data = await res.json();
      const geo = data?.routes?.[0]?.geometry?.coordinates;
      if (geo?.length) return geo.map(([lng, lat]) => [lat, lng]);
    } catch (e) {
      // fall through to straight line
    }

    return [
      [srcLat, srcLng],
      [dstLat, dstLng],
    ];
  };

  const drawRoute = async (map, L, srcLat, srcLng, dstLat, dstLng) => {
    const coords = await resolveRouteCoords(srcLat, srcLng, dstLat, dstLng);
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
    map.setZoom(map.getZoom() + MAP_ZOOM_COMPENSATION, { animate: false });

    // Orient the nav camera for the very first frame: direction of
    // travel points up, source sits behind, destination ahead — same
    // math the live ticker uses below.
    const startBearing = coords.length > 1 ? bearing(coords[0], coords[1]) : 0;
    applyMapRotation(startBearing);

    // Seed the ETA/distance display: prefer the backend-provided
    // distance_meters/duration_seconds for the very first paint (most
    // authoritative), then let live route-based computation take over
    // as the marker moves.
    if (ride.distance_meters != null) {
      const km = ride.distance_meters / 1000;
      setDistanceLeft(
        km < 1 ? `${ride.distance_meters} m` : `${km.toFixed(1)} km`,
      );
    } else {
      const { km } = remainingDistanceAndEta(0);
      setDistanceLeft(
        km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
      );
    }

    if (ride.duration_seconds != null) {
      setEta(`${Math.max(1, Math.round(ride.duration_seconds / 60))} min`);
    } else {
      const { etaMin } = remainingDistanceAndEta(0);
      setEta(`${etaMin} min`);
    }

    if (trackingEnabled && !liveDriverPosition) {
      startDriverMovement(map, L);
    } else if (liveDriverPosition) {
      // A live position is already available on first paint.
      const pos = [liveDriverPosition.lat, liveDriverPosition.lng];
      driverMarkerRef.current = L.marker(pos, {
        icon: carIcon(L, startBearing),
      }).addTo(map);
      lastLivePosRef.current = pos;
      map.panTo(pos, { animate: true, duration: 1 });
    }

    // Leaflet reads the container's pixel size the instant L.map() runs.
    // In Next.js the container can still be 0x0 at that moment
    // (stylesheet/hydration timing), which leaves the oversized rotor
    // stuck mis-sized. Forcing a size recheck once layout has actually
    // settled fixes it, and the ResizeObserver keeps it correct through
    // later layout changes (sidebar collapse, fullscreen toggle, etc).
    requestAnimationFrame(() => {
      const m = mapInstanceRef.current;
      if (!m) return;
      m.invalidateSize();
      m.fitBounds(coords, { padding: [60, 60] });
      m.setZoom(m.getZoom() + MAP_ZOOM_COMPENSATION, { animate: false });
      applyMapRotation(startBearing);
    });
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
      leafletRef.current = L;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const srcLat = parseFloat(ride.source_lat);
      const srcLng = parseFloat(ride.source_lng);
      const dstLat = parseFloat(ride.destination_lat);
      const dstLng = parseFloat(ride.destination_lng);

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        // Fractional zoom so we can precisely compensate for the
        // oversized rotor container (see MAP_ZOOM_COMPENSATION above).
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        // Dragging is disabled on purpose: once the map is CSS-rotated,
        // a manual drag gesture no longer matches the screen direction.
        // The recenter / zoom buttons below remain fully functional.
        dragging: false,
      }).setView([(srcLat + dstLat) / 2, (srcLng + dstLng) / 2], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      const pickupIcon = L.divIcon({
        className: "",
        html: `<div class="ms-pin-rotor"><div style="color:#16a34a; font-size:28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${renderToStaticMarkup(<IoLocationSharp />)}</div></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28], // bottom-center, since a location pin's tip points down
      });

      const destIcon = L.divIcon({
        className: "",
        html: `<div class="ms-pin-rotor"><div style="color:#dc2626; font-size:32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">${renderToStaticMarkup(<IoLocationSharp />)}</div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      pickupMarkerRef.current = L.marker([srcLat, srcLng], {
        icon: pickupIcon,
      })
        .addTo(map)
        .bindPopup(`<b>Pickup</b><br/>${ride.source_address}`)
        .openPopup();

      destMarkerRef.current = L.marker([dstLat, dstLng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>Drop</b><br/>${ride.destination_address}`);

      drawRoute(map, L, srcLat, srcLng, dstLat, dstLng);

      const resizeObserver = new ResizeObserver(() => {
        mapInstanceRef.current?.invalidateSize();
      });
      resizeObserver.observe(mapRef.current);
      mapInstanceRef.current._msResizeObserver = resizeObserver;
    };

    initMap();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      clearInterval(intervalRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current._msResizeObserver?.disconnect();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride, mapFullscreen, trackingEnabled]);

  // ---- Live position updates (Socket.IO-ready) ------------------------
  // Whenever `liveDriverPosition` changes, move the marker directly to
  // that coordinate, rotate the nav camera to the new heading, and
  // re-slice the travelled/remaining polylines at the nearest point on
  // the route. Any simulated interval movement is stopped for good.
  useEffect(() => {
    if (!liveDriverPosition || !mapInstanceRef.current || !leafletRef.current) {
      return;
    }

    clearInterval(intervalRef.current);

    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const newPos = [liveDriverPosition.lat, liveDriverPosition.lng];
    const prevPos = lastLivePosRef.current;
    const angle = prevPos ? bearing(prevPos, newPos) : 0;

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker(newPos, {
        icon: carIcon(L, angle),
      }).addTo(map);
    } else {
      driverMarkerRef.current.setLatLng(newPos);
      updateCarRotation(angle + 180);
    }

    lastLivePosRef.current = newPos;
    applyMapRotation(angle);

    const coords = routeCoordsRef.current;
    if (
      coords.length &&
      completedRouteRef.current &&
      remainingRouteRef.current
    ) {
      const nearestIdx = findNearestIndex(coords, newPos);
      completedRouteRef.current.setLatLngs(coords.slice(0, nearestIdx + 1));
      remainingRouteRef.current.setLatLngs(coords.slice(nearestIdx));

      const { km, etaMin } = remainingDistanceAndEta(nearestIdx);
      if (isMountedRef.current) {
        setDistanceLeft(
          km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
        );
        setEta(`${etaMin} min`);
      }
    }

    map.panTo(newPos, { animate: true, duration: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveDriverPosition?.lat, liveDriverPosition?.lng]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const map = mapInstanceRef.current;
      if (!map) return;
      map.invalidateSize();
      const coords = routeCoordsRef.current;
      if (coords.length) {
        map.fitBounds(coords, { padding: [60, 60] });
        map.setZoom(map.getZoom() + MAP_ZOOM_COMPENSATION, { animate: false });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [mapFullscreen]);

  const zoomIn = useCallback(() => mapInstanceRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => mapInstanceRef.current?.zoomOut(), []);
  const recenter = useCallback(() => {
    if (!mapInstanceRef.current || !driverMarkerRef.current) return;
    mapInstanceRef.current.flyTo(
      driverMarkerRef.current.getLatLng(),
      14 + MAP_ZOOM_COMPENSATION,
      { duration: 0.6 },
    );
  }, []);

  return (
    <div className="ms-container">
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

      {/* Oversized rotor: CSS-rotated so the direction of travel always
          points up, like Google Maps nav mode. The wrap clips the
          overflow so no empty corners show. */}
      <div className="ms-map-wrap">
        <div ref={mapRotorRef} className="ms-map-rotor">
          <div ref={mapRef} className="ms-map" />
        </div>
      </div>

      {/* Zoom / recenter — dragging is off, so these are the only way
          to move around once the map is rotating. */}
      <div className="ms-map-controls">
        <button
          onClick={recenter}
          className="ms-map-btn"
          type="button"
          aria-label="Recenter"
        >
          <FiMaximize size={16} />
        </button>
        <button
          onClick={zoomIn}
          className="ms-map-btn"
          type="button"
          aria-label="Zoom in"
        >
          <FiPlus size={16} />
        </button>
        <button
          onClick={zoomOut}
          className="ms-map-btn"
          type="button"
          aria-label="Zoom out"
        >
          <FiMinus size={16} />
        </button>
      </div>

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
