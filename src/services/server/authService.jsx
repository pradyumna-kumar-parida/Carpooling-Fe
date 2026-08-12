import getServerAxios, { getPublicAxios } from "@/lib/axiosServer";

export const getRolesApi = async () => {
  const axios = getPublicAxios();
  return axios.get("/get-roles");
};

export const getMe = async () => {
  const axios = await getServerAxios();
  return axios.get("/get-me");
};

export const getProfile = async () => {
  const axios = await getServerAxios();
  return axios.get("/edit-user");
};
export const CompleteProfileApi = async () => {
  const axios = await getServerAxios();
  const { data } = await axios.get("/profile-status");
  return data;
};
