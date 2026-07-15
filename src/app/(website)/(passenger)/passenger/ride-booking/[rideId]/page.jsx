import RideBooking from "@/features/booking/booked-rides/RideBooking";
import { getRideDetails } from "@/services/server/rideService";

import React from "react";

const page = async ({ params, searchParams }) => {
  const { seats } = await searchParams;
  const { rideId } = await params;
  const rideDetails = await getRideDetails(rideId);
  return <RideBooking rideDetails={rideDetails} totalSeat={seats} />;
};

export default page;
