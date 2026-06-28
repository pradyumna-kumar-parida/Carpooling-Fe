import getClientAxios from "@/lib/axiosClient";

export const searchLocationsApi = (data) =>
  getClientAxios.post("/search-locaton", data);

export const publishRideApi = (data) =>
  getClientAxios.post("/store-ride-data", data);

export const findRidesApi = (data) => getClientAxios.post("/find-rides", data);
