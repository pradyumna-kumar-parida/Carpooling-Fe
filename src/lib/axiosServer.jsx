

import axios from "axios";
import { cookies } from "next/headers";

const getServerAxios = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });
};

const getPublicAxios = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default getServerAxios;
export { getPublicAxios };
