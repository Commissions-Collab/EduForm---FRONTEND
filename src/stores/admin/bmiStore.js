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
      console.log("Fetching BMI with filters:", filters); // Debug log
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

      const filters = useFilterStore.getState().globalFilters;
      console.log("Adding BMI with filters:", filters, "Data:", bmiData); // Debug log

      if (!filters.academicYearId || !filters.quarterId) {
        throw new Error("Academic year and quarter are required");
      }

      // Prepare payload aligned with backend expectations
      const payload = {
        student_id: bmiData.student_id,
        academic_year_id: filters.academicYearId,
        quarter_id: filters.quarterId,
        recorded_at:
          bmiData.recorded_at || new Date().toISOString().split("T")[0],
        height_cm: parseFloat(bmiData.height_cm),
        weight_kg: parseFloat(bmiData.weight_kg),
        remarks: bmiData.remarks || null,
      };

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        "/teacher/student-bmi",
        payload,
        { timeout: 10000 }
      );

      if (status !== 201 && status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record added successfully!");
      await get().fetchBmiStudents();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to add BMI record", set);
      throw new Error(message);
    }
  },

  updateStudentBmi: async (bmiRecordId, bmiData) => {
    set({ loading: true, error: null });

    try {
      if (!bmiRecordId) {
        throw new Error("Invalid BMI record ID");
      }
      if (!bmiData || typeof bmiData !== "object") {
        throw new Error("Invalid BMI data");
      }

      const filters = useFilterStore.getState().globalFilters;
      console.log("Updating BMI with filters:", filters, "Data:", bmiData); // Debug log

      // Prepare payload aligned with backend expectations
      const payload = {
        student_id: bmiData.student_id,
        academic_year_id: filters.academicYearId,
        quarter_id: filters.quarterId,
        recorded_at:
          bmiData.recorded_at || new Date().toISOString().split("T")[0],
        height_cm: parseFloat(bmiData.height_cm),
        weight_kg: parseFloat(bmiData.weight_kg),
        remarks: bmiData.remarks || null,
      };

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        `/teacher/student-bmi/${bmiRecordId}`,
        payload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record updated successfully!");
      await get().fetchBmiStudents();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update BMI record", set);
      throw new Error(message);
    }
  },

  deleteStudentBmi: async (bmiRecordId) => {
    set({ loading: true, error: null });

    try {
      if (!bmiRecordId) {
        throw new Error("Invalid BMI record ID");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.delete(
        `/teacher/student-bmi/${bmiRecordId}`,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      toast.success("BMI record deleted successfully!");
      await get().fetchBmiStudents();
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

// Error handler helper
const handleError = (err, defaultMessage, set) => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    defaultMessage;

  set({ loading: false, error: message });
  toast.error(message);
  return message;
};

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
