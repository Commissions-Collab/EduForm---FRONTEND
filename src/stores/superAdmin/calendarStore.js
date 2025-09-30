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
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 10,

  setPage: (page) => {
    set({ currentPage: page });
    const { fetchCalendars, fetchByYear, selectedYearId } = get();
    if (selectedYearId) {
      fetchByYear(selectedYearId, page);
    } else {
      fetchCalendars(page);
    }
  },

  selectedYearId: null,
  setSelectedYearId: (yearId) =>
    set({ selectedYearId: yearId, currentPage: 1 }),

  fetchCalendars: async (page = 1, perPage = 10) => {
    set({ loading: true, error: null, currentPage: page });
    try {
      const { data } = await axiosInstance.get("/admin/academic-calendar", {
        params: { page, per_page: perPage },
      });
      set({
        calendars: data.data ?? [],
        loading: false,
        currentPage: data.current_page ?? 1,
        totalPages: data.total_pages ?? 1,
        total: data.total ?? 0,
        perPage: data.per_page ?? perPage,
      });
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

      // Refresh current view
      const { currentPage, selectedYearId, fetchCalendars, fetchByYear } =
        get();
      if (selectedYearId) {
        await fetchByYear(selectedYearId, currentPage);
      } else {
        await fetchCalendars(currentPage);
      }
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

      // Refresh current view
      const { currentPage, selectedYearId, fetchCalendars, fetchByYear } =
        get();
      if (selectedYearId) {
        await fetchByYear(selectedYearId, currentPage);
      } else {
        await fetchCalendars(currentPage);
      }
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

      // Refresh current view
      const { currentPage, selectedYearId, fetchCalendars, fetchByYear } =
        get();
      if (selectedYearId) {
        await fetchByYear(selectedYearId, currentPage);
      } else {
        await fetchCalendars(currentPage);
      }
      return data;
    } catch (err) {
      const message = handleError(err, "Failed to delete calendar entry");
      set({ error: message, loading: false });
      toast.error(message);
      throw err;
    }
  },

  fetchByYear: async (academicYearId, page = 1, perPage = 10) => {
    set({ loading: true, error: null, currentPage: page });
    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-calendar/year/${academicYearId}`,
        { params: { page, per_page: perPage } }
      );
      set({
        calendars: data.data ?? [],
        loading: false,
        currentPage: data.current_page ?? 1,
        totalPages: data.total_pages ?? 1,
        total: data.total ?? 0,
        perPage: data.per_page ?? perPage,
        selectedYearId: academicYearId,
      });
    } catch (err) {
      const message = handleError(err, "Failed to load calendars by year");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  resetAcademicCalendarStore: () =>
    set({
      calendars: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 10,
      selectedYearId: null,
    }),
}));

// Centralized event listener management
const handleUnauthorized = () => {
  useAcademicCalendarStore.getState().resetAcademicCalendarStore();
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
window.addEventListener("unload", () => {
  window.removeEventListener("unauthorized", handleUnauthorized);
});

export default useAcademicCalendarStore;
