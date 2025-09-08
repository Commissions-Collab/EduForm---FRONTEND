import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

// Utility to retry API calls
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const useStudentAttendanceStore = create((set, get) => ({
  data: {
    attendance_rate: 0,
    late_arrivals: { count: 0, pattern: null },
    absences: { count: 0 },
    daily_status: [],
    quarterly_summary: [],
  },
  months: [],
  selectedMonth: null,
  loading: false,
  error: null,
  monthsLoading: false,
  monthsError: null,
  hasFetchedMonths: false,

  fetchAttendance: async (month = null) => {
    set({ loading: true, error: null });
    try {
      const params = month ? { month } : {};
      const { data } = await axiosInstance.get("/student/student-attendance", {
        params,
      });
      console.log("fetchAttendance Response:", data);
      set({
        data: {
          attendance_rate: data.attendance_rate || 0,
          late_arrivals: data.late_arrivals || { count: 0, pattern: null },
          absences: data.absences || { count: 0 },
          daily_status: data.daily_status || [],
          quarterly_summary: data.quarterly_summary || [],
        },
        loading: false,
        selectedMonth: month,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message || "Failed to fetch attendance records";
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching attendance records";
      }
      console.error("fetchAttendance Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        error: message,
        loading: false,
        data: {
          attendance_rate: 0,
          late_arrivals: { count: 0, pattern: null },
          absences: { count: 0 },
          daily_status: [],
          quarterly_summary: [],
        },
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  fetchMonthFilter: async () => {
    const { hasFetchedMonths } = get();
    if (hasFetchedMonths) return; // Prevent multiple fetches
    set({ monthsLoading: true, monthsError: null });
    try {
      const { data } = await retry(() =>
        axiosInstance.get("/student/student-attendance/filter")
      );
      console.log("fetchMonthFilter Response:", data);
      set({
        months: data.months || [],
        monthsLoading: false,
        hasFetchedMonths: true,
      });
      // Set default selectedMonth to the first available month
      if (data.months && data.months.length > 0) {
        set({ selectedMonth: data.months[0].value });
      }
    } catch (error) {
      let message =
        error?.response?.data?.message || "Failed to fetch month filters";
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching month filters";
      }
      console.error("fetchMonthFilter Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        monthsError: message,
        monthsLoading: false,
        months: [],
        hasFetchedMonths: true, // Prevent retrying
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
  },

  clearError: () => {
    set({ error: null, monthsError: null });
  },

  resetStudentAttendanceStore: () => {
    set({
      data: {
        attendance_rate: 0,
        late_arrivals: { count: 0, pattern: null },
        absences: { count: 0 },
        daily_status: [],
        quarterly_summary: [],
      },
      months: [],
      selectedMonth: null,
      loading: false,
      error: null,
      monthsLoading: false,
      monthsError: null,
      hasFetchedMonths: false,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentAttendanceStore.getState().resetStudentAttendanceStore();
});

export default useStudentAttendanceStore;
