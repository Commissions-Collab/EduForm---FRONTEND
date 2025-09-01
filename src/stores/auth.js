import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getItem, setItem, removeItem } from "../lib/utils";

// Cache initial values to avoid repeated localStorage calls
const initialUser = getItem("user") || null;
const initialToken = getItem("token", false) || null;

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,

  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  authError: null,

  login: async ({ email, password }) => {
    set({ isLoggingIn: true, authError: null });

    try {
      const { data } = await axiosInstance.post("/login", { email, password });
      const { user, token } = data;

      // Batch localStorage operations
      setItem("user", user);
      setItem("token", token);

      // Single state update
      set({ user, token, authError: null, isLoggingIn: false });

      toast.success("Welcome! You have logged in successfully.");
      return { success: true, user };
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      set({ authError: message, isLoggingIn: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  register: async (formData) => {
    set({ isRegistering: true, authError: null });

    try {
      await axiosInstance.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isRegistering: false });
      toast.success(
        "Registration submitted! Please wait for teacher approval before you can log in."
      );
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      set({ authError: message, isRegistering: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });

    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 401) {
        const message = error?.response?.data?.message || "Logout failed";
        toast.error(message);
      }
    }

    // Always clear auth data regardless of API response
    removeItem("user");
    removeItem("token");
    set({
      user: null,
      token: null,
      isLoggingOut: false,
      authError: null,
    });
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
      set({ user, authError: null, isCheckingAuth: false });
    } catch (error) {
      const message = error?.response?.data?.message || "Authentication failed";

      // Batch cleanup operations
      removeItem("user");
      removeItem("token");
      set({
        user: null,
        token: null,
        authError: message,
        isCheckingAuth: false,
      });
    }
  },

  // Memoized getter for better performance
  getUserRole: () => {
    const { user } = get();
    return user?.role || null;
  },
}));
