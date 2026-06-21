
export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

export const saveToken = (token) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
};

export const removeToken = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
};
