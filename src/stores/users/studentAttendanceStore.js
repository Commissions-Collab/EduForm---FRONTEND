import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentAttendanceStore = create((set) => ({
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

  fetchAttendance: async (month = null) => {
    set({ loading: true, error: null });
    try {
      const params = month ? { month } : {};
      const { data } = await axiosInstance.get("/student/student-attendance", {
        params,
      });
      console.log("fetchAttendance Response:", data);
      set({
        data: data || {
          attendance_rate: 0,
          late_arrivals: { count: 0, pattern: null },
          absences: { count: 0 },
          daily_status: [],
          quarterly_summary: [],
        },
        loading: false,
        selectedMonth: month,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch attendance records";
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
    set({ monthsLoading: true, monthsError: null });
    try {
      const { data } = await axiosInstance.get(
        "/student/student-attendance/filter"
      );
      console.log("fetchMonthFilter Response:", data);
      set({
        months: data.months || [],
        monthsLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch month filters";
      console.error("fetchMonthFilter Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        monthsError: message,
        monthsLoading: false,
        months: [],
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
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentAttendanceStore.getState().resetStudentAttendanceStore();
});

export default useStudentAttendanceStore;
