import getServerAxios, { getPublicAxios } from "@/lib/axiosServer";

export const getRolesApi = async () => {
  const axios = getPublicAxios();
  return axios.get("/get-roles");
};

export const getMe = async () => {
  const axios = await getServerAxios();
  return axios.get("/get-me");
};
