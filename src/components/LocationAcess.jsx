
"use client";

import { useEffect } from "react";

export default function LocationPermission() {
  useEffect(() => {
    if (!navigator.geolocation) return;
    console.log("Requesting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sessionStorage.setItem("locationPermission", "allowed");

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        sessionStorage.setItem("userLocation", JSON.stringify(location));

        window.dispatchEvent(new Event("locationPermissionUpdated"));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          sessionStorage.setItem("locationPermission", "denied");
          window.dispatchEvent(new Event("locationPermissionUpdated"));
        }
      }
    );
  }, []);

  return null;
}