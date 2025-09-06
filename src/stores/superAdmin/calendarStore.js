import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";

const useAcademicCalendarStore = create((set, get) => ({
  calendars: [],
  loading: false,
  error: null,

  fetchCalendars: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-calendar");
      set({ calendars: data.data || [], loading: false });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load academic calendars";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  bulkCreateCalendars: async (calendarData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        "/admin/academic-calendar",
        calendarData
      );
      toast.success("Calendar entries created successfully!");
      get().fetchCalendars(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to create calendar entries";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchCalendar: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-calendar/${id}`
      );
      set({ loading: false });
      return data.calendar || data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load calendar entry";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  updateCalendar: async (id, calendarData) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        `/admin/academic-calendar/${id}`,
        calendarData
      );
      toast.success("Calendar entry updated successfully!");
      get().fetchCalendars(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update calendar entry";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  deleteCalendar: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      const { data } = await axiosInstance.delete(
        `/admin/academic-calendar/${id}`
      );
      toast.success("Calendar entry deleted successfully!");
      get().fetchCalendars(); // Refresh list
      set({ loading: false });
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to delete calendar entry";
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchByYear: async (academicYearId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-calendar/year/${academicYearId}`
      );
      set({ calendars: data.data || [], loading: false });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not load calendars by year";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  resetAcademicCalendarStore: () => {
    set({
      calendars: [],
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useAcademicCalendarStore.getState().resetAcademicCalendarStore();
});

export default useAcademicCalendarStore;
