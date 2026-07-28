"use client";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

export const useSocket = () => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket Connected");
      console.log(socket.connected);
      console.log("Socket ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket Disconnected");
      console.log("Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.log("🚫 Socket Connection Failed");
      console.log(error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");

      socket.disconnect();
    };
  }, []);
};
