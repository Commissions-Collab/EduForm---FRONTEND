import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import { getItem, setItem, removeItem } from "../../lib/utils";
import toast from "react-hot-toast";

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

/**
 * SuperAdmin Filter Store
 * Separate from teacher filter store to handle super admin specific filtering
 * Super admin has access to all sections and academic years
 */
const useSuperAdminFilterStore = create((set, get) => ({
  globalFilters: {
    academicYearId:
      getItem("superadmin_academicYearId", false, sessionStorage) || null,
    sectionId: getItem("superadmin_sectionId", false, sessionStorage) || null,
  },
  filterOptions: {
    academicYears: [],
    quarters: [
      { id: 1, name: "1st Quarter" },
      { id: 2, name: "2nd Quarter" },
      { id: 3, name: "3rd Quarter" },
      { id: 4, name: "4th Quarter" },
    ],
    sections: [],
  },
  loading: false,
  error: null,

  /**
   * Initialize global filters from session storage
   */
  initializeGlobalFilters: () => {
    try {
      const academicYearId = getItem(
        "superadmin_academicYearId",
        false,
        sessionStorage
      );
      const sectionId = getItem("superadmin_sectionId", false, sessionStorage);

      set({
        globalFilters: {
          academicYearId: academicYearId
            ? Number.parseInt(academicYearId, 10)
            : null,
          sectionId: sectionId ? Number.parseInt(sectionId, 10) : null,
        },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to initialize super admin global filters:", {
          error: error.message,
        });
      }
      toast.error("Failed to initialize filters");
    }
  },

  /**
   * Set global filters
   */
  setGlobalFilters: (filters) => {
    try {
      const prev = get().globalFilters;
      const next = { ...prev, ...filters };

      // Validate filter values
      if (
        filters.academicYearId !== undefined &&
        filters.academicYearId !== null &&
        !Number.isInteger(Number(filters.academicYearId))
      ) {
        throw new Error("Invalid academic year ID");
      }
      if (
        filters.sectionId !== undefined &&
        filters.sectionId !== null &&
        !Number.isInteger(Number(filters.sectionId))
      ) {
        throw new Error("Invalid section ID");
      }

      // Persist to sessionStorage with super admin prefix
      setItem(
        "superadmin_academicYearId",
        next.academicYearId ? String(next.academicYearId) : "",
        sessionStorage
      );
      setItem(
        "superadmin_sectionId",
        next.sectionId ? String(next.sectionId) : "",
        sessionStorage
      );

      set({ globalFilters: next });

      // Dispatch event for other components/stores to react
      window.dispatchEvent(
        new CustomEvent("superadminGlobalFiltersChanged", { detail: next })
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set super admin global filters:", {
          error: error.message,
          filters,
        });
      }
      toast.error(error.message || "Failed to set filters");
    }
  },

  /**
   * Clear global filters
   */
  clearGlobalFilters: () => {
    try {
      removeItem("superadmin_academicYearId", sessionStorage);
      removeItem("superadmin_sectionId", sessionStorage);

      const clearedFilters = {
        academicYearId: null,
        sectionId: null,
      };

      set({ globalFilters: clearedFilters });

      window.dispatchEvent(
        new CustomEvent("superadminGlobalFiltersChanged", {
          detail: clearedFilters,
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to clear super admin global filters:", {
          error: error.message,
        });
      }
      toast.error("Failed to clear filters");
    }
  },

  /**
   * Fetch global filter options for super admin
   * Super admin can access all sections and academic years
   */
  fetchGlobalFilterOptions: async () => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get(
        "/admin/filter-options",
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const rawYears = Array.isArray(data?.academic_years)
        ? data.academic_years
        : [];
      const sections = Array.isArray(data?.sections) ? data.sections : [];

      const academicYears = rawYears.map((y) => ({
        id: Number(y.id) || 0,
        name: String(y.name) || "",
        is_current: !!y.is_current,
        quarters: Array.isArray(y.quarters)
          ? y.quarters.map((q) => ({
              id: Number(q.id) || 0,
              name: String(q.name) || "",
            }))
          : [],
      }));

      const currentYear =
        academicYears.find((y) => y.is_current) || academicYears[0] || null;
      const availableQuarters = currentYear?.quarters?.length
        ? currentYear.quarters
        : get().filterOptions.quarters;

      set({
        filterOptions: {
          academicYears: academicYears.map(({ id, name, is_current }) => ({
            id,
            name,
            is_current,
          })),
          quarters: availableQuarters,
          sections,
        },
        loading: false,
      });

      const { globalFilters } = get();
      const shouldSetDefaults =
        !globalFilters.academicYearId || !globalFilters.sectionId;

      if (shouldSetDefaults && currentYear) {
        const defaultSectionId = sections[0]?.id || null;

        get().setGlobalFilters({
          academicYearId: currentYear.id,
          sectionId: defaultSectionId,
        });
      }
    } catch (err) {
      handleError(err, "Unable to load filter options", set);
    }
  },

  /**
   * Update quarters for selected academic year
   */
  updateQuartersForAcademicYear: (academicYearId) => {
    try {
      if (!Number.isInteger(Number(academicYearId))) {
        throw new Error("Invalid academic year ID");
      }

      const { filterOptions } = get();
      const selectedYear = filterOptions.academicYears.find(
        (y) => y.id === Number(academicYearId)
      );

      if (selectedYear) {
        const quarters = selectedYear.quarters?.length
          ? selectedYear.quarters
          : filterOptions.quarters;
        set({
          filterOptions: { ...filterOptions, quarters },
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to update quarters:", {
          error: error.message,
          academicYearId,
        });
      }
      toast.error("Failed to update quarters");
    }
  },

  /**
   * Update sections for selected academic year
   * Super admin can access all sections
   */
  updateSectionsForAcademicYear: async (academicYearId) => {
    try {
      if (!Number.isInteger(Number(academicYearId))) {
        throw new Error("Invalid academic year ID");
      }

      set({ loading: true, error: null });

      const { data, status } = await axiosInstance.get(
        `/admin/sections-by-year/${academicYearId}`,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const sections = Array.isArray(data?.sections) ? data.sections : [];
      const { filterOptions } = get();
      set({ filterOptions: { ...filterOptions, sections }, loading: false });
    } catch (err) {
      handleError(err, "Error updating sections", set);
    }
  },

  /**
   * Reset filter store
   */
  resetFilterStore: () => {
    try {
      removeItem("superadmin_academicYearId", sessionStorage);
      removeItem("superadmin_sectionId", sessionStorage);

      set({
        globalFilters: {
          academicYearId: null,
          sectionId: null,
        },
        filterOptions: {
          academicYears: [],
          quarters: [
            { id: 1, name: "1st Quarter" },
            { id: 2, name: "2nd Quarter" },
            { id: 3, name: "3rd Quarter" },
            { id: 4, name: "4th Quarter" },
          ],
          sections: [],
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset super admin filter store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset filter store");
    }
  },

  /**
   * Clear only errors
   */
  clearErrors: () => {
    set({ error: null });
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useSuperAdminFilterStore.getState().resetFilterStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useSuperAdminFilterStore;
