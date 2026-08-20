"use client";

import { useState, useEffect, useMemo } from "react";

import MapPanel from "./components/MapPanel";
import RideDetailsCard from "./components/RideDetailsCard";
import DriverDetailsCard from "./components/DriverDetailsCard";
import RideStatusCard from "./components/RideStatusCard";
import HelpSupportCard from "./components/HelpSupportCard";
import ChatPanel from "../../chat/ChatPanel";

import "@/styles/track-chat.css";
import SosFloating from "@/components/SOS";

/* ------------------------------------------------------------------ */
/*  Fallback demo data                                                 */
/*  Used only for fields the API response doesn't (yet) provide, so    */
/*  the page never blank-screens while `bookingDetails` is loading.    */
/* ------------------------------------------------------------------ */
const FALLBACK_RIDE = {
  id: 14,
  source_address: "Vani Vihar, Bhubaneswar, Odisha, India",
  destination_address: "Jaydev Vihar, Bhubaneswar, Odisha, India",
  source_lat: "20.3039745",
  source_lng: "85.8396655",
  destination_lat: "20.2997267",
  destination_lng: "85.8172637",
  polyline: null,
  ride_date: "2026-06-03",
  departure_time: "03:30:00",
  estimated_reach_time: "06:40:00",
  price_per_seat: "132.00",
  distance_meters: null,
  duration_seconds: null,
  status: null,
  driver_name: "Suraj Kumar",
  driver_phone: "1242179918",
  driver_profile_picture:
    "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_640.jpg",
  driver_rating: "4.8",
  brand: "Maruti",
  model: "Swift Dzire",
  registration_number: "OD02 AB 1234",
  vehicle_type: "Car",
  fuel_type: "Petrol",
};

const STEP_KEYS = [
  "scheduled",
  "driver_on_way",
  "arrived",
  "in_progress",
  "completed",
];

const BOOKING_BADGE = {
  confirmed: { label: "Confirmed", className: "badge-blue" },
  pending: { label: "Pending", color: "#d97706" },
  completed: { label: "Completed", color: "#16a34a" },
  cancelled: { label: "Cancelled", color: "#dc2626" },
};

/**
 * `bookingDetails` is the raw API response:
 *   {
 *     status: "success",
 *     ride: { ...ride fields, vehicle_details: {...}, driver_details: {...} },
 *     data: { ...booking fields, passenger_details: {...} },
 *   }
 *
 * `liveDriverPosition` (optional): { lat, lng } | null
 *   Once you wire Socket.IO on this page, push live coordinates here and
 *   they'll flow straight into MapPanel — no map logic changes needed.
 */
