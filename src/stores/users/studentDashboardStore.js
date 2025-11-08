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

      set({
        data: {
          grades: {
            total_average: data.grades?.total_average || 0,
            subjects: Array.isArray(data.grades?.subjects)
              ? data.grades.subjects
              : [],
          },
          grade_change_percent: data.grade_change_percent || 0,
          attendance_rate: {
            present_percent: data.attendance_rate?.present_percent || 0,
            recent_absents: Array.isArray(data.attendance_rate?.recent_absents)
              ? data.attendance_rate.recent_absents
              : [],
          },
          borrow_book: data.borrow_book || 0,
          book_due_this_week: data.book_due_this_week || 0,
          notifications: Array.isArray(data.notifications)
            ? data.notifications
            : [],
        },
        loading: false,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message || "Failed to fetch dashboard data";

      // Handle non-JSON responses (e.g., HTML from 404)
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching dashboard data";
      }

      console.error("fetchDashboard Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      set({
        error: message,
        loading: false,
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

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useStudentDashboardStore.getState().resetStudentDashboardStore();
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useStudentDashboardStore;
