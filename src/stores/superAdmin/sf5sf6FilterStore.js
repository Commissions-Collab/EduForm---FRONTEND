import { create } from "zustand";
import toast from "react-hot-toast";
import { getItem, removeItem, setItem } from "../../lib/utils";

const useSF5SF6FilterStore = create((set, get) => ({
  globalFilters: {
    academicYearId:
      getItem("sf5sf6_academicYearId", false, sessionStorage) || null,
    sectionId: getItem("sf5sf6_sectionId", false, sessionStorage) || null,
    formType: getItem("sf5sf6_formType", false, sessionStorage) || "sf5",
  },

  setGlobalFilters: (filters) => {
    try {
      const prev = get().globalFilters;
      const next = { ...prev, ...filters };

      if (filters.academicYearId !== undefined) {
        setItem(
          "sf5sf6_academicYearId",
          next.academicYearId ? String(next.academicYearId) : "",
          sessionStorage
        );
      }

      if (filters.sectionId !== undefined) {
        setItem(
          "sf5sf6_sectionId",
          next.sectionId ? String(next.sectionId) : "",
          sessionStorage
        );
      }

      if (filters.formType !== undefined) {
        setItem("sf5sf6_formType", next.formType, sessionStorage);
      }

      set({ globalFilters: next });

      window.dispatchEvent(
        new CustomEvent("sf5sf6FiltersChanged", { detail: next })
      );
    } catch (error) {
      console.error("Failed to set filters:", error.message);
      toast.error("Failed to set filters");
    }
  },

  clearGlobalFilters: () => {
    try {
      removeItem("sf5sf6_academicYearId", sessionStorage);
      removeItem("sf5sf6_sectionId", sessionStorage);
      removeItem("sf5sf6_formType", sessionStorage);

      const clearedFilters = {
        academicYearId: null,
        sectionId: null,
        formType: "sf5",
      };

      set({ globalFilters: clearedFilters });

      window.dispatchEvent(
        new CustomEvent("sf5sf6FiltersChanged", { detail: clearedFilters })
      );
    } catch (error) {
      console.error("Failed to clear filters:", error.message);
      toast.error("Failed to clear filters");
    }
  },

  resetFilterStore: () => {
    try {
      removeItem("sf5sf6_academicYearId", sessionStorage);
      removeItem("sf5sf6_sectionId", sessionStorage);
      removeItem("sf5sf6_formType", sessionStorage);

      set({
        globalFilters: {
          academicYearId: null,
          sectionId: null,
          formType: "sf5",
        },
      });
    } catch (error) {
      console.error("Failed to reset filter store:", error.message);
      toast.error("Failed to reset filter store");
    }
  },
}));

export default useSF5SF6FilterStore;
