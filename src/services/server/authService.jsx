import getServerAxios from "@/lib/axiosServer";

export const getRolesApi = async () => {
  const axios = await getServerAxios();
  return axios.get("/get-roles");
};

