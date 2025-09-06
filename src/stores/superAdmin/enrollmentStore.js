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
  loading: false,
  error: null,

  fetchEnrollments: async (page = 1, perPage = 25) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/enrollments?page=${page}&per_page=${perPage}`
      );
      console.log("fetchEnrollments Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollments");
      }
      set({
        enrollments: data.data?.data || [],
        pagination: {
          current_page: data.data?.current_page || 1,
          per_page: data.data?.per_page || perPage,
          total: data.data?.total || 0,
        },
        loading: false,
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load enrollments";
      console.error(
        "fetchEnrollments Error:",
        err.response?.status,
        err.response?.data
      );
      set({ error: message, loading: false });
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
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
      console.log("createEnrollment Response:", data);
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
        err.response?.data
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
        "/admin/enrollments/bulk",
        bulkData
      );
      console.log("bulkCreateEnrollments Response:", data);
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
        err.response?.data
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
      console.log("fetchEnrollment Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch enrollment");
      }
      set({ loading: false });
      return data.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load enrollment";
      console.error(
        "fetchEnrollment Error:",
        err.response?.status,
        err.response?.data
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
      const { data } = await axiosInstance.patch(
        `/admin/enrollments/${id}`,
        enrollmentData
      );
      console.log("updateEnrollment Response:", data);
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
        err.response?.data
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
      console.log("deleteEnrollment Response:", data);
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
        err.response?.data
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
      console.log("promoteStudents Response:", data);
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
        err.response?.data
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
    set({
      enrollments: [],
      pagination: {
        current_page: 1,
        per_page: 25,
        total: 0,
      },
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useEnrollmentStore.getState().resetEnrollmentStore();
});

export default useEnrollmentStore;
