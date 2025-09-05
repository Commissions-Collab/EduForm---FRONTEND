import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentAttendanceStore = create((set) => ({
  attendance: {
    data: {
      attendance_rate: 0,
      late_arrivals: { count: 0, pattern: null },
      absences: { count: 0 },
      daily_status: [],
      quarterly_summary: [],
    },
    isLoading: false,
    error: null,
  },
  months: {
    data: [],
    isLoading: false,
    error: null,
  },
  fetchAttendance: async (params) => {
    set((state) => ({
      attendance: { ...state.attendance, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/student-attendance", {
        params,
      });
      set((state) => ({
        attendance: { ...state.attendance, data: data, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch attendance records";
      set((state) => ({
        attendance: { ...state.attendance, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  fetchMonthFilter: async () => {
    set((state) => ({
      months: { ...state.months, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get(
        "/student/student-attendance/filter"
      );
      set((state) => ({
        months: { ...state.months, data: data.months, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch month filters";
      set((state) => ({
        months: { ...state.months, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  resetStudentAttendanceStore: () => {
    set({
      attendance: {
        data: {
          attendance_rate: 0,
          late_arrivals: { count: 0, pattern: null },
          absences: { count: 0 },
          daily_status: [],
          quarterly_summary: [],
        },
        isLoading: false,
        error: null,
      },
      months: {
        data: [],
        isLoading: false,
        error: null,
      },
    });
  },
}));
// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useStudentAttendanceStore.getState().resetStudentAttendanceStore();
});
export default useStudentAttendanceStore;
