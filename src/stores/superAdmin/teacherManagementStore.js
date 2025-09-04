import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useTeacherManagementStore = create((set) => ({
  teachers: [],
  schedules: [],
  isLoading: false,
  error: null,

  // Fetch all teachers
  fetchTeachers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/teacher/all");
      console.log("fetchTeachers response:", data); // Debug log
      // Map response to ensure correct structure
      const teachers = Array.isArray(data.data)
        ? data.data.map((teacher) => ({
            id: teacher.id,
            name: teacher.name || teacher.full_name || "Unnamed", // Fallback for name
            email: teacher.email || "-", // Fallback for email
            schedules: Array.isArray(teacher.schedules)
              ? teacher.schedules
              : [], // Ensure schedules is an array
          }))
        : [];
      set({ teachers, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch teachers";
      console.error("fetchTeachers error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Fetch all schedules (new action)
  fetchSchedules: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/schedule/all");
      console.log("fetchSchedules response:", data); // Debug log
      const schedules = Array.isArray(data.data) ? data.data : [];
      set({ schedules, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch schedules";
      console.error("fetchSchedules error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Create a teacher
  createTeacher: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/admin/teacher", formData);
      console.log("createTeacher response:", data); // Debug log
      const newTeacher = {
        id: data.teacher.id,
        name: data.teacher.name || "Unnamed",
        email: data.teacher.email || "-",
        schedules: Array.isArray(data.teacher.schedules)
          ? data.teacher.schedules
          : [],
      };
      set((state) => ({
        teachers: [...state.teachers, newTeacher],
        isLoading: false,
      }));
      toast.success("Teacher created successfully");
      return { success: true, data: newTeacher };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create teacher";
      console.error("createTeacher error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Update a teacher
  updateTeacher: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.put(
        `/admin/teacher/${id}/record`,
        formData
      );
      console.log("updateTeacher response:", data); // Debug log
      const updatedTeacher = {
        id: data.teacher.id,
        name: data.teacher.name || "Unnamed",
        email: data.teacher.email || "-",
        schedules: Array.isArray(data.teacher.schedules)
          ? data.teacher.schedules
          : [],
      };
      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher.id === id ? updatedTeacher : teacher
        ),
        isLoading: false,
      }));
      toast.success("Teacher updated successfully");
      return { success: true, data: updatedTeacher };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update teacher";
      console.error("updateTeacher error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Delete a teacher
  deleteTeacher: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/teacher/${id}`);
      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        isLoading: false,
      }));
      toast.success("Teacher deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete teacher";
      console.error("deleteTeacher error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Create a teacher schedule
  createTeacherSchedule: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/admin/schedule", formData);
      console.log("createTeacherSchedule response:", data); // Debug log
      set((state) => ({
        schedules: [...state.schedules, data.schedule],
        isLoading: false,
      }));
      toast.success("Teacher schedule created successfully");
      return { success: true, data: data.schedule };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create schedule";
      console.error("createTeacherSchedule error:", error); // Debug log
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset store
  resetTeacherManagementStore: () => {
    set({
      teachers: [],
      schedules: [],
      isLoading: false,
      error: null,
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useTeacherManagementStore.getState().resetTeacherManagementStore();
});

export default useTeacherManagementStore;
