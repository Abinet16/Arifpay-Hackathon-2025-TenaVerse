"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(userId?: string, token?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

    // ✅ Avoid multiple sockets
    if (socketRef.current) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected", socket.id);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("notification", (payload) => {
      console.log("🔔 New notification:", payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, token]);
}
