import getClientAxios from "@/lib/axiosClient";

export const bookRideApi = (data) =>
  getClientAxios.post("/create-booking", data);

export const paymentApi = (data) =>
  getClientAxios.post("/payment-success", data);

export const paymentFailedApi = (data) =>
  getClientAxios.post("/payment-failed", data);
