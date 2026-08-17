"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { listenForForegroundMessages } from "@/lib/firebase/messaging";
import { notificationUI } from "@/lib/notifications/notification-ui";
import NotificationToast from "../../components/NotificationToast";

export default function NotificationProvider() {
  useEffect(() => {
    let unsubscribe;

    const setupNotificationListener = async () => {
      unsubscribe = await listenForForegroundMessages((payload) => {
        console.log("[Notifications] Foreground message:", payload);

        const type = payload.data?.type || "SYSTEM";

        const config = notificationUI[type] || notificationUI.SYSTEM;

        const title = payload.notification?.title || config.title;

        const body =
          payload.notification?.body || "You have a new notification.";

        toast.custom(
          (toastId) => (
            <NotificationToast
              toastId={toastId}
              icon={config.icon}
              title={title}
              body={body}
              onView={() => {
                console.log("[Notifications] View clicked:", payload);

                // Navigation will be added here.
              }}
            />
          ),
          {
            duration: 5000,
          },
        );
      });
    };

    setupNotificationListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return null;
}
