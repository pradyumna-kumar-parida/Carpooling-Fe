"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const useSocket = () => {
  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Socket Connected", socket.id);
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket Disconnected. Reason:", reason);
    };

    const handleConnectError = (error) => {
      console.log("🚫 Socket Connection Failed:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);
};
