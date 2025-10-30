import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;
  let errorData = {};

  if (err.response) {
    errorMessage =
      err.response.data?.message ||
      err.response.data?.error ||
      `Server Error: ${err.response.status}`;
    errorData = err.response.data;
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  console.error(defaultMessage, {
    status: err.response?.status,
    data: err.response?.data,
  });
  set({ error: errorMessage, errorData, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

const usePromotionViewStore = create((set, get) => ({
  // State
  students: [],
  statistics: null,
  filterOptions: {},
  currentPage: 1,
  loading: false,
  error: null,
  errorData: {},
  appliedFilters: {
    academicYearId: null,
    sectionId: null,
  },

  // Fetch filter options
  fetchFilterOptions: async () => {
    set({ loading: true, error: null, errorData: {} });

    try {
      const { data, status } = await axiosInstance.get(
        "/admin/promotion-reports/view-options",
        {
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        filterOptions: {
          academic_years: data.academic_years || [],
          sections: data.sections || [],
          sections_by_year: data.sections_by_year || [],
          message: data.message || null,
          has_accessible_sections: data.has_accessible_sections || false,
        },
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch filter options", set);
    }
  },

  // Fetch promotion report data
  fetchPromotionReport: async (filters) => {
    set({ loading: true, error: null, errorData: {} });

    try {
      const { data, status } = await axiosInstance.get(
        "/admin/promotion-reports/students-view",
        {
          params: {
            academic_year_id: filters.academicYearId,
            section_id: filters.sectionId,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        students: data.data?.students || [],
        statistics: data.data?.statistics || null,
        appliedFilters: filters,
        error: null,
        errorData: {},
        loading: false,
      });
    } catch (err) {
      // Handle 403 errors specifically (incomplete grade data)
      if (err.response?.status === 403) {
        const errorMessage =
          err.response.data?.message ||
          "This section has incomplete grade data and cannot be viewed yet.";
        const completion = err.response.data?.completion_percentage || 0;

        set({
          error: errorMessage,
          errorData: {
            status: 403,
            completion_percentage: completion,
            message: errorMessage,
            accessible: false,
          },
          loading: false,
        });

        toast.error(errorMessage);
      } else {
        handleError(err, "Failed to fetch promotion report", set);
      }
    }
  },

  // Export promotion report
  exportPromotionReport: async (filters) => {
    set({ loading: true, error: null, errorData: {} });

    try {
      const { data, status } = await axiosInstance.get(
        "/admin/promotion-reports/export",
        {
          params: {
            academic_year_id: filters.academicYearId,
            section_id: filters.sectionId,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false, error: null, errorData: {} });
      toast.success("Report exported successfully");
      return data;
    } catch (err) {
      handleError(err, "Failed to export report", set);
      return null;
    }
  },

  // Set current page
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  // Reset store
  resetStore: () => {
    set({
      students: [],
      statistics: null,
      filterOptions: {},
      currentPage: 1,
      loading: false,
      error: null,
      errorData: {},
      appliedFilters: {
        academicYearId: null,
        sectionId: null,
      },
    });
  },
}));

export default usePromotionViewStore;
