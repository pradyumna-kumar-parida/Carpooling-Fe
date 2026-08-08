// import MyRidesPage from "@/features/rides/my-ride/Rides";
// import React from "react";

// const page = () => {
//   return <MyRidesPage />;
// };

// export default page;
import PublishedRides from "@/features/rides/published-rides/Published";
import { getPublishedRides } from "@/services/server/rideService";
import React from "react";

const page = async () => {
  const { data } = await getPublishedRides();
  return <PublishedRides publishedRide={data?.data} />;
};

export default page;
