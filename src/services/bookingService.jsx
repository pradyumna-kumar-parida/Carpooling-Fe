import axiosInstance from "@/lib/axios";

export const bookRideApi = (data) =>
  axiosInstance.post("/create-booking", data);
