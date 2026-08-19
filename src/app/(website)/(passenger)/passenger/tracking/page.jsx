import TrackChat from "@/features/tracking/passenger/TrackChat";
import { getBookingDetailsTrack } from "@/services/server/rideService";
import React from "react";

const Page = async ({ searchParams }) => {
  const params = await searchParams;

  const bookingId = params?.bookingId;

  console.log("Booking ID:", bookingId);

  const bookingDetails = await getBookingDetailsTrack(bookingId);

  console.log("Booking details:", bookingDetails);

  return <TrackChat bookingDetails={bookingDetails} />;
};

export default Page;
