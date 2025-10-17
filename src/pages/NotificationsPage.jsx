import React, { useEffect } from "react";
import useNotificationStore from "../stores/useNotificationStore";

const NotificationsPage = () => {
  const { notifications, fetchNotifications, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Notifications</h1>
      <div className="bg-white shadow rounded-lg">
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 border-b ${
                !notification.read_at ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-sm">{notification.data.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </p>
              {!notification.read_at && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500 text-xs mt-2"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;
