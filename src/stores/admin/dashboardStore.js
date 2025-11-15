import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    errorMessage =
      err.response.data?.message ||
      err.response.data?.error ||
      `Server Error: ${err.response.status}`;
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(defaultMessage, {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
  }

  set({ loading: false, error: errorMessage });
  toast.error(errorMessage);
  return errorMessage;
};

/** @type {import('zustand').StoreApi<DashboardState & DashboardActions>} */
const useDashboardStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,
  lastUpdated: null,

  fetchDashboardData: async (quarterId = null, attendanceDate = null) => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      const params = {};
      if (quarterId || filters.quarterId) {
        params.quarter_id = quarterId || filters.quarterId;
      }
      if (attendanceDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(attendanceDate)) {
          throw new Error("Invalid attendance date format");
        }
        params.attendance_date = attendanceDate;
      }

      const { data, status } = await axiosInstance.get("/teacher/dashboard", {
        params,
        timeout: 10000,
      });

      if (status !== 200 || !data.success) {
        throw new Error(data.message || "Invalid response from server");
      }

      set({
        dashboardData: data.data || null,
        loading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      handleError(err, "Failed to fetch dashboard data", set);
    }
  },

  resetDashboardStore: () => {
    try {
      set({
        dashboardData: null,
        loading: false,
        error: null,
        lastUpdated: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset dashboard store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset dashboard data");
    }
  },

  clearError: () => {
    try {
      set({ error: null });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to clear error:", { error: error.message });
      }
      toast.error("Failed to clear dashboard error");
    }
  },

  getAttendanceData: () => {
    try {
      const data = get().dashboardData?.today_attendance;
      if (!data) return null;

      return {
        present: {
          count: Number(data.present) || 0,
          percent: Math.round((Number(data.present_percentage) || 0) * 10) / 10,
        },
        absent: {
          count: Number(data.absent) || 0,
          percent: Math.round((Number(data.absent_percentage) || 0) * 10) / 10,
        },
        late: {
          count: Number(data.late) || 0,
          percent: Math.round((Number(data.late_percentage) || 0) * 10) / 10,
        },
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get attendance data:", {
          error: error.message,
        });
      }
      return null;
    }
  },

  getAcademicData: () => {
    try {
      const data = get().dashboardData?.academic_status;
      if (!data) return null;

      return {
        reportsIssued: Number(data.report_cards) || 0,
        honorEligible: Number(data.honors_eligible) || 0,
        // Clamp to 100 to avoid displaying >100%
        gradesSubmitted: Math.min(100, Number(data.grades_submitted_percentage) || 0),
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get academic data:", { error: error.message });
      }
      return null;
    }
  },

  getResourcesData: () => {
    try {
      const data = get().dashboardData?.resources_calendar;
      if (!data) return null;

      return {
        textbookOverdues: Number(data.textbook_overdues) || 0,
        pendingReturns: Number(data.pending_returns) || 0,
        upcomingEvents: Array.isArray(data.upcoming_events)
          ? data.upcoming_events.map((event) => ({
              name: event.title || "Untitled Event",
              date: event.date
                ? new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year:
                      new Date(event.date).getFullYear() !==
                      new Date().getFullYear()
                        ? "numeric"
                        : undefined,
                  })
                : "TBD",
              type: event.type || "event",
            }))
          : [],
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get resources data:", {
          error: error.message,
        });
      }
      return null;
    }
  },

  getWeeklySummary: () => {
    try {
      const data = get().dashboardData?.weekly_summary;
      if (!data) return null;

      return {
        attendanceTrends: {
          averageDaily:
            Math.round(
              (Number(data.attendance_trends?.average_daily) || 0) * 10
            ) / 10,
          bestDay: data.attendance_trends?.best_day || "No data",
          improvement: data.attendance_trends?.improvement || "0%",
        },
        academicUpdates: {
          gradesSubmitted: Number(data.academic_updates?.grades_submitted) || 0,
          reportsGenerated:
            Number(data.academic_updates?.reports_generated) || 0,
          pendingReviews: Number(data.academic_updates?.pending_reviews) || 0,
        },
        systemStatus: {
          serverHealth: data.system_status?.server_health || "Unknown",
          lastBackup: data.system_status?.last_backup || "Unknown",
          activeUsers: Number(data.system_status?.active_users) || 0,
        },
      };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get weekly summary:", {
          error: error.message,
        });
      }
      return null;
    }
  },

  getSectionInfo: () => {
    try {
      return get().dashboardData?.section_info || null;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get section info:", { error: error.message });
      }
      return null;
    }
  },

  isDataStale: (maxAgeMinutes = 5) => {
    try {
      if (!Number.isFinite(maxAgeMinutes) || maxAgeMinutes < 0) {
        throw new Error("Invalid maxAgeMinutes");
      }
      const lastUpdated = get().lastUpdated;
      if (!lastUpdated) return true;
      const diffMinutes = (new Date() - new Date(lastUpdated)) / (1000 * 60);
      return diffMinutes > maxAgeMinutes;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to check data staleness:", {
          error: error.message,
        });
      }
      return true;
    }
  },

  getTotalStudents: () => {
    try {
      return Number(get().getSectionInfo()?.total_students) || 0;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get total students:", {
          error: error.message,
        });
      }
      return 0;
    }
  },

  getAttendanceTotal: () => {
    try {
      const attendance = get().getAttendanceData();
      if (!attendance) return 0;
      return (
        Number(attendance.present.count) +
        Number(attendance.absent.count) +
        Number(attendance.late.count)
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get attendance total:", {
          error: error.message,
        });
      }
      return 0;
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useDashboardStore.getState().resetDashboardStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useDashboardStore;
