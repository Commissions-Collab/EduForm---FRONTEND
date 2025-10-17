import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import useNotificationStore from "../stores/useNotificationStore";
import { Link } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead } =
    useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const unreadNotifications = notifications.filter((n) => !n.read_at);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b hover:bg-gray-50"
                >
                  <p className="text-sm">{notification.data.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-blue-500 text-xs mt-2"
                  >
                    Mark as read
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-gray-500">
                No unread notifications.
              </p>
            )}
          </div>
          <div className="p-4 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-blue-500 text-sm"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
