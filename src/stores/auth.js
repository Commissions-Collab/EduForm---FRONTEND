import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../lib/axios";
import { getItem, setItem, clearStorage } from "../lib/utils";
import useFilterStore from "./admin/filterStore";
import usePromotionStore from "./admin/promotionStore";
import useAttendanceStore from "./admin/attendanceStore";
import useBmiStore from "./admin/bmiStore";
import useCertificatesStore from "./admin/certificateStore";
import useDashboardStore from "./admin/dashboardStore";
import useStudentRequestsStore from "./superAdmin/studentRequest";
import useTextbooksStore from "./admin/textbookStore";
import useWorkloadsStore from "./admin/workloadStore";
import useGradesStore from "./admin/gradeStore";
import useParentConferenceStore from "./admin/parentConference";
import useAcademicCalendarStore from "./superAdmin/calendarStore";
import useEnrollmentStore from "./superAdmin/enrollmentStore";
import useTeacherManagementStore from "./superAdmin/teacherManagementStore";
import useClassManagementStore from "./superAdmin/classManagementStore";
import useAchievementsStore from "./users/achievementStore";
import useStudentDashboardStore from "./users/studentDashboardStore";
import useStudentGradeStore from "./users/studentGradeStore";
import useHealthProfileStore from "./users/healthProfileStore";
import useStudentAttendanceStore from "./users/studentAttendanceStore";

