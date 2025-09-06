import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentDashboardStore = create((set) => ({
  data: {
    grades: {
      total_average: 0,
      subjects: [],
    },
    grade_change_percent: 0,
    attendance_rate: { present_percent: 0, recent_absents: [] },
    borrow_book: 0,
    book_due_this_week: 0,
    notifications: [],
  },
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/student/dashboard");
      "fetchDashboard Response:", data;
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }
      set({
        data: data.data || {
          grades: { total_average: 0, subjects: [] },
          grade_change_percent: 0,
          attendance_rate: { present_percent: 0, recent_absents: [] },
          borrow_book: 0,
          book_due_this_week: 0,
          notifications: [],
        },
        loading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch dashboard data";
      console.error("fetchDashboard Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        error: message,
        loading: false,
        // Preserve initial data structure on error
        data: {
          grades: { total_average: 0, subjects: [] },
          grade_change_percent: 0,
          attendance_rate: { present_percent: 0, recent_absents: [] },
          borrow_book: 0,
          book_due_this_week: 0,
          notifications: [],
        },
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetStudentDashboardStore: () => {
    set({
      data: {
        grades: {
          total_average: 0,
          subjects: [],
        },
        grade_change_percent: 0,
        attendance_rate: { present_percent: 0, recent_absents: [] },
        borrow_book: 0,
        book_due_this_week: 0,
        notifications: [],
      },
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentDashboardStore.getState().resetStudentDashboardStore();
});

export default useStudentDashboardStore;
