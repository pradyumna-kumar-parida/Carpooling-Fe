// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { getNearRides } from "@/services/client/rideService";

// export const useNearRides = () => {
//   return useQuery({
//     queryKey: ["near-rides"],
//     queryFn: async () => {
//       const permission = sessionStorage.getItem("locationPermission");

//       if (permission === "allowed") {
//         const location = JSON.parse(sessionStorage.getItem("userLocation"));

//         const response = await getNearRides(
//           location.latitude,
//           location.longitude,
//         );

//         return response.data.rides || [];
//       }

//       const response = await getNearRides();

//       return response.data.rides || [];
//     },
//   });
// };
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNearRides } from "@/services/client/rideService";

export const useNearRides = () => {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    // Read on mount (handles page refresh, same as your old code)
    setPermission(sessionStorage.getItem("locationPermission"));

    // Update when the user answers the Allow/Deny prompt
    const handlePermission = () => {
      setPermission(sessionStorage.getItem("locationPermission"));
    };

    window.addEventListener("locationPermissionUpdated", handlePermission);
    return () => {
      window.removeEventListener("locationPermissionUpdated", handlePermission);
    };
  }, []);

  return useQuery({
    queryKey: ["near-rides", permission],
    queryFn: async () => {
      if (permission === "allowed") {
        const location = JSON.parse(sessionStorage.getItem("userLocation"));
        const response = await getNearRides(
          location.latitude,
          location.longitude,
        );
        return response.data.rides || [];
      }

      const response = await getNearRides();
      return response.data.rides || [];
    },
    enabled: permission !== null,
  });
};
