import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { downloadExcel } from "../../lib/utils";
import toast from "react-hot-toast";

const useBmiStore = create((set, get) => ({
  bmiStudents: [],
  loading: false,
  error: null,

  fetchBmiStudents: async (showToast = false) => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      console.log("Fetching BMI with filters:", filters);

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

      // Handle both wrapped and direct responses
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
      console.log("Adding BMI with filters:", filters, "Data:", bmiData);

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

      // Show success toast - SINGLE SOURCE
      toast.success("BMI record added successfully!");

      // Refresh data without showing another toast
      await get().fetchBmiStudents(false);
      set({ loading: false });

      return data;
    } catch (err) {
      // Error handler shows toast
      handleError(err, "Failed to add BMI record", set);
      throw new Error(err?.message || "Failed to add BMI record");
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
      console.log("Updating BMI with filters:", filters, "Data:", bmiData);

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

      // Show success toast - SINGLE SOURCE
      toast.success("BMI record updated successfully!");

      // Refresh data without showing another toast
      await get().fetchBmiStudents(false);
      set({ loading: false });

      return data;
    } catch (err) {
      // Error handler shows toast
      handleError(err, "Failed to update BMI record", set);
      throw new Error(err?.message || "Failed to update BMI record");
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

      // Show success toast - SINGLE SOURCE
      toast.success("BMI record deleted successfully!");

      // Refresh data without showing another toast
      await get().fetchBmiStudents(false);
      set({ loading: false });

      return data;
    } catch (err) {
      // Error handler shows toast
      handleError(err, "Failed to delete BMI record", set);
      throw new Error(err?.message || "Failed to delete BMI record");
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

  /**
   * Export SF8 Excel - Learner's Basic Health and Nutrition Report
   */
  exportSF8Excel: async () => {
    set({ loading: true, error: null });
    try {
      const filters = useFilterStore.getState().globalFilters;

      if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
        throw new Error("Section, Academic Year, and Quarter must be selected");
      }

      const response = await axiosInstance.get(
        `/teacher/student-bmi/export-sf8-excel`,
        {
          responseType: "blob",
          params: {
            section_id: filters.sectionId,
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
          },
          headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
          timeout: 30000,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid Excel response from server");
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'SF8_Health_Report.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      downloadExcel(blob, fileName);
      set({ loading: false });
      toast.success("SF8 Excel file downloaded successfully");
    } catch (err) {
      handleError(err, "SF8 Excel export failed", set);
    }
  },
}));

/**
 * Error handler helper
 * Shows toast only once per error
 */
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
