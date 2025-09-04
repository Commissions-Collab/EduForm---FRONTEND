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
import useAcademicYearManagementStore from "./superAdmin/academicYearManagementStore";
import useCalendarManagementStore from "./superAdmin/calendarManagementStore";
import useAcademicManagementStore from "./superAdmin/academicManagementStore";
import useTeacherManagementStore from "./superAdmin/teacherManagementStore";
import useFormsManagementStore from "./superAdmin/formsManagementStore";
import useSuperAdminDashboardStore from "./superAdmin/superAdminDashboardStore";

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
    const token = getItem("token", false, localStorage);
    const user = getItem("user", true, localStorage);
    if (token && user) {
      set({ token, user, isAuthenticated: true, isCheckingAuth: false });
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      set({ isCheckingAuth: false });
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
      console.log("Login response:", { status, data });
      if (data?.token && data?.user) {
        const { user, token } = data;
        setItem("user", user, localStorage);
        setItem("token", token, localStorage);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        set({ user, token, isLoggingIn: false, isCheckingAuth: false });
        // Trigger post-login loading screen
        set({ isPostLoginLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 900));
        set({ isPostLoginLoading: false });
        return { success: true, user, role: user.role };
      } else {
        throw new Error(
          data?.message || "Login failed: Invalid response from server"
        );
      }
    } catch (error) {
      console.error("Login error:", error.response?.data, error.message, error);
      const message =
        error?.response?.data?.message || error.message || "Login failed";
      set({ authError: message, isLoggingIn: false, isCheckingAuth: false });
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

  resetAuth: () => {
    clearStorage();
    delete axiosInstance.defaults.headers.common["Authorization"];
    // Reset Admin stores
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
    // Reset Super Admin stores
    useAcademicYearManagementStore.getState().resetAcademicYearStore();
    useCalendarManagementStore.getState().resetCalendarStore();
    useAcademicManagementStore.getState().resetAcademicManagementStore();
    useTeacherManagementStore.getState().resetTeacherManagementStore();
    useFormsManagementStore.getState().resetFormsManagementStore();
    useSuperAdminDashboardStore.getState().resetDashboardStore();
    set({
      user: null,
      token: null,
      isLoggingOut: false,
      authError: null,
      isCheckingAuth: false,
      isPostLoginLoading: false,
    });
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
      const { data } = await axiosInstance.get("/user");
      console.log("checkAuth success:", data);
      if (data) {
        setItem("user", data, localStorage);
        set({ user: data, token, isCheckingAuth: false });
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        return true;
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("checkAuth failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        authError: error?.response?.data?.message || "Authentication failed",
        isCheckingAuth: false,
      });
      return false;
    }
  },

  getUserRole: () => {
    const { user } = get();
    return user?.role || null;
  },
}));

// Listen for unauthorized event to reset all stores
window.addEventListener("unauthorized", () => {
  useAuthStore.getState().resetAuth();
});

export default useAuthStore;
