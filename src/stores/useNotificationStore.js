import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      const { unread, all } = response.data;
      set({ notifications: all, unreadCount: unread.length });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
      }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },
}));

export default useNotificationStore;
