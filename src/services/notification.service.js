import axiosInstance from "@/lib/axiosClient";

export const registerNotificationDevice = async ({
  pushToken,
  installationId,
}) => {
  const response = await axiosInstance.post(
    "/notifications/devices",
    {
      installationId,
      pushToken,
      platform: "web",
      deviceType: "desktop",
      browser: navigator.userAgent,
      appVersion: "web",
      permissionStatus: "granted",
    }
  );

  return response.data;
};