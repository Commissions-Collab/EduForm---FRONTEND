import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance } from "../../lib/axios";

const useDashboardStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,
  lastUpdated: null,

  fetchDashboardData: async (quarterId = null, attendanceDate = null) => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    try {
      const params = {};
      if (quarterId || filters.quarterId)
        params.quarter_id = quarterId || filters.quarterId;
      if (attendanceDate) params.attendance_date = attendanceDate;

      const { data } = await axiosInstance.get("/teacher/dashboard", {
        params,
      });

      if (data.success) {
        set({
          dashboardData: data.data,
          loading: false,
          lastUpdated: new Date().toISOString(),
        });
      } else {
        throw new Error(data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      handleError(err, "Failed to fetch dashboard data", set);
    }
  },

  resetDashboardStore: () => {
    set({
      dashboardData: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  },

  clearError: () => set({ error: null }),

  getAttendanceData: () => {
    const data = get().dashboardData?.today_attendance;
    if (!data) return null;
    return {
      present: {
        count: data.present || 0,
        percent: Math.round((data.present_percentage || 0) * 10) / 10,
      },
      absent: {
        count: data.absent || 0,
        percent: Math.round((data.absent_percentage || 0) * 10) / 10,
      },
      late: {
        count: data.late || 0,
        percent: Math.round((data.late_percentage || 0) * 10) / 10,
      },
    };
  },

  getAcademicData: () => {
    const data = get().dashboardData?.academic_status;
    if (!data) return null;
    return {
      reportsIssued: data.report_cards || 0,
      honorEligible: data.honors_eligible || 0,
      gradesSubmitted: data.grades_submitted_percentage || 0,
    };
  },

  getResourcesData: () => {
    const data = get().dashboardData?.resources_calendar;
    if (!data) return null;
    return {
      textbookOverdues: data.textbook_overdues || 0,
      pendingReturns: data.pending_returns || 0,
      upcomingEvents: (data.upcoming_events || []).map((event) => ({
        name: event.title || "Untitled Event",
        date: event.date
          ? new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year:
                new Date(event.date).getFullYear() !== new Date().getFullYear()
                  ? "numeric"
                  : undefined,
            })
          : "TBD",
        type: event.type || "event",
      })),
    };
  },

  getWeeklySummary: () => {
    const data = get().dashboardData?.weekly_summary;
    if (!data) return null;
    return {
      attendanceTrends: {
        averageDaily:
          Math.round((data.attendance_trends?.average_daily || 0) * 10) / 10,
        bestDay: data.attendance_trends?.best_day || "No data",
        improvement: data.attendance_trends?.improvement || "0%",
      },
      academicUpdates: {
        gradesSubmitted: data.academic_updates?.grades_submitted || 0,
        reportsGenerated: data.academic_updates?.reports_generated || 0,
        pendingReviews: data.academic_updates?.pending_reviews || 0,
      },
      systemStatus: {
        serverHealth: data.system_status?.server_health || "Unknown",
        lastBackup: data.system_status?.last_backup || "Unknown",
        activeUsers: data.system_status?.active_users || 0,
      },
    };
  },

  getSectionInfo: () => get().dashboardData?.section_info || null,

  isDataStale: (maxAgeMinutes = 5) => {
    const lastUpdated = get().lastUpdated;
    if (!lastUpdated) return true;
    const diffMinutes = (new Date() - new Date(lastUpdated)) / (1000 * 60);
    return diffMinutes > maxAgeMinutes;
  },

  getTotalStudents: () => get().getSectionInfo()?.total_students || 0,

  getAttendanceTotal: () => {
    const attendance = get().getAttendanceData();
    return attendance
      ? attendance.present.count +
          attendance.absent.count +
          attendance.late.count
      : 0;
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useDashboardStore.getState().resetDashboardStore();
});

export default useDashboardStore;
