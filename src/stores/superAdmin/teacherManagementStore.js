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
  return Array.isArray(data[key]?.data || data[key] || data)
    ? data[key]?.data || data[key] || data
    : [];
};

const useTeacherManagementStore = create((set, get) => ({
  teachers: [],
  pagination: { current_page: 1, per_page: 25, total: 0 },
  loading: false,
  error: null,

  // Filters (from API)
  academicYear: null,
  quarters: [],
  subjects: [],
  sections: [],
  selectedTeacherDetails: null,

  fetchDropdownData: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/teacher/filter-options");
      set({
        academicYear: data.academic_year || null,
        quarters: data.quarters || [],
        sections: data.sections || [],
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to load filter data.");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  // Accessor for filters
  getFilterData: () => {
    const state = get();
    return {
      academicYear: state.academicYear,
      quarters: state.quarters,
      subjects: state.subjects,
      sections: state.sections,
    };
  },

  fetchTeachers: async (page = 1, perPage = 25) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher?page=${page}&per_page=${perPage}`
      );

      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch teachers");
      }

      set({
        teachers: extractData(data, "data"),
        pagination: {
          current_page: data.data?.current_page || 1,
          per_page: data.data?.per_page || perPage,
          total: data.data?.total || 0,
          last_page: data.data?.last_page || 1,
          from: data.data?.from || 0,
          to: data.data?.to || 0,
        },
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to load teachers");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createTeacher: async (teacherData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/teacher", teacherData);

      if (data.success === false) {
        throw new Error(data.message || "Failed to create teacher");
      }

      set({ loading: false });
      toast.success(data.message || "Teacher created successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create teacher");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateTeacher: async (id, teacherData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();

      const dataToSubmit = { ...teacherData };
      if (!dataToSubmit.password || dataToSubmit.password.trim() === "") {
        delete dataToSubmit.password;
        delete dataToSubmit.password_confirmation;
      }

      const { data } = await axiosInstance.put(
        `/admin/teacher/${id}`,
        dataToSubmit
      );

      if (data.success === false) {
        throw new Error(data.message || "Failed to update teacher");
      }

      set({ loading: false });
      toast.success(data.message || "Teacher updated successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update teacher");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/teacher/${id}`);

      if (data.success === false) {
        throw new Error(data.message || "Failed to delete teacher");
      }

      set({ loading: false });
      toast.success(data.message || "Teacher deleted successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete teacher");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  createTeacherSchedule: async (scheduleData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/teacher/schedule",
        scheduleData
      );

      if (data.success === false) {
        throw new Error(data.message || "Failed to create teacher schedule");
      }

      set({ loading: false });
      toast.success(data.message || "Teacher schedule created successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create teacher schedule");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  assignAdviser: async (payload) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        `/admin/teacher/assign-adviser`,
        payload
      );
      toast.success(data.message || "Teacher assigned as adviser successfully");
      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to assign adviser");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchSectionsByYear: async (academicYearId) => {
    if (!academicYearId) return;
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher/available-sections/${academicYearId}`
      );
      set({ sections: data.data || [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to fetch sections");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  assignSubjects: async (assignmentData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/teacher/assign-subjects",
        assignmentData
      );

      if (data.success === false) {
        throw new Error(data.message || "Failed to assign subjects");
      }

      set({ loading: false });
      toast.success(data.message || "Subjects assigned successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      return data;
    } catch (err) {
      const message = handleError(err, "Failed to assign subjects");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchSubjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/teacher/subjects");

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load subjects");
      }

      set({
        subjects: Array.isArray(data.data) ? data.data : [],
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch subjects");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchSectionsByYear: async (academicYearId, teacherId = null) => {
    if (!academicYearId) return;
    set({ loading: true, error: null });
    try {
      const url = teacherId
        ? `/admin/teacher/available-sections/${academicYearId}?teacher_id=${teacherId}`
        : `/admin/teacher/available-sections/${academicYearId}`;
      const { data } = await axiosInstance.get(url);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load sections");
      }

      set({
        sections: Array.isArray(data.data) ? data.data : [],
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch sections");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchTeacherSubjects: async (teacherId, academicYearId) => {
    if (!teacherId || !academicYearId) return;
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher/${teacherId}/subjects/${academicYearId}`
      );

      if (!data?.success)
        throw new Error(data?.message || "Failed to load teacher subjects");

      set({
        subjects: Array.isArray(data.data) ? data.data : [],
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch assigned subjects");
      set({ error: message, loading: false, subjects: [] });
      toast.error(message);
    }
  },

  fetchTeacherDetails: async (teacherId) => {
    if (!teacherId) return;
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(`/admin/${teacherId}/details`);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load teacher details");
      }

      set({
        selectedTeacherDetails: data.data,
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch teacher details");
      set({ error: message, loading: false, selectedTeacherDetails: null });
      toast.error(message);
    }
  },

  removeAdviser: async (teacherId, academicYearId) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(
        `/admin/teacher/${teacherId}/remove-adviser/${academicYearId}`
      );

      if (!data?.success)
        throw new Error(data?.message || "Failed to remove adviser");

      toast.success(data.message || "Teacher adviser removed successfully");

      await get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );

      set({ loading: false });
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to remove adviser");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchAvailableSubjects: async (teacherId, academicYearId) => {
    if (!teacherId || !academicYearId) return;
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher/${teacherId}/subjects/${academicYearId}/available`
      );

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load available subjects");
      }

      const availableSubjects = Array.isArray(data.data)
        ? data.data.filter((s) => s?.id && s?.name)
        : [];

      set({
        subjects: availableSubjects,
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch available subjects");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchAssignedSubjectsOnly: async (teacherId, academicYearId) => {
    if (!teacherId || !academicYearId) return;
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher/${teacherId}/subjects/${academicYearId}/assigned`
      );

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load assigned subjects");
      }

      set({
        subjects: Array.isArray(data.data) ? data.data : [],
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch assigned subjects");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      teachers: [],
      pagination: { current_page: 1, per_page: 25, total: 0 },
      loading: false,
      error: null,
      academicYear: null,
      quarters: [],
      subjects: [],
      sections: [],
    }),
}));

// Centralized unauthorized handler
const handleUnauthorized = () => {
  useTeacherManagementStore.getState().reset();
};

if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", handleUnauthorized);

  window.addEventListener("unload", () => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useTeacherManagementStore;
