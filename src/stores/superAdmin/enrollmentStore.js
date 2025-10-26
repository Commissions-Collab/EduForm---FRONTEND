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
  students: [],
  pagination: { current_page: 1, per_page: 25, total: 0 },
  academicYears: [],
  yearLevels: [],
  sections: [],
  loading: false,
  error: null,

  fetchEnrollments: async (page = 1, perPage = 25, skipToast = false) => {
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
    } catch (err) {
      const message = handleError(err, "Failed to load enrollments");
      set({ error: message, enrollments: [], loading: false });
      if (!skipToast) toast.error(message);
    }
  },

  fetchStudents: async (showToast = true) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        "/admin/enrollment-students?page=1&per_page=1000"
      );

      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch students");
      }
      const students = extractData(data, "data");
      console.log("Fetched Students:", students);
      set({ students, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load students");
      set({ error: message, students: [], loading: false });
      if (showToast) toast.error(message);
    }
  },

  fetchAcademicYears: async (showToast = true) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        "/admin/enrollment-academic-years?page=1&per_page=100"
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch academic years");
      }
      const academicYears = extractData(data, "data");
      console.log("Fetched Academic Years:", academicYears);
      set({ academicYears, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load academic years");
      set({ error: message, academicYears: [], loading: false });
      if (showToast) toast.error(message);
    }
  },

  fetchYearLevels: async (showToast = true) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        "/admin/enrollment-year-levels?page=1&per_page=100"
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch year levels");
      }
      const yearLevels = extractData(data, "data");
      console.log("Fetched Year Levels:", yearLevels);
      set({ yearLevels, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load year levels");
      set({ error: message, yearLevels: [], loading: false });
      if (showToast) toast.error(message);
    }
  },

  fetchSections: async (showToast = true) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        "/admin/enrollment-sections?page=1&per_page=100"
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch sections");
      }
      // Extract sections data - handle pagination wrapper
      const sections = Array.isArray(data.data?.data)
        ? data.data.data
        : Array.isArray(data.data)
        ? data.data
        : [];

      console.log("Raw API Response:", data);
      console.log("Fetched Sections:", sections);
      console.log("Sections count:", sections.length);
      if (sections.length > 0) {
        console.log("First section structure:", sections[0]);
      }

      set({ sections, loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load sections");
      set({ error: message, sections: [], loading: false });
      if (showToast) toast.error(message);
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
        get().pagination.per_page,
        false
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
        "/admin/enrollments/bulk-store",
        bulkData
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to create bulk enrollments");
      }
      set({ loading: false });
      toast.success(`${data.count || 0} students enrolled successfully`);
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page,
        false
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
        get().pagination.per_page,
        false
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
        get().pagination.per_page,
        false
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
      toast.success(`${data.count || 0} students promoted successfully`);
      await get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page,
        false
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
      students: [],
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

if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", handleUnauthorized);

  // Cleanup on module unload
  window.addEventListener("unload", () => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useEnrollmentStore;
