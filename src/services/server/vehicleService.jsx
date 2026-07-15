import getServerAxios from "@/lib/axiosServer";

export const getVehicleListApi = async () => {
  const axios = await getServerAxios();
  return axios.get("/vehicles");
};

export const getOnlyVehicleList = async () => {
  const axios = await getServerAxios();
  return axios.get("/vehicles-list");
};
