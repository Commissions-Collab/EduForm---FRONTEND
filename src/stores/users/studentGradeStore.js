import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useStudentGradeStore = create((set) => ({
  data: {
    quarter: "",
    quarter_average: 0,
    honors_eligibility: null,
    grades: [],
  },
  quarters: [],
  selectedQuarter: null,
  loading: false,
  error: null,
  quartersLoading: false,
  quartersError: null,

  fetchGrades: async (quarterId = null) => {
    set({ loading: true, error: null });
    try {
      const url = quarterId
        ? `/student/student-grade?quarter_id=${quarterId}`
        : "/student/student-grade";
      const { data } = await axiosInstance.get(url);
      console.log("fetchGrades Response:", data);
      set({
        data: {
          quarter: data.quarter || "",
          quarter_average: data.quarter_average || 0,
          honors_eligibility: data.honors_eligibility || null,
          grades: data.grades || [],
        },
        loading: false,
      });
    } catch (error) {
      let message = error?.response?.data?.error || "Failed to fetch grades";
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching grades";
      }
      console.error("fetchGrades Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        error: message,
        loading: false,
        data: {
          quarter: "",
          quarter_average: 0,
          honors_eligibility: null,
          grades: [],
        },
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  fetchQuarterFilter: async () => {
    set({ quartersLoading: true, quartersError: null });
    try {
      const { data } = await axiosInstance.get("/student/student-grade/filter");
      console.log("fetchQuarterFilter Response:", data);
      set({
        quarters: data.quarters || [],
        quartersLoading: false,
      });
    } catch (error) {
      let message =
        error?.response?.data?.error || "Failed to fetch quarter filters";
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching quarter filters";
      }
      console.error("fetchQuarterFilter Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        quartersError: message,
        quartersLoading: false,
        quarters: [],
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  setSelectedQuarter: (quarterId) => {
    set({ selectedQuarter: quarterId });
  },

  clearError: () => {
    set({ error: null, quartersError: null });
  },

  resetGradeStore: () => {
    set({
      data: {
        quarter: "",
        quarter_average: 0,
        honors_eligibility: null,
        grades: [],
      },
      quarters: [],
      selectedQuarter: null,
      loading: false,
      error: null,
      quartersLoading: false,
      quartersError: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentGradeStore.getState().resetGradeStore();
});

export default useStudentGradeStore;
