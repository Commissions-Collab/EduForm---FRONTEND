import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";

const handleError = (err, defaultMessage) => {
  const data = err?.response?.data;

  if (data?.errors) {
    const messages = Object.values(data.errors).flat();

    // Show each validation message as toast
    messages.forEach((msg) => {
      toast.error(msg, {
        duration: 4000,
        position: "top-right",
      });
    });

    return messages.join(", ");
  }

  const message = data?.message || defaultMessage;
  toast.error(message, { duration: 4000, position: "top-right" });
  return message;
};

const useClassManagementStore = create((set, get) => ({
  academicYears: {},
  quarters: {},
  yearLevels: {},
  sections: {},
  subjects: {},
  loading: false,
  error: null,

  fetchAcademicYears: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-years?page=${page}`
      );
      console.log("Academic Years fetched:", data);
      set({ academicYears: data.data || {}, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load academic years");
      set({ error: message, loading: false });
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
      await get().fetchAcademicYears(1);
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
      await get().fetchAcademicYears(get().academicYears.current_page || 1);
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
      await get().fetchAcademicYears(get().academicYears.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete academic year");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchQuarters: async (page = 1, search = "") => {
    set({ loading: true, error: null, currentPage: page });
    try {
      const { data } = await axiosInstance.get(
        `/admin/quarters?page=${page}&search=${search}`
      );
      set({ quarters: data.quarters || {}, loading: false });
    } catch (err) {
      // Only show error if it's not a "no data" scenario
      if (err.response?.status !== 404) {
        const message = handleError(err, "Failed to load quarters");
        set({ error: message, loading: false });
      } else {
        // No data found - set empty state without error
        set({
          quarters: {
            data: [],
            total: 0,
            per_page: 25,
            current_page: page,
            last_page: 1,
          },
          loading: false,
        });
      }
    }
  },

  createQuarter: async (quarterDataArray) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/quarters",
        quarterDataArray
      );
      toast.success(data.message || "Quarters created successfully");
      await get().fetchQuarters(1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create quarters");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchQuarterById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/admin/quarters/${id}`);
      set({ loading: false });
      return data.quarter;
    } catch (err) {
      const message = handleError(err, "Failed to fetch quarter details");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateQuarterDates: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.patch(
        `/admin/quarters/${id}`,
        formData
      );
      toast.success("Quarter updated successfully");
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update quarter");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteQuarter: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/quarters/${id}`);
      toast.success("Quarter deleted successfully");
      await get().fetchQuarters(get().quarters.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete quarter");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchQuartersByAcademicYear: async (academicYearId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/quarters/academic-year/${academicYearId}`
      );
      set({ loading: false });
      return data.quarters || [];
    } catch (err) {
      // Don't show error for empty data - just return empty array
      if (err.response?.status === 404) {
        set({ loading: false });
        return [];
      }
      const message = handleError(err, "Failed to load quarters");
      set({ error: message, loading: false });
      throw err;
    }
  },

  fetchYearLevels: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/year-level?page=${page}`
      );
      set({ yearLevels: data, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load year levels");
      set({ error: message, loading: false });
    }
  },

  createYearLevel: async (levelData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/year-level", levelData);
      toast.success("Year level created successfully");
      await get().fetchYearLevels(1);
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
      await get().fetchYearLevels(get().yearLevels.current_page || 1);
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
      await get().fetchYearLevels(get().yearLevels.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete year level");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchSections: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/admin/section?page=${page}`);
      set({ sections: data, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load sections");
      set({ error: message, loading: false });
    }
  },

  createSection: async (sectionData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/section", sectionData);
      console.log("Section created:", data);
      toast.success("Section created successfully");
      // Refetch sections on page 1
      await get().fetchSections(1);
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
      console.log("Section updated:", data);
      toast.success("Section updated successfully");
      // Refetch sections
      await get().fetchSections(get().sections.current_page || 1);
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
      console.log("Section deleted:", data);
      toast.success("Section deleted successfully");
      // Refetch sections
      await get().fetchSections(get().sections.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete section");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchSubjects: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/admin/subjects?page=${page}`);
      set({ subjects: data || {}, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load subjects");
      set({ error: message, loading: false });
    }
  },

  createSubjects: async (subjectsData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/subjects", {
        subjects: subjectsData,
      });
      toast.success(data.message || "Subjects created successfully");
      await get().fetchSubjects(1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create subjects");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateSubject: async (id, subjectData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        `/admin/subjects/${id}`,
        subjectData
      );
      toast.success("Subject updated successfully");
      await get().fetchSubjects(get().subjects.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update subject");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteSubject: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/subjects/${id}`);
      toast.success("Subject deleted successfully");
      await get().fetchSubjects(get().subjects.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete subject");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  toggleSubjectActive: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.patch(
        `/admin/subjects/${id}/toggle-active`
      );
      toast.success("Subject status updated successfully");
      await get().fetchSubjects(get().subjects.current_page || 1);
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update subject status");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  reset: () =>
    set({
      academicYears: {},
      quarters: {},
      yearLevels: {},
      sections: {},
      subjects: {},
      loading: false,
      error: null,
    }),
}));

// Centralized event listener management
const handleUnauthorized = () => {
  useClassManagementStore.getState().reset();
};

if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", handleUnauthorized);

  // Cleanup on module unload
  window.addEventListener("unload", () => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useClassManagementStore;
