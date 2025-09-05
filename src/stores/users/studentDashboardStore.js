import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentDashboardStore = create((set) => ({
  dashboard: {
    data: {
      grades: 0,
      grade_change_percent: 0,
      attendance_rate: { present_percent: 0, recent_absents: [] },
      borrow_book: 0,
      book_due_this_week: 0,
      notifications: [],
    },
    isLoading: false,
    error: null,
  },
  fetchDashboard: async () => {
    set((state) => ({
      dashboard: { ...state.dashboard, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/dashboard");
      set((state) => ({
        dashboard: { ...state.dashboard, data: data, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch dashboard data";
      set((state) => ({
        dashboard: { ...state.dashboard, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  resetStudentDashboardStore: () => {
    set({
      dashboard: {
        data: {
          grades: 0,
          grade_change_percent: 0,
          attendance_rate: { present_percent: 0, recent_absents: [] },
          borrow_book: 0,
          book_due_this_week: 0,
          notifications: [],
        },
        isLoading: false,
        error: null,
      },
    });
  },
}));
// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useStudentDashboardStore.getState().resetStudentDashboardStore();
});
export default useStudentDashboardStore;