const TrackChat = ({ bookingDetails, liveDriverPosition = null }) => {
  const apiRide = bookingDetails?.ride ?? null;
  const apiBooking = bookingDetails?.data ?? null;
  const driver = apiRide?.driver_details ?? null;
  const vehicle = apiRide?.vehicle_details ?? null;

  // Flatten the nested API shape into the single `rideData` object every
  // card below already knows how to render, falling back field-by-field
  // to the demo data so a partially-populated response never breaks the UI.
  const rideData = useMemo(() => {
    if (!apiRide) return FALLBACK_RIDE;

    return {
      id: apiRide.id ?? FALLBACK_RIDE.id,
      source_address: apiRide.source_address ?? FALLBACK_RIDE.source_address,
      destination_address:
        apiRide.destination_address ?? FALLBACK_RIDE.destination_address,
      source_lat: apiRide.source_lat ?? FALLBACK_RIDE.source_lat,
      source_lng: apiRide.source_lng ?? FALLBACK_RIDE.source_lng,
      destination_lat: apiRide.destination_lat ?? FALLBACK_RIDE.destination_lat,
      destination_lng: apiRide.destination_lng ?? FALLBACK_RIDE.destination_lng,
      // Backend-provided encoded route — this is what actually draws the
      // real road path on the map (see MapPanel). No polyline → the map
      // falls back to a live OSRM lookup, then to a straight line.
      polyline: apiRide.polyline ?? null,
      ride_date: apiRide.ride_date ?? FALLBACK_RIDE.ride_date,
      departure_time: apiRide.departure_time ?? FALLBACK_RIDE.departure_time,
      estimated_reach_time:
        apiRide.estimated_reach_time ?? FALLBACK_RIDE.estimated_reach_time,
      price_per_seat: apiRide.price_per_seat ?? FALLBACK_RIDE.price_per_seat,
      distance_meters: apiRide.distance_meters ?? null,
      duration_seconds: apiRide.duration_seconds ?? null,
      status: apiRide.status ?? null,
      driver_name: driver?.name ?? FALLBACK_RIDE.driver_name,
      driver_phone: driver?.phone ?? FALLBACK_RIDE.driver_phone,
      driver_profile_picture:
        driver?.profile_picture ?? FALLBACK_RIDE.driver_profile_picture,
      driver_rating: vehicle?.rating ?? FALLBACK_RIDE.driver_rating,
      brand: vehicle?.brand ?? FALLBACK_RIDE.brand,
      model: vehicle?.model ?? FALLBACK_RIDE.model,
      registration_number:
        vehicle?.registration_number ?? FALLBACK_RIDE.registration_number,
      vehicle_type: vehicle?.vehicle_type ?? FALLBACK_RIDE.vehicle_type,
      fuel_type: vehicle?.fuel_type ?? FALLBACK_RIDE.fuel_type,
    };
  }, [apiRide, driver, vehicle]);

  const seatsBooked = apiBooking?.seats ?? 3;

  const bookingId = apiBooking?.booking_code ?? apiBooking?.id ?? "BKG88364";

  const amountPaid = apiBooking?.total_price
    ? parseFloat(apiBooking.total_price).toFixed(2)
    : (parseFloat(rideData.price_per_seat || 0) * seatsBooked).toFixed(2);

  const bookingStatus =
    BOOKING_BADGE[apiBooking?.status?.toLowerCase()] || BOOKING_BADGE.confirmed;

  // -------------------------------------------------------
  // Ride Status
  // -------------------------------------------------------
  const getRideStatus = () => {
    // Once the driver has actually progressed the ride (on the way,
    // arrived, in progress, completed…) the backend status is the source
    // of truth — trust it completely.
    const apiStatus = rideData.status?.toLowerCase();
    if (
      apiStatus &&
      apiStatus !== "scheduled" &&
      STEP_KEYS.includes(apiStatus)
    ) {
      return apiStatus;
    }

    // Before the driver has taken any action, estimate from the scheduled
    // departure time so the UI still progresses on its own.
    if (!rideData.ride_date || !rideData.departure_time) return "scheduled";

    const now = new Date();
    const rideDateTime = new Date(
      `${rideData.ride_date}T${rideData.departure_time}`,
    );
    const diffMins = (rideDateTime - now) / 60000;

    if (diffMins > 30) return "scheduled";
    if (diffMins > 0) return "driver_on_way";
    if (diffMins > -10) return "arrived";
    if (diffMins > -120) return "in_progress";
    return "completed";
  };

  const [rideStatus, setRideStatus] = useState(getRideStatus());
  const [mapFullscreen, setMapFullscreen] = useState(false);

  useEffect(() => {
    setRideStatus(getRideStatus());
    const interval = setInterval(() => {
      setRideStatus(getRideStatus());
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideData.status, rideData.ride_date, rideData.departure_time]);

  /* -----------------------------------------------------------------
   *  Socket.IO hookup point (future — not wired up yet):
   *
   *  const [liveDriverPosition, setLiveDriverPosition] = useState(null);
   *
   *  useEffect(() => {
   *    const socket = io(SOCKET_URL);
   *    socket.on(`ride:${rideData.id}:location`, ({ lat, lng }) => {
   *      setLiveDriverPosition({ lat, lng });
   *    });
   *    return () => socket.disconnect();
   *  }, [rideData.id]);
   *
   *  `liveDriverPosition` is already threaded through to MapPanel below
   *  (currently via a prop, defaulting to null) — wiring the socket up
   *  later needs no changes to the map/marker logic itself.
   * ----------------------------------------------------------------- */

  const isTrackingEnabled = () => {
    if (!rideData.ride_date || !rideData.departure_time) return false;
    const now = new Date();
    const rideDateTime = new Date(
      `${rideData.ride_date}T${rideData.departure_time}`,
    );
    return (rideDateTime - now) / 60000 <= 30;
  };

  // Deterministic, locale-independent formatting.
  //
  // `toLocaleDateString`/`toLocaleTimeString` pull their output from the
  // JS engine's ICU data, which is not guaranteed to match between the
  // server (Node) and the browser (client) — e.g. Node renders "11:32 AM"
  // while a browser can render "11:32 am" for the exact same Date. React
  // then sees server HTML that doesn't match what the client would render
  // and throws a hydration-mismatch error. Building the string manually
  // with fixed casing sidesteps that entirely, since it can never differ
  // between environments.
  const MONTH_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "-";
    return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatTime = (time) => {
    if (!time) return "-";
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return "-";

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return "-";
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  const formatDistance = (meters) => {
    if (meters === null || meters === undefined) return "-";
    const km = meters / 1000;
    return km < 1 ? `${meters} m` : `${km.toFixed(1)} km`;
  };

  return (
    <div className="tc-page">
      <SosFloating
        fallbackLat={parseFloat(rideData.source_lat)}
        fallbackLng={parseFloat(rideData.source_lng)}
      />
      <div className={`tc-wrapper ${mapFullscreen ? "tc-fullscreen" : ""}`}>
        {/* LEFT — MAP */}
        <div className="tc-map-col">
          <MapPanel
            ride={rideData}
            rideStatus={rideStatus}
            trackingEnabled={isTrackingEnabled()}
            mapFullscreen={mapFullscreen}
            setMapFullscreen={setMapFullscreen}
            formatDate={formatDate}
            formatTime={formatTime}
            liveDriverPosition={liveDriverPosition}
          />
        </div>

        {/* RIGHT PANEL */}
        {!mapFullscreen && (
          <div className="tc-right-col">
            <div className="tc-right-scroll">
              <RideDetailsCard
                ride={rideData}
                bookingId={bookingId}
                amountPaid={amountPaid}
                seatsBooked={seatsBooked}
                formatDate={formatDate}
                formatTime={formatTime}
                travelTime={formatDuration(rideData.duration_seconds)}
                distanceLabel={formatDistance(rideData.distance_meters)}
                bookingStatus={bookingStatus}
              />

              <DriverDetailsCard driver={rideData} />

              <RideStatusCard rideStatus={rideStatus} />

              <HelpSupportCard />
            </div>

            {/* <ChatPanel driver={rideData} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackChat;
