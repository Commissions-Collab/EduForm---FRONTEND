import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";

const handleError = (err, defaultMessage) => {
  return err?.response?.data?.message || defaultMessage;
};

const useClassManagementStore = create((set, get) => ({
  academicYears: [],
  yearLevels: [],
  sections: [],
  loading: false,
  error: null,

  fetchAcademicYears: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-years");
      const years =
        data.data?.data || data.years || data.result || data.data || [];
      set({ academicYears: Array.isArray(years) ? years : [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load academic years");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  clearError: () => set({ error: null }),

  createAcademicYear: async (yearData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/academic-years",
        yearData
      );
      toast.success("Academic year created successfully");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create academic year");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateAcademicYear: async (id, yearData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.patch(
        `/admin/academic-years/${id}`,
        yearData
      );
      toast.success("Academic year updated successfully");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update academic year");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteAcademicYear: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(
        `/admin/academic-years/${id}`
      );
      toast.success("Academic year deleted successfully");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete academic year");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchYearLevels: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/year-level");
      set({ yearLevels: data.yearLevel?.data || [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load year levels");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createYearLevel: async (levelData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/year-level", levelData);
      toast.success("Year level created successfully");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create year level");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateYearLevel: async (id, levelData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.patch(
        `/admin/year-level/${id}`,
        levelData
      );
      toast.success("Year level updated successfully");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update year level");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteYearLevel: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/year-level/${id}`);
      toast.success("Year level deleted successfully");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete year level");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchSections: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/section");
      set({ sections: data.sections?.data || [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load sections");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createSection: async (sectionData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/section", sectionData);
      toast.success("Section created successfully");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create section");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateSection: async (id, sectionData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.patch(
        `/admin/section/${id}`,
        sectionData
      );
      toast.success("Section updated successfully");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update section");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteSection: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/section/${id}`);
      toast.success("Section deleted successfully");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete section");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  reset: () =>
    set({
      academicYears: [],
      yearLevels: [],
      sections: [],
      loading: false,
      error: null,
    }),
}));

// Centralized event listener management
const handleUnauthorized = () => {
  useClassManagementStore.getState().reset();
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
window.addEventListener("unload", () => {
  window.removeEventListener("unauthorized", handleUnauthorized);
});

export default useClassManagementStore;
