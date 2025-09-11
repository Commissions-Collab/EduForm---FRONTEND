// In auth.js
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
import useStudentRequestsStore from "./admin/studentRequest";
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

// Type definitions for better type safety
/** @typedef {{ email: string; password: string }} LoginCredentials */
/** @typedef {{ success: boolean; user?: object; role?: string; message?: string }} LoginResponse */
/** @typedef {{ success: boolean; message?: string; request?: object }} RegisterResponse */

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user
 * @property {string|null} token
 * @property {boolean} isLoggingIn
 * @property {boolean} isRegistering
 * @property {boolean} isCheckingAuth
 * @property {boolean} isLoggingOut
 * @property {boolean} isPostLoginLoading
 * @property {string|null} authError
 */

/**
 * @typedef {Object} AuthActions
 * @property {() => void} initializeAuth
 * @property {(credentials: LoginCredentials) => Promise<LoginResponse>} login
 * @property {(formData: FormData) => Promise<RegisterResponse>} register
 * @property {() => void} resetAuth
 * @property {() => Promise<void>} logout
 * @property {() => Promise<boolean>} checkAuth
 * @property {() => string|null} getUserRole
 */

/** @type {import('zustand').StoreApi<AuthState & AuthActions>} */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isPostLoginLoading: false,
  authError: null,

  initializeAuth: () => {
    try {
      const token = getItem("token", false, localStorage);
      const user = getItem("user", true, localStorage);

      if (token && user) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        set({ token, user, isCheckingAuth: false });
      } else {
        set({ isCheckingAuth: false });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      set({
        isCheckingAuth: false,
        authError: "Failed to initialize authentication",
      });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoggingIn: true, authError: null });

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
      setItem("user", user, localStorage);
      setItem("token", token, localStorage);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      set({ user, token, isLoggingIn: false, isCheckingAuth: false });

      // Simulate post-login processing with minimal delay
      set({ isPostLoginLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ isPostLoginLoading: false });

      return { success: true, user, role: user.role };
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      console.error("Login error:", {
        message,
        status: error.response?.status,
      });

      set({ authError: message, isLoggingIn: false, isCheckingAuth: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  register: async (formData) => {
    set({ isRegistering: true, authError: null });
    try {
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post("/register", formData, {
        timeout: 10000,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Allow status codes for successful registration (including 202 for pending approval)
      if (![200, 201, 202, 204].includes(status)) {
        throw new Error(
          data?.message || `Invalid response from server (status: ${status})`
        );
      }

      // Success is true if status is 202 or data indicates success/pending
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
      if (process.env.NODE_ENV !== "production") {
        console.error("Registration error", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      }
      set({ authError: message, isRegistering: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  resetAuth: () => {
    try {
      clearStorage();
      delete axiosInstance.defaults.headers.common["Authorization"];

      // Reset all related stores in a single try-catch to prevent partial resets
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
        const resetFn = Object.values(store.getState()).find(
          (fn) => typeof fn === "function" && fn.name.includes("reset")
        );
        if (resetFn) resetFn();
      });

      set({
        user: null,
        token: null,
        isLoggingOut: false,
        authError: null,
        isCheckingAuth: false,
        isPostLoginLoading: false,
      });
    } catch (error) {
      console.error("Reset auth failed:", error);
      toast.error("Failed to reset authentication state");
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
        console.error("Logout error:", { message, status });
        toast.error(message);
      }
    } finally {
      get().resetAuth();
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, authError: null });
    const token = getItem("token", false, localStorage);

    if (!token) {
      set({ user: null, token: null, isCheckingAuth: false });
      return false;
    }

    try {
      await fetchCsrfToken();
      const { data, status } = await axiosInstance.get("/user");

      if (status !== 200 || !data) {
        throw new Error("Invalid user data");
      }

      setItem("user", data, localStorage);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      set({ user: data, token, isCheckingAuth: false });
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Authentication failed";
      console.error("Check auth error:", {
        message,
        status: error.response?.status,
      });

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

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useAuthStore.getState().resetAuth();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (optional, for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useAuthStore;
