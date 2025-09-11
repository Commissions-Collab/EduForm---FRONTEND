import { create } from "zustand";
import useFilterStore from "./filterStore";
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

/** @type {import('zustand').StoreApi<PromotionState & PromotionActions>} */
const usePromotionStore = create((set, get) => ({
  promotionStudents: [],
  currentPage: 1,
  overallPromotionStats: null,
  isPromotionAccessible: false,
  promotionMessage: null,
  loading: false,
  error: null,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.academicYearId || !filters.sectionId) {
        const message = "Please select Academic Year and Section";
        set({
          error: message,
          promotionMessage: { title: "Missing Filters", content: message },
          loading: false,
        });
        toast.error(message);
        return;
      }

      const { data, status } = await axiosInstance.get(
        "/teacher/promotion-reports/statistics",
        {
          params: {
            academic_year_id: Number(filters.academicYearId),
            section_id: Number(filters.sectionId),
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const transformedStudents = (
        Array.isArray(data?.students) ? data.students : []
      ).map((student) => ({
        student_id: String(student.studentId || student.id || ""),
        student_name: String(student.student_name || student.name || "Unknown"),
        final_average: Number(
          student.final_average || student.average_grade || 0
        ),
        attendance_percentage: Number(
          student.attendance_percentage || student.attendance || 0
        ),
        honor_classification: String(
          student.honor_classification || student.honor || "No Honor"
        ),
        promotion_status: String(
          student.promotion_status || student.status || "Pending"
        ),
      }));

      const transformedStats = data.overall_statistics
        ? {
            total: Number(
              data.overall_statistics.total_students ||
                data.overall_statistics.total ||
                0
            ),
            promoted: Number(
              data.overall_statistics.promoted_students ||
                data.overall_statistics.promoted ||
                0
            ),
            promotedPercentage: Number(
              data.overall_statistics.promoted_percentage ||
                data.overall_statistics.promotion_rate ||
                0
            ),
            withHonors: Number(
              data.overall_statistics.honors_students ||
                data.overall_statistics.with_honors ||
                0
            ),
            honorsPercentage: Number(
              data.overall_statistics.honors_percentage ||
                data.overall_statistics.honors_rate ||
                0
            ),
            retained: Number(
              data.overall_statistics.retained_students ||
                data.overall_statistics.retained ||
                0
            ),
            retainedPercentage: Number(
              data.overall_statistics.retained_percentage ||
                data.overall_statistics.retention_rate ||
                0
            ),
          }
        : null;

      set({
        promotionStudents: transformedStudents,
        overallPromotionStats: transformedStats,
        isPromotionAccessible: Boolean(data.accessible ?? false),
        promotionMessage: null,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch promotion data", set);
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
      return Math.ceil(get().promotionStudents.length / RECORDS_PER_PAGE);
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
        get().promotionStudents,
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

  resetPromotionStore: () => {
    try {
      set({
        promotionStudents: [],
        currentPage: 1,
        overallPromotionStats: null,
        isPromotionAccessible: false,
        promotionMessage: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset promotion store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset promotion data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  usePromotionStore.getState().resetPromotionStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default usePromotionStore;
