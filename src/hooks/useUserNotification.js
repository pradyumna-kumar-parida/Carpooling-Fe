"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "@/lib/socket";

export const useUserNotification = (onNotification) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket.connected) {
        console.log("🔌 User logged out - disconnecting socket");
        socket.disconnect();
      }

      return;
    }

    const userId = user?.id || user?.user_id;

    if (!userId) {
      console.warn("⚠️ User ID not found");
      return;
    }

    const handleConnect = () => {
      console.log("✅ Notification socket connected:", socket.id);

      console.log("👤 Joining user room:", userId);

      socket.emit("join_user_room", userId);
    };

    const handleNotification = (payload) => {
      console.log("🔔 User notification received:", payload);

      if (onNotification) {
        onNotification(payload);
      }
    };

    const handleConnectError = (error) => {
      console.error("❌ Notification socket error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("user_notification", handleNotification);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      console.log("🔌 Connecting notification socket...");
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user_notification", handleNotification);
      socket.off("connect_error", handleConnectError);
    };
  }, [isAuthenticated, user, onNotification]);
};
