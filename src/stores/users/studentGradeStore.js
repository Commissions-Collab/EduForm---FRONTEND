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
  loading: false,
  error: null,

  fetchGrades: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/student/student-grade");
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

  clearError: () => {
    set({ error: null });
  },

  resetGradeStore: () => {
    set({
      data: {
        quarter: "",
        quarter_average: 0,
        honors_eligibility: null,
        grades: [],
      },
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useStudentGradeStore.getState().resetGradeStore();
});

export default useStudentGradeStore;
