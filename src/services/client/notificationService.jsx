import getClientAxios from "@/lib/axiosClient";

export const registerNotificationDevice = async ({
  pushToken,
  installationId,
}) => {
  const response = await getClientAxios.post("/notifications/devices", {
    installationId,
    pushToken,
    platform: "web",
    deviceType: "desktop",
    browser: navigator.userAgent,
    appVersion: "web",
    permissionStatus: "granted",
  });

  return response.data;
};

export const getNotificationsApi = async () => {
  const response = await getClientAxios.get("/notifications");

  return response.data;
};

export const markNotificationReadApi = async (notificationId) => {
  const response = await getClientAxios.patch("/notifications/read", {
    notificationIds: notificationId,
  });

  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await getClientAxios.patch("/notifications/read-all");

  return response.data;
};
