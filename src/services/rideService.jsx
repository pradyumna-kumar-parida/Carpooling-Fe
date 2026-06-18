import axiosInstance from "@/lib/axios";

export const searchLocationsApi = (data) =>
  axiosInstance.post("/search-locaton", data);

export const publishRideApi = (data) =>
  axiosInstance.post("/store-ride-data", data);

export const findRidesApi = (data) => axiosInstance.post("/find-rides", data);
