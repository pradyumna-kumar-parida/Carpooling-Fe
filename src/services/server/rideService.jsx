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
