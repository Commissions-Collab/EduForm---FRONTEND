import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
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

/** @type {import('zustand').StoreApi<StudentRequestsState & StudentRequestsActions>} */
const useStudentRequestsStore = create((set, get) => ({
  studentRequests: {
    approved: [],
    pending: [],
    rejected: [],
  },
  currentPage: 1,
  loading: false,
  error: null,

  fetchStudentRequests: async () => {
    set({ loading: true, error: null });

    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/teacher/students/pending", { timeout: 10000 }),
        axiosInstance.get("/teacher/students/approved", { timeout: 10000 }),
        axiosInstance.get("/teacher/students/rejected", { timeout: 10000 }),
      ]);

      const validateResponse = (res, type) => {
        if (res.status !== 200) {
          throw new Error(`Invalid response from ${type} requests endpoint`);
        }
        return Array.isArray(res.data.requests?.data || res.data)
          ? res.data.requests?.data || res.data
          : [];
      };

      set({
        studentRequests: {
          pending: validateResponse(pendingRes, "pending"),
          approved: validateResponse(approvedRes, "approved"),
          rejected: validateResponse(rejectedRes, "rejected"),
        },
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch student requests", set);
    }
  },

  approveStudentRequest: async (id) => {
    set({ loading: true, error: null });

    try {
      if (!id || (typeof id !== "string" && typeof id !== "number")) {
        throw new Error("Invalid request ID");
      }

      await fetchCsrfToken();
      const { status } = await axiosInstance.put(
        `/teacher/student-requests/${id}/approve`,
        {},
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error("Invalid response from server");
      }

      await get().fetchStudentRequests();
      set({ loading: false });
      toast.success("Student request approved successfully!");
    } catch (err) {
      const message = handleError(
        err,
        "Failed to approve student request",
        set
      );
      throw new Error(message);
    }
  },

  rejectStudentRequest: async (id) => {
    set({ loading: true, error: null });

    try {
      if (!id || (typeof id !== "string" && typeof id !== "number")) {
        throw new Error("Invalid request ID");
      }

      await fetchCsrfToken();
      const { status } = await axiosInstance.put(
        `/teacher/student-requests/${id}/reject`,
        {},
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error("Invalid response from server");
      }

      await get().fetchStudentRequests();
      set({ loading: false });
      toast.success("Student request rejected successfully!");
    } catch (err) {
      const message = handleError(err, "Failed to reject student request", set);
      throw new Error(message);
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
      return Math.ceil(get().studentRequests.pending.length / RECORDS_PER_PAGE);
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
      return paginate(
        get().studentRequests.pending,
        get().currentPage,
        RECORDS_PER_PAGE
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get paginated records:", {
          error: error.message,
        });
      }
      return [];
    }
  },

  resetStudentRequestsStore: () => {
    try {
      set({
        studentRequests: {
          approved: [],
          pending: [],
          rejected: [],
        },
        currentPage: 1,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset student requests store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset student requests data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useStudentRequestsStore.getState().resetStudentRequestsStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useStudentRequestsStore;
