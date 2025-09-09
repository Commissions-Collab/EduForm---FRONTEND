import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";

const handleError = (err, defaultMessage) => {
  const message = err?.response?.data?.message || defaultMessage;
  if (err.response?.status === 401 || err.response?.status === 403) {
    window.dispatchEvent(new Event("unauthorized"));
  }
  return message;
};

const extractData = (data, key) => {
  return Array.isArray(data[key]?.data || data[key] || data.data || data)
    ? data[key]?.data || data[key] || data.data || data
    : [];
};

const useEnrollmentStore = create((set, get) => ({
  enrollments: [],
  pagination: { current_page: 1, per_page: 25, total: 0 },
  academicYears: [],
  yearLevels: [],
  sections: [],
  loading: false,
  error: null,

  fetchEnrollments: async (page = 1, perPage = 25) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/enrollments?page=${page}&per_page=${perPage}`
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollments");
      }
      const enrollments = extractData(data, "data");
      set({
        enrollments,
        pagination: {
          current_page: data.data?.current_page || 1,
          per_page: data.data?.per_page || perPage,
          total: data.data?.total || 0,
        },
        loading: false,
      });
      if (enrollments.length === 0) {
        toast.error("No enrollments found. Please check the data source.");
      }
    } catch (err) {
      const message = handleError(err, "Failed to load enrollments");
      set({ error: message, enrollments: [], loading: false });
      toast.error(message);
    }
  },

  fetchAcademicYears: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-years?page=1");
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch academic years");
      }
      const academicYears =
        extractData(data, "data") || extractData(data, "academic_years");
      set({ academicYears, loading: false });
      if (academicYears.length === 0) {
        toast.error(
          "No academic years available. Please add academic years in the admin panel."
        );
      }
    } catch (err) {
      const message = handleError(err, "Failed to load academic years");
      set({ error: message, academicYears: [], loading: false });
      toast.error(message);
    }
  },

  fetchYearLevels: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/year-level?page=1");
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch year levels");
      }
      const yearLevels = extractData(data, "yearLevel");
      set({ yearLevels, loading: false });
      if (yearLevels.length === 0) {
        toast.error(
          "No grade levels available. Please add grade levels in the admin panel."
        );
      }
    } catch (err) {
      const message = handleError(err, "Failed to load year levels");
      set({ error: message, yearLevels: [], loading: false });
      toast.error(message);
    }
  },

  fetchSections: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/section?page=1");
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch sections");
      }
      const sections = extractData(data, "sections");
      set({ sections, loading: false });
      if (sections.length === 0) {
        toast.error(
          "No sections available. Please add sections in the admin panel."
        );
      }
    } catch (err) {
      const message = handleError(err, "Failed to load sections");
      set({ error: message, sections: [], loading: false });
      toast.error(message);
    }
  },

  createEnrollment: async (enrollmentData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/enrollments",
        enrollmentData
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to create enrollment");
      }
      set({ loading: false });
      toast.success("Enrollment created successfully");
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create enrollment");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  bulkCreateEnrollments: async (bulkData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/enrollments/bulk-update",
        bulkData
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to create bulk enrollments");
      }
      set({ loading: false });
      toast.success("Bulk enrollments created successfully");
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create bulk enrollments");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchEnrollment: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/admin/enrollments/${id}`);
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollment");
      }
      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to load enrollment");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateEnrollment: async (id, enrollmentData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        `/admin/enrollments/${id}`,
        enrollmentData
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to update enrollment");
      }
      set({ loading: false });
      toast.success("Enrollment updated successfully");
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update enrollment");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteEnrollment: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/enrollments/${id}`);
      if (data.success === false) {
        throw new Error(data.message || "Failed to delete enrollment");
      }
      set({ loading: false });
      toast.success("Enrollment deleted successfully");
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete enrollment");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  promoteStudents: async (promotionData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/enrollments/promote",
        promotionData
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to promote students");
      }
      set({ loading: false });
      toast.success("Students promoted successfully");
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to promote students");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      enrollments: [],
      pagination: { current_page: 1, per_page: 25, total: 0 },
      academicYears: [],
      yearLevels: [],
      sections: [],
      loading: false,
      error: null,
    }),
}));

// Centralized event listener management
const handleUnauthorized = () => {
  useEnrollmentStore.getState().reset();
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
window.addEventListener("unload", () => {
  window.removeEventListener("unauthorized", handleUnauthorized);
});

export default useEnrollmentStore;
