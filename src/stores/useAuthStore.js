import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getItem, setItem, removeItem } from "../utils/storage";

export const useAuthStore = create((set, get) => ({
  user: getItem("user"),
  token: getItem("token", false),
  isLoggingIn: false,
  isCheckingAuth: true,

  login: async ({ email, password }) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { user, token } = response.data;

      setItem("user", user);
      setItem("token", token);
      set({ user, token });

      toast.success("Logged in successfully!");
      return { success: true, user };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Logout failed";

      if (status !== 401) {
        toast.error(message);
      }
    } finally {
      removeItem("user");
      removeItem("token");
      set({ user: null, token: null });
    }
  },

  checkAuth: async () => {
    const token = getItem("token", false);
    if (!token) {
      set({ user: null, isCheckingAuth: false });
      return;
    }

    try {
      const response = await axiosInstance.get("/auth/check");
      const user = response.data;

      setItem("user", user);
      set({ user });
    } catch (error) {
      removeItem("user");
      removeItem("token");
      set({ user: null, token: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  getUserRole: () => {
    return get().user?.role || null;
  },
}));
