// import axios from "axios";
// import { cookies } from "next/headers";

// const getServerAxios = async () => {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("token")?.value;

//   const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (token) {
//     axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
//   }

//   return axiosInstance;
// };

// export default getServerAxios;

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
export default getServerAxios;