// Session configuration matching backend
const SESSION_LIFETIME_MINUTES = 120; // Match backend SESSION_LIFETIME
const SESSION_HEARTBEAT_INTERVAL = 4 * 60 * 1000; // 4 minutes (shorter than session lifetime)
const SESSION_WARNING_THRESHOLD = 10 * 60 * 1000; // Warn 10 minutes before expiry

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  sessionExpiry: null,
  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isPostLoginLoading: false,
  authError: null,
  sessionWarningShown: false,

  initializeAuth: () => {
    try {
      const token = getItem("token", false, localStorage);
      const user = getItem("user", true, localStorage);
      const sessionExpiry = getItem("session_expiry", false, localStorage);

      if (
        token &&
        user &&
        sessionExpiry &&
        Date.now() < parseInt(sessionExpiry)
      ) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        set({
          token,
          user,
          sessionExpiry: parseInt(sessionExpiry),
          isCheckingAuth: false,
        });
      } else {
        // Clear expired session data
        if (sessionExpiry && Date.now() >= parseInt(sessionExpiry)) {
          clearStorage();
        }
        set({ isCheckingAuth: false });
      }
    } catch (error) {
      set({
        isCheckingAuth: false,
        authError: "Failed to initialize authentication",
      });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoggingIn: true, authError: null, sessionWarningShown: false });

    try {
      clearStorage();
      await fetchCsrfToken();

      const { data, status } = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (status !== 200 || !data?.token || !data?.user) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const { user, token } = data;

      // Calculate session expiry based on backend SESSION_LIFETIME
      const sessionExpiry = Date.now() + SESSION_LIFETIME_MINUTES * 60 * 1000;

      setItem("user", user, localStorage);
      setItem("token", token, localStorage);
      setItem("session_expiry", sessionExpiry.toString(), localStorage);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      set({
        user,
        token,
        sessionExpiry,
        isLoggingIn: false,
        isCheckingAuth: false,
        sessionWarningShown: false,
      });

      set({ isPostLoginLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ isPostLoginLoading: false });

      return { success: true, user, role: user.role };
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      set({ authError: message, isLoggingIn: false, isCheckingAuth: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  refreshSession: async () => {
    const { token } = get();
    if (!token) return false;

    try {
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.get("/user");

      if (status !== 200 || !data) {
        throw new Error("Invalid user data");
      }

      // Update session expiry on successful refresh
      const newSessionExpiry =
        Date.now() + SESSION_LIFETIME_MINUTES * 60 * 1000;
      setItem("session_expiry", newSessionExpiry.toString(), localStorage);
      setItem("user", data, localStorage);

      set({
        user: data,
        sessionExpiry: newSessionExpiry,
        sessionWarningShown: false,
      });

      return true;
    } catch (error) {
      // Session refresh failed - likely expired
      get().resetAuth();
      return false;
    }
  },

  checkSessionExpiry: () => {
    const { sessionExpiry, sessionWarningShown, token } = get();
    if (!token || !sessionExpiry) return;

    const timeUntilExpiry = sessionExpiry - Date.now();

    // If session has expired
    if (timeUntilExpiry <= 0) {
      get().resetAuth();
      toast.error("Session expired. Please log in again.");
      return;
    }

    // Show warning if session is about to expire and warning hasn't been shown
    if (timeUntilExpiry <= SESSION_WARNING_THRESHOLD && !sessionWarningShown) {
      const minutesLeft = Math.ceil(timeUntilExpiry / (60 * 1000));
      toast.error(
        `Session will expire in ${minutesLeft} minutes. Please save your work.`,
        {
          duration: 6000,
        }
      );
      set({ sessionWarningShown: true });
    }
  },

  resetAuth: () => {
    try {
      clearStorage();
      delete axiosInstance.defaults.headers.common["Authorization"];

      // Reset all related stores
      const stores = [
        useFilterStore,
        usePromotionStore,
        useAttendanceStore,
        useBmiStore,
        useCertificatesStore,
        useDashboardStore,
        useStudentRequestsStore,
        useTextbooksStore,
        useWorkloadsStore,
        useGradesStore,
        useParentConferenceStore,
        useAcademicCalendarStore,
        useEnrollmentStore,
        useTeacherManagementStore,
        useClassManagementStore,
        useAchievementsStore,
        useStudentDashboardStore,
        useStudentGradeStore,
        useHealthProfileStore,
        useStudentAttendanceStore,
      ];

      stores.forEach((store) => {
        try {
          const state = store.getState();
          const resetFn = Object.values(state).find(
            (fn) => typeof fn === "function" && fn.name.includes("reset")
          );
          if (resetFn) resetFn();
        } catch (error) {
          console.warn("Failed to reset store:", error);
        }
      });

      set({
        user: null,
        token: null,
        sessionExpiry: null,
        isLoggingOut: false,
        authError: null,
        isCheckingAuth: false,
        isPostLoginLoading: false,
        sessionWarningShown: false,
      });
    } catch (error) {
      console.error("Reset auth failed:", error);
      toast.error("Failed to reset authentication state");
    }
  },

  register: async (formData) => {
    set({ isRegistering: true, authError: null });
    try {
      await fetchCsrfToken();

      // Remove image if it's not provided (already null)
      if (!formData.get("image")) {
        formData.delete("image");
      }

      const { data, status } = await axiosInstance.post("/register", formData, {
        timeout: 10000,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (![200, 201, 202, 204].includes(status)) {
        throw new Error(
          data?.message || `Invalid response from server (status: ${status})`
        );
      }

      const success =
        [200, 201, 202].includes(status) ||
        data?.status === "success" ||
        data?.request?.status === "pending";
      const message =
        data?.message || "Registration request submitted. Awaiting approval.";

      if (!success) {
        throw new Error(message || "Registration failed");
      }

      set({ isRegistering: false });
      return {
        success: true,
        request: data?.request || null,
        message,
      };
    } catch (err) {
      const message = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.message || err.message || "Registration failed";

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
    } catch (_) {
      // Ignore 401/419 on logout
    } finally {
      get().resetAuth();
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, authError: null });
    const token = getItem("token", false, localStorage);
    const sessionExpiry = getItem("session_expiry", false, localStorage);

    if (!token || !sessionExpiry || Date.now() > parseInt(sessionExpiry)) {
      set({
        user: null,
        token: null,
        sessionExpiry: null,
        isCheckingAuth: false,
      });
      return false;
    }

    try {
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.get("/user");

      if (status !== 200 || !data) throw new Error("Invalid user data");

      // Update session expiry on successful auth check
      const newSessionExpiry =
        Date.now() + SESSION_LIFETIME_MINUTES * 60 * 1000;
      setItem("user", data, localStorage);
      setItem("session_expiry", newSessionExpiry.toString(), localStorage);

      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      set({
        user: data,
        token,
        sessionExpiry: newSessionExpiry,
        isCheckingAuth: false,
      });

      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Authentication failed";
      set({ authError: message, isCheckingAuth: false });
      toast.error(message);
      return false;
    }
  },

  getUserRole: () => {
    const { user } = get();
    return user?.role || null;
  },
}));

// Listen for unauthorized events
const handleUnauthorized = () => {
  useAuthStore.getState().resetAuth();
};
window.addEventListener("unauthorized", handleUnauthorized);

// Session heartbeat with proper expiry checking
const sessionHeartbeat = setInterval(async () => {
  const { token, checkSessionExpiry, refreshSession } = useAuthStore.getState();

  if (!token) return;

  // Check if session is about to expire or has expired
  checkSessionExpiry();

  // Try to refresh session periodically
  try {
    const refreshed = await refreshSession();
    if (!refreshed) {
      clearInterval(sessionHeartbeat);
    }
  } catch (error) {
    console.warn("Session heartbeat failed:", error);
  }
}, SESSION_HEARTBEAT_INTERVAL);

// Cleanup on module unload
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
    clearInterval(sessionHeartbeat);
  });
}

export default useAuthStore;
