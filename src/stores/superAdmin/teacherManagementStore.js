import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import toast from "react-hot-toast";

const useTeacherManagementStore = create((set, get) => ({
  teachers: [],
  pagination: {
    current_page: 1,
    per_page: 25,
    total: 0,
  },
  loading: false,
  error: null,

  fetchTeachers: async (page = 1, perPage = 25) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/teacher?page=${page}&per_page=${perPage}`
      );
      console.log("fetchTeachers Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch teachers");
      }
      set({
        teachers: data.data?.data || [],
        pagination: {
          current_page: data.data?.current_page || 1,
          per_page: data.data?.per_page || perPage,
          total: data.data?.total || 0,
        },
        loading: false,
      });
    } catch (err) {
      const message = err?.response?.data?.message || "Could not load teachers";
      console.error(
        "fetchTeachers Error:",
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

  createTeacher: async (teacherData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post("/admin/teacher", teacherData);
      console.log("createTeacher Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to create teacher");
      }
      toast.success("Teacher created successfully!");
      get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create teacher";
      console.error(
        "createTeacher Error:",
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

  updateTeacher: async (id, teacherData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const dataToSubmit = { ...teacherData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.password_confirmation;
      }
      const { data } = await axiosInstance.patch(
        `/admin/teacher/${id}`,
        dataToSubmit
      );
      console.log("updateTeacher Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to update teacher");
      }
      toast.success("Teacher updated successfully!");
      get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update teacher";
      console.error(
        "updateTeacher Error:",
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

  deleteTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(`/admin/teacher/${id}`);
      console.log("deleteTeacher Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to delete teacher");
      }
      toast.success("Teacher deleted successfully!");
      get().fetchTeachers(
        get().pagination.current_page,
        get().pagination.per_page
      );
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete teacher";
      console.error(
        "deleteTeacher Error:",
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

  createTeacherSchedule: async (scheduleData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/teacher/schedule",
        scheduleData
      );
      console.log("createTeacherSchedule Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to create teacher schedule");
      }
      toast.success("Teacher schedule created successfully!");
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create teacher schedule";
      console.error(
        "createTeacherSchedule Error:",
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

  assignAdviser: async (adviserData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/teacher/assign-adviser",
        adviserData
      );
      console.log("assignAdviser Response:", data);
      if (data.success === false) {
        throw new Error(data.message || "Failed to assign adviser");
      }
      toast.success("Teacher assigned as adviser successfully!");
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to assign adviser";
      console.error(
        "assignAdviser Error:",
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

  resetTeacherManagementStore: () => {
    set({
      teachers: [],
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
  useTeacherManagementStore.getState().resetTeacherManagementStore();
});

export default useTeacherManagementStore;
