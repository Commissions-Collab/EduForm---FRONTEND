import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

// Configuration constants
const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    errorMessage =
      err.response.data?.message ||
      err.response.data?.error ||
      `Server Error: ${err.response.status}`;
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(defaultMessage, {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
  }

  set({ error: errorMessage, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

const useWorkloadsStore = create((set, get) => ({
  workloads: [],
  workloadSummary: null,
  quarterComparison: [],
  availableQuarters: [],
  currentQuarter: null,
  currentAcademicYear: null,
  currentPage: 1,
  loading: false,
  error: null,

  fetchWorkloads: async (academicYearId = null, quarterId = null) => {
    set({ loading: true, error: null });

    try {
      const params = {};
      if (academicYearId) params.academic_year_id = academicYearId;
      if (quarterId) params.quarter_id = quarterId;

      const { data, status } = await axiosInstance.get("/teacher/workload", {
        params,
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      // Map backend response to match frontend expectations
      const workloads = Array.isArray(data?.data?.teaching_load_details)
        ? data.data.teaching_load_details
        : [];

      const summary = data?.data?.summary || null;

      set({
        workloads,
        workloadSummary: summary,
        quarterComparison: Array.isArray(data?.data?.quarter_comparison)
          ? data.data.quarter_comparison
          : [],
        currentQuarter: data?.current_quarter ?? null,
        currentAcademicYear: data?.current_academic_year ?? null,
        availableQuarters: Array.isArray(data?.available_quarters)
          ? data.available_quarters
          : [],
        loading: false,
        currentPage: 1, // Reset to first page on new data
      });
    } catch (err) {
      handleError(err, "Failed to fetch workload data", set);
    }
  },

  setCurrentPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set current page:", {
          error: error.message,
          page,
        });
      }
      toast.error("Invalid page number");
    }
  },

  // Get total pages based on current workloads length
  getTotalPages: (filteredCount = null) => {
    const count = filteredCount ?? get().workloads.length;
    return Math.ceil(count / RECORDS_PER_PAGE);
  },

  // Get paginated records
  getPaginatedRecords: (filteredRecords = null) => {
    const records = filteredRecords ?? get().workloads;
    const currentPage = get().currentPage;
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    const endIndex = startIndex + RECORDS_PER_PAGE;
    return records.slice(startIndex, endIndex);
  },

  resetWorkloadsStore: () => {
    try {
      set({
        workloads: [],
        workloadSummary: null,
        quarterComparison: [],
        availableQuarters: [],
        currentQuarter: null,
        currentAcademicYear: null,
        currentPage: 1,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset workloads store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset workloads data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useWorkloadsStore.getState().resetWorkloadsStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useWorkloadsStore;
