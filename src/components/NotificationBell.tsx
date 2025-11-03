"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const { notes, markAllRead } = useNotifications(user?.id, token || "");
  const [open, setOpen] = useState(false);

  const unreadCount = notes.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-gray-800">Notifications</span>
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all read
            </button>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notes.length ? (
              notes.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 border-b text-sm ${
                    n.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-gray-600 text-sm">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500 text-center">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
