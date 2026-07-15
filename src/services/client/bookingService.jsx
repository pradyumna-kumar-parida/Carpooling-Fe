import getClientAxios from "@/lib/axiosClient";

export const bookRideApi = (data) =>
  getClientAxios.post("/create-booking", data);
