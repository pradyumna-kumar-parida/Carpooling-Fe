import getServerAxios from "@/lib/axiosServer";

export const getDriverEarningsApi = async () => {
  const axios = await getServerAxios();

  const { data } = await axios.get("driver/earnings");

  return data.data;
};

export const getDriverTrips = async () => {
  const axios = await getServerAxios();

  const { data } = await axios.get("rides/recent");

  return data.data;
};
