import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import toast from "react-hot-toast";

const useBmiStore = create((set, get) => ({
  bmiStudents: [],
  loading: false,
  error: null,

  fetchBmiStudents: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
      const message = "Missing required parameters for BMI data";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/teacher/student-bmi", {
        params: {
          section_id: filters.sectionId,
          academic_year_id: filters.academicYearId,
          quarter_id: filters.quarterId,
        },
      });
      set({ bmiStudents: data.students || data || [], loading: false });
    } catch (err) {
      const message = err?.response?.data?.message || "Could not load BMI data";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  addStudentBmi: async (bmiData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/teacher/student-bmi",
        bmiData
      );
      toast.success("BMI record added successfully!");
      get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to add BMI record";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateStudentBmi: async (id, bmiData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        `/teacher/student-bmi/${id}`,
        bmiData
      );
      toast.success("BMI record updated successfully!");
      get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update BMI record";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteStudentBmi: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/teacher/student-bmi/${id}`);
      toast.success("BMI record deleted successfully!");
      get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete BMI record";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  resetBmiStore: () => {
    set({
      bmiStudents: [],
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useBmiStore.getState().resetBmiStore();
});

export default useBmiStore;
