"use client";

import { useMemo, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  DirectionsService,
  useJsApiLoader,
} from "@react-google-maps/api";
import { renderToStaticMarkup } from "react-dom/server";
const containerStyle = {
  width: "100%",
  height: "100%",
};
import { FaLocationDot } from "react-icons/fa6";
export default function BookingRouteMap({
  sourceLat,
  sourceLng,
  destinationLat,
  destinationLng,
  sourceAddress,
  destinationAddress,
}) {
  const [directions, setDirections] = useState(null);

  const source = useMemo(
    () => ({
      lat: Number(sourceLat),
      lng: Number(sourceLng),
    }),
    [sourceLat, sourceLng],
  );

  const destination = useMemo(
    () => ({
      lat: Number(destinationLat),
      lng: Number(destinationLng),
    }),
    [destinationLat, destinationLng],
  );

  const center = useMemo(
    () => ({
      lat: (source.lat + destination.lat) / 2,
      lng: (source.lng + destination.lng) / 2,
    }),
    [source, destination],
  );

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const directionsRequest = useMemo(
    () => ({
      origin: source,
      destination: destination,
      travelMode: "DRIVING",
    }),
    [source, destination],
  );

  const handleDirectionsCallback = (result, status) => {
    if (status === "OK") {
      setDirections(result);
    } else {
      console.error("Google Maps route error:", status);
    }
  };

  if (loadError) {
    return <div className="booking-map-error">Unable to load Google Maps.</div>;
  }

  if (!isLoaded) {
    return <div className="booking-map-loading">Loading map...</div>;
  }
  const createMarkerIcon = (color) => {
    const svg = renderToStaticMarkup(
      <FaLocationDot
        style={{
          color,
          fontSize: "20px",
        }}
      />,
    );

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: new window.google.maps.Point(15, 30),
    };
  };
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
        clickableIcons: false,
      }}
    >
      {/* Get actual road route */}
      {!directions && (
        <DirectionsService
          options={directionsRequest}
          callback={handleDirectionsCallback}
        />
      )}

      {/* Draw actual Google route */}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "#1769ff",
              strokeOpacity: 1,
              strokeWeight: 5,
            },
          }}
        />
      )}

      {/* GREEN SOURCE MARKER */}
     <MarkerF
  position={source}
  title={`Pickup: ${sourceAddress || ""}`}
  icon={createMarkerIcon("#16a34a")}
/>

<MarkerF
  position={destination}
  title={`Drop: ${destinationAddress || ""}`}
  icon={createMarkerIcon("#dc2626")}
/>
    </GoogleMap>
  );
}
