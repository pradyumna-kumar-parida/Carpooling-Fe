import PublishedRides from "@/features/rides/my-ride/driver/Published";
import { getPublishedRides } from "@/services/server/rideService";
import React from "react";

const page = async () => {
  const { data } = await getPublishedRides();
  return <PublishedRides publishedRide={data?.data} />;
};

export default page;
