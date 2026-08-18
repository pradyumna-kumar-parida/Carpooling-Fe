import getClientAxios from "@/lib/axiosClient";

export const loginApi = (data) => getClientAxios.post("/login", data);

export const signupApi = (data, config = {}) =>
  getClientAxios.post("/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

export const verifyOtpApi = (data) => getClientAxios.post("/verify-otp", data);

export const resendOtpApi = (data) => getClientAxios.post("/resend-otp", data);
export const UpdateProfilepApi = (data) =>
  getClientAxios.post("/update-user-details", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const uploadProfileApi = (data) =>
  getClientAxios.post("/upload-profile-image", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
