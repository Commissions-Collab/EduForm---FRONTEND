import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentGradeStore = create((set) => ({
  grades: {
    data: {
      quarter: "",
      quarter_average: 0,
      honors_eligibility: null,
      grades: [],
    },
    isLoading: false,
    error: null,
  },
  quarters: {
    data: [],
    isLoading: false,
    error: null,
  },
  selectedQuarter: null, // New state to track selected quarter
  fetchGrades: async (quarterId = null) => {
    set((state) => ({
      grades: { ...state.grades, isLoading: true, error: null },
    }));
    try {
      const url = quarterId
        ? `/student/student-grade?quarter_id=${quarterId}`
        : "/student/student-grade";
      const { data } = await axiosInstance.get(url);
      set((state) => ({
        grades: { ...state.grades, data: data, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to fetch grades";
      set((state) => ({
        grades: { ...state.grades, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  fetchQuarterFilter: async () => {
    set((state) => ({
      quarters: { ...state.quarters, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/student-grade/filter");
      set((state) => ({
        quarters: { ...state.quarters, data: data.quarters, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch quarter filters";
      set((state) => ({
        quarters: { ...state.quarters, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  setSelectedQuarter: (quarterId) => {
    set({ selectedQuarter: quarterId });
  },
  resetGradeStore: () => {
    set({
      grades: {
        data: {
          quarter: "",
          quarter_average: 0,
          honors_eligibility: null,
          grades: [],
        },
        isLoading: false,
        error: null,
      },
      quarters: {
        data: [],
        isLoading: false,
        error: null,
      },
      selectedQuarter: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentGradeStore.getState().resetGradeStore();
});

export default useStudentGradeStore;
