"use client";

import { getFCMToken } from "@/lib/firebase/messaging";

import { getInstallationId } from "./installation";
import { registerNotificationDevice } from "@/services/client/notificationService";



export const registerBrowserForNotifications = async () => {
  try {
    console.log("[Notifications] Starting registration...");

    // 1. Get FCM token
    const pushToken = await getFCMToken();

    if (!pushToken) {
      return {
        success: false,
        message: "FCM token could not be generated.",
      };
    }

    console.log("[Notifications] FCM token received.");

    // 2. Get browser installation ID
    const installationId = getInstallationId();

    if (!installationId) {
      return {
        success: false,
        message: "Installation ID could not be generated.",
      };
    }

    console.log("[Notifications] Installation ID:", installationId);

    // 3. Send token to backend
    const response = await registerNotificationDevice({
      pushToken,
      installationId,
    });

    console.log("[Notifications] Device registered:", response);

    return {
      success: true,
      token: pushToken,
      installationId,
      data: response,
    };
  } catch (error) {
    console.error("[Notifications] Registration failed:", error);

    console.error("[Notifications] Backend response:", error?.response?.data);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to register notification device.",
    };
  }
};
