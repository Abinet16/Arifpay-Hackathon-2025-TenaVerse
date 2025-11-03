"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications(userId?: string, token?: string) {
  const [notes, setNotes] = useState<Notification[]>([]);

  async function fetchNotes() {
    try {
      const res = await api.get("/api/notifications?page=1&limit=10");
      setNotes(res.data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications failed", err);
    }
  }

  async function markAllRead() {
    try {
      await api.patch("/api/notifications/read-all");
      setNotes((n) => n.map((x) => ({ ...x, read: true })));
    } catch (err) {
      console.error("Mark all read failed", err);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // Socket listener for live updates
  useEffect(() => {
    if (!userId || !token) return;
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    });

    socket.on("notification", (note: Notification) => {
      toast.success(`${note.title}: ${note.message}`);
      setNotes((prev) => [note, ...prev]);
    });

    return () => socket.disconnect();
  }, [userId, token]);

  return { notes, fetchNotes, markAllRead };
}
