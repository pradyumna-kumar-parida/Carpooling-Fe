import getClientAxios from "@/lib/axiosClient";

export const searchLocationsApi = (data) =>
  getClientAxios.post("/search-locaton", data);

export const publishRideApi = (data) =>
  getClientAxios.post("/store-ride-data", data);

export const findRidesApi = (data) => getClientAxios.post("/find-rides", data);

export const getNearRides = (lat, lng) => {
  if (lat && lng) {
    return getClientAxios.get("/rides/upcoming", {
      params: { lat, lng },
    });
  }

  return getClientAxios.get("/rides/upcoming");
};
export const completeRideApi = (rideId) =>
  getClientAxios.patch(`/ride/${rideId}/complete`);
export const startRideApi = (rideId) =>
  getClientAxios.patch(`/ride/${rideId}/start`);
export const cancelRideApi = (rideId, data) =>
  getClientAxios.patch(`/ride/${rideId}/cancel`, data);

export const cancelBookingApi = (data) =>
  getClientAxios.post(`/passenger/cancel-booking`, data);
export const ratingApi = (data) => getClientAxios.post("/ratings", data);

export const SOSApi = (rideId, data) =>
  getClientAxios.post(`/rides/${rideId}/sos`, data);
