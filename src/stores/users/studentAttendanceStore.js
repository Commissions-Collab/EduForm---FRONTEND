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

  fetchAttendance: async (month) => {
    if (!month) {
      console.warn("No month provided for attendance fetch");
      return;
    }

    set({ loading: true, error: null });

    try {
      // Use correct API route
      const { data } = await retry(() =>
        axiosInstance.get("/student/student-attendance", {
          params: { month },
          timeout: 10000,
        })
      );

      console.log("fetchAttendance Response:", data);

      // Handle both success and direct data responses
      const responseData = data.success ? data.data : data;

      set({
        data: {
          attendance_rate: responseData.attendance_rate ?? 0,
          late_arrivals: responseData.late_arrivals || {
            count: 0,
            pattern: null,
          },
          absences: responseData.absences || { count: 0 },
          daily_status: Array.isArray(responseData.daily_status)
            ? responseData.daily_status
            : [],
          quarterly_summary: Array.isArray(responseData.quarterly_summary)
            ? responseData.quarterly_summary
            : [],
        },
        loading: false,
        selectedMonth: month,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch attendance records";

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
    if (hasFetchedMonths) {
      console.log("Month filters already fetched, skipping...");
      return;
    }

    set({ monthsLoading: true, monthsError: null });

    try {
      // Use correct API route
      const { data } = await retry(() =>
        axiosInstance.get("/student/student-attendance/filter", {
          timeout: 10000,
        })
      );

      console.log("fetchMonthFilter Response:", data);

      // Handle both success and direct data responses
      const responseData = data.success ? data.data : data;
      const months = Array.isArray(responseData.months)
        ? responseData.months
        : [];

      set({
        months: months,
        monthsLoading: false,
        hasFetchedMonths: true,
      });

      // Set default selectedMonth to the first available month
      if (months && months.length > 0) {
        set({ selectedMonth: months[0].value });
      }
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch month filters";

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
        hasFetchedMonths: true,
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
