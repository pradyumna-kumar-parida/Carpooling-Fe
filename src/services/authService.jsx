import axiosInstance from "@/lib/axios";

export const loginApi = (data) => axiosInstance.post("/login", data);

export const signupApi = (data) => axiosInstance.post("/register", data);

export const getRolesApi = () => axiosInstance.get("/get-roles");

export const verifyOtpApi = (data) => axiosInstance.post("/verify-otp", data);

export const resendOtpApi = (data) => axiosInstance.post("/resend-otp", data);
