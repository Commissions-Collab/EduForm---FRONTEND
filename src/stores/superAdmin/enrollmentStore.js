import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import toast from "react-hot-toast";

const useEnrollmentStore = create((set, get) => ({
  enrollments: [],
  pagination: {
    current_page: 1,
    per_page: 25,
    total: 0,
  },
  academicYears: [],
  yearLevels: [],
  sections: [],
  loading: false,
  error: null,

  fetchEnrollments: async (page = 1, perPage = 25, retries = 2) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/enrollments?page=${page}&per_page=${perPage}`
      );
      console.log("fetchEnrollments Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollments");
      }
      const enrollments = Array.isArray(data.data?.data) ? data.data.data : [];
      console.log(
        "fetchEnrollments Extracted:",
        JSON.stringify(enrollments, null, 2)
      );
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
        console.warn("fetchEnrollments: No enrollments returned");
        toast.error("No enrollments found. Please check the data source.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load enrollments";
      console.error(
        "fetchEnrollments Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      if (
        retries > 0 &&
        (err.response?.status === 500 || err.response?.status === 503)
      ) {
        console.log(`Retrying fetchEnrollments (${retries} retries left)`);
        setTimeout(
          () => get().fetchEnrollments(page, perPage, retries - 1),
          1000
        );
        return;
      }
      set({ error: message, enrollments: [], loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  fetchAcademicYears: async (retries = 2) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-years?page=1");
      console.log(
        "fetchAcademicYears Raw Response:",
        JSON.stringify(data, null, 2)
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch academic years");
      }
      const academicYears = Array.isArray(
        data.data?.data || data.academic_years?.data
      )
        ? data.data?.data || data.academic_years?.data
        : [];
      set({ academicYears, loading: false });
      if (academicYears.length === 0) {
        console.warn("fetchAcademicYears: No academic years returned");
        toast.error(
          "No academic years available. Please add academic years in the admin panel."
        );
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load academic years";
      console.error(
        "fetchAcademicYears Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      if (
        retries > 0 &&
        (err.response?.status === 500 || err.response?.status === 503)
      ) {
        console.log(`Retrying fetchAcademicYears (${retries} retries left)`);
        setTimeout(() => get().fetchAcademicYears(retries - 1), 1000);
        return;
      }
      set({ error: message, academicYears: [], loading: false });
      toast.error(message);
    }
  },

  fetchYearLevels: async (retries = 2) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/year-level?page=1");
      console.log("fetchYearLevels Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch year levels");
      }
      const yearLevels = Array.isArray(data.yearLevel?.data)
        ? data.yearLevel.data
        : [];
      console.log(
        "fetchYearLevels Extracted:",
        JSON.stringify(yearLevels, null, 2)
      );
      set({ yearLevels, loading: false });
      if (yearLevels.length === 0) {
        console.warn("fetchYearLevels: No year levels returned");
        toast.error(
          "No grade levels available. Please add grade levels in the admin panel."
        );
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load year levels";
      console.error("fetchYearLevels Error Details:", {
        status: err.response?.status,
        data: JSON.stringify(err.response?.data, null, 2),
        message: err.message,
      });
      if (retries > 0 && [500, 503].includes(err.response?.status)) {
        console.log(`Retrying fetchYearLevels (${retries} retries left)`);
        setTimeout(() => get().fetchYearLevels(retries - 1), 1000);
        return;
      }
      set({ error: message, yearLevels: [], loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  fetchSections: async (retries = 2) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/section?page=1");
      console.log("fetchSections Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch sections");
      }
      const sections = Array.isArray(data.sections?.data)
        ? data.sections.data
        : [];
      console.log(
        "fetchSections Extracted:",
        JSON.stringify(sections, null, 2)
      );
      set((state) => {
        console.log(
          "fetchSections Setting State - Previous sections:",
          JSON.stringify(state.sections, null, 2)
        );
        return { sections, loading: false };
      });
      if (sections.length === 0) {
        console.warn("fetchSections: No sections returned");
        toast.error(
          "No sections available. Please add sections in the admin panel."
        );
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Could not load sections";
      console.error(
        "fetchSections Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      if (
        retries > 0 &&
        (err.response?.status === 500 || err.response?.status === 503)
      ) {
        console.log(`Retrying fetchSections (${retries} retries left)`);
        setTimeout(() => get().fetchSections(retries - 1), 1000);
        return;
      }
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
      console.log("createEnrollment Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to create enrollment");
      }
      toast.success("Enrollment created successfully!");
      get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create enrollment";
      console.error(
        "createEnrollment Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
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
      console.log(
        "bulkCreateEnrollments Response:",
        JSON.stringify(data, null, 2)
      );
      if (data.success === false) {
        throw new Error(data.message || "Failed to create bulk enrollments");
      }
      toast.success("Bulk enrollments created successfully!");
      get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create bulk enrollments";
      console.error(
        "bulkCreateEnrollments Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
      throw err;
    }
  },

  fetchEnrollment: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/admin/enrollments/${id}`);
      console.log("fetchEnrollment Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollment");
      }
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load enrollment";
      console.error(
        "fetchEnrollment Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
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
      console.log("updateEnrollment Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to update enrollment");
      }
      toast.success("Enrollment updated successfully!");
      get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update enrollment";
      console.error(
        "updateEnrollment Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
      throw err;
    }
  },

  deleteEnrollment: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/enrollments/${id}`);
      console.log("deleteEnrollment Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to delete enrollment");
      }
      toast.success("Enrollment deleted successfully!");
      get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete enrollment";
      console.error(
        "deleteEnrollment Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
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
      console.log("promoteStudents Response:", JSON.stringify(data, null, 2));
      if (data.success === false) {
        throw new Error(data.message || "Failed to promote students");
      }
      toast.success("Students promoted successfully!");
      get().fetchEnrollments(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to promote students";
      console.error(
        "promoteStudents Error:",
        err.response?.status,
        JSON.stringify(err.response?.data, null, 2)
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
      throw err;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetEnrollmentStore: () => {
    console.log("resetEnrollmentStore called at", new Date().toISOString());
    set({
      enrollments: [],
      pagination: {
        current_page: 1,
        per_page: 25,
        total: 0,
      },
      academicYears: [],
      yearLevels: [],
      sections: [],
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  console.log("Unauthorized event triggered, resetting store");
  useEnrollmentStore.getState().resetEnrollmentStore();
});

export default useEnrollmentStore;
