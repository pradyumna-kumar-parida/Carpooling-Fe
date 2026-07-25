"use client";

import { useState, useEffect } from "react";
import { MdOutlineMyLocation } from "react-icons/md";

export default function LocationPermissionModal() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const permission = sessionStorage.getItem("locationPermission");

    if (!permission) {
      setOpen(true);
    }
  }, []);

  if (!mounted) return null;

  if (!open) return null;

  const handleAllow = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        sessionStorage.setItem("locationPermission", "allowed");
        sessionStorage.setItem("userLocation", JSON.stringify(location));

        window.dispatchEvent(new Event("locationPermissionUpdated"));

        setOpen(false);

        // Optional
        // window.dispatchEvent(new Event("locationUpdated"));
      },
      (error) => {
        console.error(error);

        sessionStorage.setItem("locationPermission", "denied");

        window.dispatchEvent(new Event("locationPermissionUpdated"));

        setOpen(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleDeny = () => {
    sessionStorage.setItem("locationPermission", "denied");

    window.dispatchEvent(new Event("locationPermissionUpdated"));

    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="location-overlay">
      <div className="location-modal">
        <div className="location-icon">
          <MdOutlineMyLocation />
        </div>

        <h2>Allow Location Access?</h2>

        <p>
          Enable your location to discover nearby rides and get better pickup
          suggestions.
        </p>

        <div className="location-buttons">
          <button className="btn-secondary" onClick={handleDeny}>
            Deny
          </button>

          <button className="btn-primary" onClick={handleAllow}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
