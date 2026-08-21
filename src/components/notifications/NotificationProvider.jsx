"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { listenForForegroundMessages } from "@/lib/firebase/messaging";
import { notificationUI } from "@/lib/notifications/notification-ui";
import NotificationToast from "../../components/NotificationToast";

export default function NotificationProvider() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe;

    const setupNotificationListener = async () => {
      unsubscribe = await listenForForegroundMessages((payload) => {
        console.log("[Notifications] Foreground message:", payload);

        // 🔥 Refresh notification data
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });

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
  }, [queryClient]);

  return null;
}
