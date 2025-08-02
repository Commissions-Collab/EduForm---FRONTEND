import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getItem, setItem, removeItem } from "../lib/utils";

export const useAuthStore = create((set, get) => ({
  user: getItem("user") || null,
  token: getItem("token", false) || null,

  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,
  authError: null,

  login: async ({ email, password }) => {
    set({ isLoggingIn: true, authError: null });

    try {
      const { data } = await axiosInstance.post("/login", { email, password });
      const { user, token } = data;

      setItem("user", user);
      setItem("token", token);
      set({ user, token, authError: null });

      toast.success("Logged in successfully!");
      return { success: true, user };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      set({ authError: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  register: async (formData) => {
    set({ isRegistering: true, authError: null });

    try {
      await axiosInstance.post("/register", formData);
      toast.success("Registration successful! You may now log in.");
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      set({ authError: message });
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isRegistering: false });
    }
  },

  isLoggingOut: false,

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Logout failed";
      if (status !== 401) toast.error(message);
    } finally {
      removeItem("user");
      removeItem("token");
      set({ user: null, token: null, isLoggingOut: false });
    }
  },

  checkAuth: async () => {
    const token = getItem("token", false);

    if (!token) {
      set({ user: null, isCheckingAuth: false, authError: null });
      return;
    }

    try {
      const { data: user } = await axiosInstance.get("/auth/check");
      setItem("user", user);
      set({ user, authError: null });
    } catch (error) {
      const message = error?.response?.data?.message || "Authentication failed";
      set({ authError: message });
      removeItem("user");
      removeItem("token");
      set({ user: null, token: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  getUserRole: () => get().user?.role || null,
}));
