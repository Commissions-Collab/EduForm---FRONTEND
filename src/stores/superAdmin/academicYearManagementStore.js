import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useAcademicYearManagementStore = create((set) => ({
  academicYears: [],
  currentAcademicYear: null,
  isLoading: false,
  error: null,

  // Fetch all academic years
  fetchAcademicYears: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-years");
      set({ academicYears: data.data, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch academic years";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Fetch current academic year
  fetchCurrentAcademicYear: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-years-current");
      set({ currentAcademicYear: data, isLoading: false });
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message || "No current academic year found";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Create a new academic year
  createAcademicYear: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post(
        "/admin/academic-years",
        formData
      );
      set((state) => ({
        academicYears: [...state.academicYears, data.data],
        isLoading: false,
      }));
      toast.success("Academic year created successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create academic year";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Update an academic year
  updateAcademicYear: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.put(
        `/admin/academic-years/${id}`,
        formData
      );
      set((state) => ({
        academicYears: state.academicYears.map((year) =>
          year.id === id ? data.data : year
        ),
        isLoading: false,
      }));
      toast.success("Academic year updated successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update academic year";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Delete an academic year
  deleteAcademicYear: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/academic-years/${id}`);
      set((state) => ({
        academicYears: state.academicYears.filter((year) => year.id !== id),
        isLoading: false,
      }));
      toast.success("Academic year deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete academic year";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset store
  resetAcademicYearStore: () => {
    set({
      academicYears: [],
      currentAcademicYear: null,
      isLoading: false,
      error: null,
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useAcademicYearManagementStore.getState().resetAcademicYearStore();
});

export default useAcademicYearManagementStore;
