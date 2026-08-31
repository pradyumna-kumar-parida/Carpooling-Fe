import DriverActiveRide from "@/features/tracking/driver/DriverTracking";
import { trackRide } from "@/services/server/rideService";
import React from "react";

const page = async ({ searchParams }) => {
  const params = await searchParams;

  const rideId = params?.rideId;

  console.log("ride ID:", rideId);
  const data = await trackRide(rideId);
  console.log("track data is ", data.data);

  return <DriverActiveRide trackRideData={data.data} />;
};

export default page;
