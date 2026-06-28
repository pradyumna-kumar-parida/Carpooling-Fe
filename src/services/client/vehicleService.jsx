import getClientAxios from "@/lib/axiosClient";

export const vehicleRegistrationApi = (data) =>
  getClientAxios.post("/store-vehicle-data", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const vehicleDetailUpdateApi = (data) =>
  getClientAxios.post("/upadte-vehicle-detail", data);
