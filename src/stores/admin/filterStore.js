import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import { getItem, setItem, removeItem } from "../../lib/utils";
import toast from "react-hot-toast";

const useFilterStore = create((set, get) => ({
  globalFilters: {
    academicYearId: getItem("academicYearId", false, sessionStorage) || null,
    quarterId: getItem("quarterId", false, sessionStorage) || null,
    sectionId: getItem("sectionId", false, sessionStorage) || null,
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

  initializeGlobalFilters: () => {
    const academicYearId = getItem("academicYearId", false, sessionStorage);
    const quarterId = getItem("quarterId", false, sessionStorage);
    const sectionId = getItem("sectionId", false, sessionStorage);

    set({
      globalFilters: {
        academicYearId: academicYearId ? parseInt(academicYearId, 10) : null,
        quarterId: quarterId ? parseInt(quarterId, 10) : null,
        sectionId: sectionId ? parseInt(sectionId, 10) : null,
      },
    });
  },

  setGlobalFilters: (filters) => {
    const prev = get().globalFilters;
    const next = { ...prev, ...filters };

    // Persist to sessionStorage, using '' for null
    setItem(
      "academicYearId",
      next.academicYearId ? String(next.academicYearId) : "",
      sessionStorage
    );
    setItem(
      "quarterId",
      next.quarterId ? String(next.quarterId) : "",
      sessionStorage
    );
    setItem(
      "sectionId",
      next.sectionId ? String(next.sectionId) : "",
      sessionStorage
    );

    set({ globalFilters: next });

    // Dispatch event for other components/stores to react
    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", { detail: next })
    );
  },

  clearGlobalFilters: () => {
    removeItem("academicYearId", sessionStorage);
    removeItem("quarterId", sessionStorage);
    removeItem("sectionId", sessionStorage);

    set({
      globalFilters: {
        academicYearId: null,
        quarterId: null,
        sectionId: null,
      },
    });

    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: { academicYearId: null, quarterId: null, sectionId: null },
      })
    );
  },

  fetchGlobalFilterOptions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        "/teacher/academic-records/filter-options"
      );

      const rawYears = res.data?.academic_years || [];
      const sections = res.data?.sections || [];

      const academicYears = rawYears.map((y) => ({
        id: y.id,
        name: y.name,
        is_current: !!y.is_current,
        quarters: Array.isArray(y.quarters) ? y.quarters : [],
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
        !globalFilters.academicYearId ||
        !globalFilters.quarterId ||
        !globalFilters.sectionId;

      if (shouldSetDefaults && currentYear) {
        const defaultQuarterId = availableQuarters[0]?.id || null;
        const defaultSectionId = sections[0]?.id || null;

        get().setGlobalFilters({
          academicYearId: currentYear.id,
          quarterId: defaultQuarterId,
          sectionId: defaultSectionId,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to load filter options";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  updateQuartersForAcademicYear: (academicYearId) => {
    if (!academicYearId) return;

    const { filterOptions } = get();
    const selectedYear = filterOptions.academicYears.find(
      (y) => y.id === academicYearId
    );

    if (selectedYear) {
      const quarters = selectedYear.quarters?.length
        ? selectedYear.quarters
        : filterOptions.quarters;
      set({
        filterOptions: { ...filterOptions, quarters },
      });
    }
  },

  updateSectionsForAcademicYear: async (academicYearId) => {
    if (!academicYearId) return;

    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        `/teacher/academic-records/filter-options?academic_year_id=${academicYearId}`
      );
      const sections = res.data?.sections || [];
      const { filterOptions } = get();
      set({ filterOptions: { ...filterOptions, sections }, loading: false });
    } catch (err) {
      const message = err?.response?.data?.message || "Error updating sections";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  resetFilterStore: () => {
    removeItem("academicYearId", sessionStorage);
    removeItem("quarterId", sessionStorage);
    removeItem("sectionId", sessionStorage);
    set({
      globalFilters: {
        academicYearId: null,
        quarterId: null,
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
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useFilterStore.getState().resetFilterStore();
});

export default useFilterStore;
