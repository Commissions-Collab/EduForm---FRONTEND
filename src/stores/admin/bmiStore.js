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

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
        throw new Error("Missing required parameters for BMI data");
      }

      const { data, status } = await axiosInstance.get("/teacher/student-bmi", {
        params: {
          section_id: filters.sectionId,
          academic_year_id: filters.academicYearId,
          quarter_id: filters.quarterId,
        },
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const students = Array.isArray(data.students)
        ? data.students
        : Array.isArray(data)
        ? data
        : [];
      set({ bmiStudents: students, loading: false });
    } catch (err) {
      handleError(err, "Could not load BMI data", set);
    }
  },

  addStudentBmi: async (bmiData) => {
    set({ loading: true, error: null });

    try {
      if (!bmiData || typeof bmiData !== "object") {
        throw new Error("Invalid BMI data");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        "/teacher/student-bmi",
        bmiData,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record added successfully!");
      await get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to add BMI record", set);
      throw new Error(message);
    }
  },

  updateStudentBmi: async (id, bmiData) => {
    set({ loading: true, error: null });

    try {
      if (typeof id !== "string" || !id.trim()) {
        throw new Error("Invalid BMI record ID");
      }
      if (!bmiData || typeof bmiData !== "object") {
        throw new Error("Invalid BMI data");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        `/teacher/student-bmi/${id}`,
        bmiData,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record updated successfully!");
      await get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update BMI record", set);
      throw new Error(message);
    }
  },

  deleteStudentBmi: async (id) => {
    set({ loading: true, error: null });

    try {
      if (typeof id !== "string" || !id.trim()) {
        throw new Error("Invalid BMI record ID");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.delete(
        `/teacher/student-bmi/${id}`,
        {
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record deleted successfully!");
      await get().fetchBmiStudents(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete BMI record", set);
      throw new Error(message);
    }
  },

  resetBmiStore: () => {
    try {
      set({
        bmiStudents: [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to reset BMI store:", { error: error.message });
      toast.error("Failed to reset BMI data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useBmiStore.getState().resetBmiStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useBmiStore;
