import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import { paginate } from "../../lib/utils";
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

/** @type {import('zustand').StoreApi<WorkloadsState & WorkloadsActions>} */
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

  fetchWorkloads: async () => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get("/teacher/workload", {
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        workloads: Array.isArray(data?.data?.teaching_load_details)
          ? data.data.teaching_load_details
          : [],
        workloadSummary: data?.data?.summary ?? null,
        quarterComparison: Array.isArray(data?.data?.quarter_comparison)
          ? data.data.quarter_comparison
          : [],
        currentQuarter: data?.current_quarter ?? null,
        currentAcademicYear: data?.current_academic_year ?? null,
        availableQuarters: Array.isArray(data?.available_quarters)
          ? data.available_quarters
          : [],
        loading: false,
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

  totalPages: () => {
    try {
      return Math.ceil(get().workloads.length / RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to calculate total pages:", {
          error: error.message,
        });
      }
      return 0;
    }
  },

  paginatedRecords: () => {
    try {
      return paginate(get().workloads, get().currentPage, RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get paginated records:", {
          error: error.message,
        });
      }
      return [];
    }
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
