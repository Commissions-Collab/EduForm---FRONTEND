import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../lib/axios";
import { getItem, setItem, removeItem, clearStorage } from "../lib/utils";
import useFilterStore from "./admin/filterStore";
import usePromotionStore from "./admin/promotionStore";
import useAttendanceStore from "./admin/attendanceStore";
import useBmiStore from "./admin/bmiStore";
import useCertificatesStore from "./admin/certificateStore";
import useDashboardStore from "./admin/dashboardStore";
import useStudentRequestsStore from "./admin/studentRequest";
import useTextbooksStore from "./admin/textbookStore";
import useWorkloadsStore from "./admin/workloadStore";
import useGradesStore from "./admin/gradeStore";
import useParentConferenceStore from "./admin/parentConference";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  authError: null,

  login: async ({ email, password }) => {
    set({ isLoggingIn: true, authError: null });
    try {
      clearStorage();
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post("/login", {
        email,
        password,
      });
      console.log("Login response:", { status, data });
      if (data?.token && data?.user) {
        // Check for data.token instead of data.access_token
        const { user, token } = data; // Use token directly
        setItem("user", user, localStorage);
        setItem("token", token, localStorage);
        set({ user, token, isLoggingIn: false });
        toast.success("Welcome! You have logged in successfully.");
        return { success: true, user };
      } else {
        throw new Error(
          data?.message || "Login failed: Invalid response from server"
        );
      }
    } catch (error) {
      console.error("Login error:", error.response?.data, error.message, error);
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      set({ authError: message, isLoggingIn: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  register: async (formData) => {
    set({ isRegistering: true, authError: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/register", formData, {
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
    set({ isLoggingOut: true, authError: null });
    try {
      await fetchCsrfToken();
      await axiosInstance.post("/logout");
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 401 && status !== 419) {
        const message = error?.response?.data?.message || "Logout failed";
        toast.error(message);
      }
    } finally {
      clearStorage();
      useFilterStore.getState().resetFilterStore();
      usePromotionStore.getState().resetPromotionStore();
      useAttendanceStore.getState().resetAttendanceStore();
      useBmiStore.getState().resetBmiStore();
      useCertificatesStore.getState().resetCertificatesStore();
      useDashboardStore.getState().resetDashboardStore();
      useStudentRequestsStore.getState().resetStudentRequestsStore();
      useTextbooksStore.getState().resetTextbooksStore();
      useWorkloadsStore.getState().resetWorkloadsStore();
      useGradesStore.getState().resetGradesStore();
      useParentConferenceStore.getState().resetParentConferenceStore();
      set({
        user: null,
        token: null,
        isLoggingOut: false,
        authError: null,
      });
      toast.success("Logged out successfully");
      window.location.href = "/sign-in";
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, authError: null });
    const token = getItem("token", false, localStorage);
    if (!token) {
      set({ user: null, token: null, isCheckingAuth: false });
      clearStorage();
      return;
    }
    try {
      const { data } = await axiosInstance.get("/api/user");
      if (data) {
        setItem("user", data, localStorage);
        set({ user: data, token, isCheckingAuth: false });
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      clearStorage();
      set({
        user: null,
        token: null,
        authError: error?.response?.data?.message || "Authentication failed",
        isCheckingAuth: false,
      });
    }
  },

  getUserRole: () => {
    const { user } = get();
    return user?.role || null;
  },
}));

// Listen for unauthorized event to reset all stores
window.addEventListener("unauthorized", () => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
