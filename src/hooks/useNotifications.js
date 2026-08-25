"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "@/services/client/notificationService";
import { getToken } from "@/lib/cookie";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const token = getToken()
   

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsApi,

    // ⭐ API will NOT be called if token doesn't exist
    enabled: !!token,

    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId) => markNotificationReadApi(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsReadApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return {
    ...notificationsQuery,

    carpoolnotifications: notificationsQuery.data?.data?.notifications || [],

    carpoolunreadCount: notificationsQuery.data?.data?.unreadCount || 0,

    carpoolmarkRead: markReadMutation.mutateAsync,

    carpoolmarkAllRead: markAllReadMutation.mutateAsync,

    carpoolmarkingRead: markReadMutation.isPending,

    carpoolmarkingAllRead: markAllReadMutation.isPending,
  };
};
