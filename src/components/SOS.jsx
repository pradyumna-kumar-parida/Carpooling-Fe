"use client";

import { useEffect, useRef, useState } from "react";
import { AiFillAlert } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import { TbCurrentLocationFilled } from "react-icons/tb";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";

import SOSIcon from "@/assets/images/SOS.png";
import Image from "next/image";
export default function SosFloating({ fallbackLat, fallbackLng }) {
  const [openSosModal, setOpenSosModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationLabel, setUserLocationLabel] = useState("");

  const handleOpenSosModal = () => setOpenSosModal(true);
  const handleCloseSosModal = () => setOpenSosModal(false);

  // Pull last known location from sessionStorage (set elsewhere in the app).
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

  // Reverse-geocode the coordinates into a human-readable address.
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
            label ||
              `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
          );
        }
      } catch (err) {
        console.warn("Failed to resolve user location label", err);
        setUserLocationLabel(
          `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`,
        );
      }
    };

    fetchLabel();
  }, [userLocation]);

  const locationDisplay =
    userLocationLabel ||
    (userLocation
      ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
      : fallbackLat != null && fallbackLng != null
        ? `${fallbackLat.toFixed(4)}, ${fallbackLng.toFixed(4)}`
        : "Location unavailable");

  return (
    <>
      {/* ---------------- Floating SOS icon ---------------- */}
      <div className="SOS-Flot" onClick={handleOpenSosModal}>
        <Image src={SOSIcon} alt="Emergency SOS" width={208} height={208} />
      </div>

      {/* ---------------- SOS modal ---------------- */}
      <Dialog
        open={openSosModal}
        onClose={handleCloseSosModal}
        maxWidth="xs"
        fullWidth
        className="sos-dialog"
      >
        <DialogTitle className="sos-dialog-title">
          <div className="sos-title-content">
            <span className="sos-title-icon">
              <AiFillAlert />
            </span>
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
                Emergency assistance has been requested. Your location is
                available to help responders assist you
              </div>
            </div>
          </div>

          <div className="sos-location-section">
            <div className="sos-section-title">
              <TbCurrentLocationFilled /> Your current location
            </div>

            <div className="sos-location-box">
              <span>{locationDisplay}</span>
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
    </>
  );
}
