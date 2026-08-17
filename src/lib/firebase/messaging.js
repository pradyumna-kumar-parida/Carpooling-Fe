"use client";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

import firebaseApp from "./config";

const registerFirebaseServiceWorker = async () => {
  console.log("[FCM] Registering service worker...");

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  await navigator.serviceWorker.ready;

  console.log("[FCM] Service worker ready:", registration.scope);

  return registration;
};

export const getFCMToken = async () => {
  try {
    console.log("[FCM] Starting notification setup...");

    if (typeof window === "undefined") {
      return null;
    }

    if (!("Notification" in window)) {
      console.error("[FCM] Notification API unavailable.");

      return null;
    }

    console.log("[FCM] Browser:", navigator.userAgent);

    console.log("[FCM] Notification permission:", Notification.permission);

    const supported = await isSupported();

    console.log("[FCM] Messaging supported:", supported);

    if (!supported) {
      return null;
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    console.log("[FCM] VAPID key exists:", Boolean(vapidKey));

    console.log("[FCM] VAPID key length:", vapidKey?.length);

    if (!vapidKey) {
      throw new Error("NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing.");
    }

    const permission = await Notification.requestPermission();

    console.log("[FCM] Permission result:", permission);

    if (permission !== "granted") {
      return null;
    }

    const serviceWorkerRegistration = await registerFirebaseServiceWorker();

    console.log("[FCM] Creating messaging instance...");

    const messaging = getMessaging(firebaseApp);

    console.log("[FCM] Calling getToken...");

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    console.log("[FCM] Token:", token);

    return token || null;
  } catch (error) {
    console.error("[FCM] Failed:", error);

    console.error("[FCM] Error name:", error?.name);

    console.error("[FCM] Error message:", error?.message);

    return null;
  }
};

export const listenForForegroundMessages = async (callback) => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const supported = await isSupported();

    if (!supported) {
      return null;
    }

    const messaging = getMessaging(firebaseApp);

    return onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message:", payload);

      callback?.(payload);
    });
  } catch (error) {
    console.error("[FCM] Foreground listener error:", error);

    return null;
  }
};
