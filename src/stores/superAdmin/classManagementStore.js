import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import toast from "react-hot-toast";

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
      console.log("fetchAcademicYears Response:", data);
      const years =
        data.data?.data || data.years || data.result || data.data || [];
      set({ academicYears: Array.isArray(years) ? years : [], loading: false });
      console.log("academicYears set to:", years);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load academic years";
      console.error(
        "fetchAcademicYears Error:",
        err.response?.status,
        err.response?.data
      );
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
      toast.success("Academic year created successfully!");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create academic year";
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
      toast.success("Academic year updated successfully!");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update academic year";
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
      toast.success("Academic year deleted successfully!");
      get().fetchAcademicYears();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete academic year";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchYearLevels: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/year-level");
      console.log("fetchYearLevels Response:", data);
      set({ yearLevels: data.yearLevel?.data || [], loading: false });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load year levels";
      console.error(
        "fetchYearLevels Error:",
        err.response?.status,
        err.response?.data
      );
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createYearLevel: async (levelData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/year-level", levelData);
      toast.success("Year level created successfully!");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create year level";
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
      toast.success("Year level updated successfully!");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update year level";
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
      toast.success("Year level deleted successfully!");
      get().fetchYearLevels();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete year level";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchSections: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/section");
      console.log("fetchSections Response:", data);
      set({ sections: data.sections?.data || [], loading: false });
    } catch (err) {
      const message = err?.response?.data?.message || "Could not load sections";
      console.error(
        "fetchSections Error:",
        err.response?.status,
        err.response?.data
      );
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createSection: async (sectionData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/section", sectionData);
      toast.success("Section created successfully!");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create section";
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
      toast.success("Section updated successfully!");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update section";
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
      toast.success("Section deleted successfully!");
      get().fetchSections();
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete section";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  resetClassManagementStore: () => {
    set({
      academicYears: [],
      yearLevels: [],
      sections: [],
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useClassManagementStore.getState().resetClassManagementStore();
});

export default useClassManagementStore;
