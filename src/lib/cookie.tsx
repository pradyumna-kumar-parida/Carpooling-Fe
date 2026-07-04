import Cookies from "js-cookie";

export const setAuthCookies = (token: string, role: string): void => {
  Cookies.set("token", token, { expires: 7, path: "/" });
  Cookies.set("role", role, { expires: 7, path: "/" });
};

export const clearAuthCookies = (): void => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("role", { path: "/" });
};

export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

export const getRole = (): string | undefined => {
  return Cookies.get("role");
};
