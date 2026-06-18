import axiosInstance from "@/lib/axios";

export const getVehicleListApi = () => axiosInstance.get("/vehicles");

export const vehicleRegistrationApi = (data) =>
  axiosInstance.post("/store-vehicle-data", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const vehicleDetailUpdateApi = (data) =>
  axiosInstance.post("/upadte-vehicle-detail", data);
