import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useSuperAdminDashboardStore = create((set) => ({
  currentAcademicYear: null,
  upcomingEvents: [],
  enrollmentStats: { total: 0, byYearLevel: [] },
  studentCount: 0,
  teacherCount: 0,
  isLoading: false,
  error: null,

  // Fetch dashboard data
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch current academic year
      const yearResponse = await axiosInstance.get(
        "/admin/academic-years-current"
      );
      const eventsResponse = await axiosInstance.get(
        "/admin/academic-calendar"
      );
      const enrollmentsResponse = await axiosInstance.get("/admin/enrollments");
      const studentsResponse = await axiosInstance.get("/admin/records");
      const teachersResponse = await axiosInstance.get("/admin/teacher/all");

      set({
        currentAcademicYear: yearResponse.data,
        upcomingEvents: eventsResponse.data.filter(
          (event) => new Date(event.date) >= new Date()
        ),
        enrollmentStats: {
          total: enrollmentsResponse.data.data.length,
          byYearLevel: enrollmentsResponse.data.data.reduce(
            (acc, enrollment) => {
              const level = enrollment.yearLevel?.name || "Unknown";
              acc[level] = (acc[level] || 0) + 1;
              return acc;
            },
            {}
          ),
        },
        studentCount: studentsResponse.data.students.length,
        teacherCount: teachersResponse.data.data.length,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch dashboard data";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  // Reset store
  resetDashboardStore: () => {
    set({
      currentAcademicYear: null,
      upcomingEvents: [],
      enrollmentStats: { total: 0, byYearLevel: [] },
      studentCount: 0,
      teacherCount: 0,
      isLoading: false,
      error: null,
    });
  },
}));

// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useDashboardStore.getState().resetDashboardStore();
});

export default useSuperAdminDashboardStore;
