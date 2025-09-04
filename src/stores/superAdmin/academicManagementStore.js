import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useAcademicManagementStore = create((set) => ({
  students: {
    data: [],
    isLoading: false,
    error: null,
  },
  enrollments: {
    data: [],
    isLoading: false,
    error: null,
  },
  yearLevels: {
    data: [],
    isLoading: false,
    error: null,
  },
  sections: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Student Management
  fetchStudents: async () => {
    set((state) => ({
      students: { ...state.students, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/admin/records");
      set((state) => ({
        students: { ...state.students, data: data.students, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch students";
      set((state) => ({
        students: { ...state.students, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },

  updateStudent: async (id, formData) => {
    set((state) => ({
      students: { ...state.students, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.put(
        `/admin/student/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      set((state) => ({
        students: {
          ...state.students,
          data: state.students.data.map((student) =>
            student.id === id ? data.student : student
          ),
          isLoading: false,
        },
      }));
      toast.success("Student updated successfully");
      return { success: true, data: data.student };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update student";
      set((state) => ({
        students: { ...state.students, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteStudent: async (id) => {
    set((state) => ({
      students: { ...state.students, isLoading: true, error: null },
    }));
    try {
      await axiosInstance.delete(`/admin/student/${id}`);
      set((state) => ({
        students: {
          ...state.students,
          data: state.students.data.filter((student) => student.id !== id),
          isLoading: false,
        },
      }));
      toast.success("Student deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete student";
      set((state) => ({
        students: { ...state.students, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  // Enrollment Management
  fetchEnrollments: async () => {
    set((state) => ({
      enrollments: { ...state.enrollments, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/admin/enrollments");
      set((state) => ({
        enrollments: {
          ...state.enrollments,
          data: data.data,
          isLoading: false,
        },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch enrollments";
      set((state) => ({
        enrollments: { ...state.enrollments, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },

  createEnrollment: async (formData) => {
    set((state) => ({
      enrollments: { ...state.enrollments, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.post("/admin/enrollments", formData);
      set((state) => ({
        enrollments: {
          ...state.enrollments,
          data: [...state.enrollments.data, data.data],
          isLoading: false,
        },
      }));
      toast.success("Enrollment created successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create enrollment";
      set((state) => ({
        enrollments: { ...state.enrollments, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  updateEnrollment: async (id, formData) => {
    set((state) => ({
      enrollments: { ...state.enrollments, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.put(
        `/admin/enrollments/${id}`,
        formData
      );
      set((state) => ({
        enrollments: {
          ...state.enrollments,
          data: state.enrollments.data.map((enrollment) =>
            enrollment.id === id ? data.data : enrollment
          ),
          isLoading: false,
        },
      }));
      toast.success("Enrollment updated successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update enrollment";
      set((state) => ({
        enrollments: { ...state.enrollments, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteEnrollment: async (id) => {
    set((state) => ({
      enrollments: { ...state.enrollments, isLoading: true, error: null },
    }));
    try {
      await axiosInstance.delete(`/admin/enrollments/${id}`);
      set((state) => ({
        enrollments: {
          ...state.enrollments,
          data: state.enrollments.data.filter(
            (enrollment) => enrollment.id !== id
          ),
          isLoading: false,
        },
      }));
      toast.success("Enrollment deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete enrollment";
      set((state) => ({
        enrollments: { ...state.enrollments, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  // Year Level Management
  createYearLevel: async (formData) => {
    set((state) => ({
      yearLevels: { ...state.yearLevels, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.post("/admin/year_level", formData);
      set((state) => ({
        yearLevels: {
          ...state.yearLevels,
          data: [...state.yearLevels.data, data.year_level],
          isLoading: false,
        },
      }));
      toast.success("Year level created successfully");
      return { success: true, data: data.year_level };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create year level";
      set((state) => ({
        yearLevels: { ...state.yearLevels, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteYearLevel: async (id) => {
    set((state) => ({
      yearLevels: { ...state.yearLevels, isLoading: true, error: null },
    }));
    try {
      await axiosInstance.delete(`/admin/year_level/${id}`);
      set((state) => ({
        yearLevels: {
          ...state.yearLevels,
          data: state.yearLevels.data.filter((level) => level.id !== id),
          isLoading: false,
        },
      }));
      toast.success("Year level deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete year level";
      set((state) => ({
        yearLevels: { ...state.yearLevels, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  // Section Management
  createSection: async (formData) => {
    set((state) => ({
      sections: { ...state.sections, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.post("/admin/section", formData);
      set((state) => ({
        sections: {
          ...state.sections,
          data: [...state.sections.data, data.section],
          isLoading: false,
        },
      }));
      toast.success("Section created successfully");
      return { success: true, data: data.section };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create section";
      set((state) => ({
        sections: { ...state.sections, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  updateSection: async (id, formData) => {
    set((state) => ({
      sections: { ...state.sections, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.put(
        `/admin/section/${id}`,
        formData
      );
      set((state) => ({
        sections: {
          ...state.sections,
          data: state.sections.data.map((section) =>
            section.id === id ? data.section : section
          ),
          isLoading: false,
        },
      }));
      toast.success("Section updated successfully");
      return { success: true, data: data.section };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update section";
      set((state) => ({
        sections: { ...state.sections, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteSection: async (id) => {
    set((state) => ({
      sections: { ...state.sections, isLoading: true, error: null },
    }));
    try {
      await axiosInstance.delete(`/admin/section/${id}`);
      set((state) => ({
        sections: {
          ...state.sections,
          data: state.sections.data.filter((section) => section.id !== id),
          isLoading: false,
        },
      }));
      toast.success("Section deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete section";
      set((state) => ({
        sections: { ...state.sections, error: message, isLoading: false },
      }));
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset store
  resetAcademicManagementStore: () => {
    set({
      students: { data: [], isLoading: false, error: null },
      enrollments: { data: [], isLoading: false, error: null },
      yearLevels: { data: [], isLoading: false, error: null },
      sections: { data: [], isLoading: false, error: null },
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useAcademicManagementStore.getState().resetAcademicManagementStore();
});

export default useAcademicManagementStore;
