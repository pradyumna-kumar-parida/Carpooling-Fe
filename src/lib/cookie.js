// utils/cookie.js

import Cookies from "js-cookie";

export const setAuthCookies = (token, role) => {
  Cookies.set("token", token, { expires: 7, path: "/" });
  Cookies.set("role", role, { expires: 7, path: "/" });
};

export const clearAuthCookies = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });
};
export const getToken = () => {
  return Cookies.get("token");
};

export const getRole = () => {
  return Cookies.get("role");
};
