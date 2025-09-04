import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useCalendarManagementStore = create((set) => ({
  calendarEvents: [],
  selectedYearEvents: [],
  isLoading: false,
  error: null,

  // Fetch all calendar events
  fetchCalendarEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-calendar");
      set({ calendarEvents: data, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch calendar events";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Fetch events by academic year
  fetchEventsByYear: async (academicYearId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-calendar/year/${academicYearId}`
      );
      set({ selectedYearEvents: data, isLoading: false });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch events for year";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Create a calendar event
  createCalendarEvent: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post(
        "/admin/academic-calendar",
        formData
      );
      set((state) => ({
        calendarEvents: [...state.calendarEvents, data.data],
        isLoading: false,
      }));
      toast.success("Calendar event created successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to create calendar event";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Update a calendar event
  updateCalendarEvent: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.put(
        `/admin/academic-calendar/${id}`,
        formData
      );
      set((state) => ({
        calendarEvents: state.calendarEvents.map((event) =>
          event.id === id ? data.data : event
        ),
        isLoading: false,
      }));
      toast.success("Calendar event updated successfully");
      return { success: true, data: data.data };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update calendar event";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Delete a calendar event
  deleteCalendarEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/academic-calendar/${id}`);
      set((state) => ({
        calendarEvents: state.calendarEvents.filter((event) => event.id !== id),
        isLoading: false,
      }));
      toast.success("Calendar event deleted successfully");
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete calendar event";
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  // Reset store
  resetCalendarStore: () => {
    set({
      calendarEvents: [],
      selectedYearEvents: [],
      isLoading: false,
      error: null,
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useCalendarManagementStore.getState().resetCalendarStore();
});

export default useCalendarManagementStore;
