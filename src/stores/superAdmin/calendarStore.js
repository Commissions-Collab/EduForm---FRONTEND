import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";

const handleError = (err, defaultMessage) => {
  return err?.response?.data?.message || defaultMessage;
};

const useAcademicCalendarStore = create((set, get) => ({
  calendars: [],
  loading: false,
  error: null,

  fetchCalendars: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/academic-calendar");
      set({ calendars: data.data ?? [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load academic calendars");
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
      set({ loading: false });
      toast.success("Calendar entries created successfully");
      await get().fetchCalendars();
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to create calendar entries");
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
      return data.calendar ?? data;
    } catch (err) {
      const message = handleError(err, "Failed to load calendar entry");
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
      set({ loading: false });
      toast.success("Calendar entry updated successfully");
      await get().fetchCalendars();
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to update calendar entry");
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
      set({ loading: false });
      toast.success("Calendar entry deleted successfully");
      await get().fetchCalendars();
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete calendar entry");
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
      set({ calendars: data.data ?? [], loading: false });
    } catch (err) {
      const message = handleError(err, "Failed to load calendars by year");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  reset: () => set({ calendars: [], loading: false, error: null }),
}));

// Centralized event listener management
const handleUnauthorized = () => {
  useAcademicCalendarStore.getState().reset();
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
window.addEventListener("unload", () => {
  window.removeEventListener("unauthorized", handleUnauthorized);
});

export default useAcademicCalendarStore;
