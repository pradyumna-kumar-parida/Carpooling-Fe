import getServerAxios from "@/lib/axiosServer";

export const getAllNotifications = async () => {
  const axios = await getServerAxios();
  const response = await axios.get("/notifications");
  return response.data;
};
