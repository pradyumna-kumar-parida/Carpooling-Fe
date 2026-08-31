import getServerAxios from "@/lib/axiosServer";

export const getRideDetails = async (rideId) => {
  const axios = await getServerAxios();
  const { data } = await axios.get(`/get-ride-data/${rideId}`);
  return data.ride;
};
export const getPublishedRides = async () => {
  const axios = await getServerAxios();
  return axios.get("/rides");
};
export const getUserBookings = async () => {
  const axios = await getServerAxios();
  const response = await axios.get("/my-bookings");

  return response.data;
};

export const getBookingDetailsTrack = async (bookingId) => {
  const axios = await getServerAxios();
  const response = await axios.get(`/get-booking-details/${bookingId}`);

  return response.data;
};
export const getPopularRoutes = async () => {
  const axios = await getServerAxios();
  const response = await axios.get("/top-corridors");

  return response.data;
};

export const trackRide = async (rideId) => {
  const axios = await getServerAxios();
  const response = await axios.get(`/track-ride/${rideId}`);
  return response.data;
};
