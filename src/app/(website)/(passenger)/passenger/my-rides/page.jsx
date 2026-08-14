import MyRidesPage from "@/features/rides/my-ride/Rides";
import { getUserBookings } from "@/services/server/rideService";
import React from "react";

const page = async () => {
  const { data } = await getUserBookings();

  return <MyRidesPage userRides={data} />;
};

export default page;
