// src/components/NotificationBell.jsx
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Mock notifications (replace with AWS SNS/SQS integration later)
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New pre-auth request from Dr. Jane Smith", time: "2h ago" },
      { id: 2, message: "MRI scan approved for Alice Green", time: "1d ago" },
      { id: 3, message: "Policy update: Physical Therapy criteria changed", time: "3d ago" },
    ]);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="text-gray-700" size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 font-semibold text-gray-700">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm text-gray-600"
              >
                <p>{n.message}</p>
                <span className="text-xs text-gray-400">{n.time}</span>
              </li>
            ))}
          </ul>
          <div className="p-2 text-center text-xs text-blue-600 cursor-pointer hover:underline">
            View all
          </div>
        </div>
      )}
    </div>
  );
}
