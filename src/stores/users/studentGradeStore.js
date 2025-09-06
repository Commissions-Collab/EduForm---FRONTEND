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
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch grades");
      }
      set({
        data: data.data || {
          quarter: "",
          quarter_average: 0,
          honors_eligibility: null,
          grades: [],
        },
        loading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch grades";
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
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch quarter filters");
      }
      set({
        quarters: data.data.quarters || [],
        quartersLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch quarter filters";
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
