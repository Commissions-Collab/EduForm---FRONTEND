import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getItem, setItem, paginate } from "../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

// Helper function to handle errors consistently
const handleError = (err, defaultMessage, set) => {
  console.error(defaultMessage, err);
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  return message;
};

// Helper function for PDF downloads
const downloadPDF = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const useAdminStore = create((set, get) => ({
  loading: false,
  error: null,

  // === GLOBAL FILTERS ===
  globalFilters: {
    academicYearId: null,
    quarterId: null,
    sectionId: null,
  },

  filterOptions: {
    academicYears: [],
    quarters: [
      { id: 1, name: "1st Quarter" },
      { id: 2, name: "2nd Quarter" },
      { id: 3, name: "3rd Quarter" },
      { id: 4, name: "4th Quarter" },
    ],
    sections: [],
  },

  // Initialize global filters from localStorage
  initializeGlobalFilters: () => {
    const academicYearId = getItem("academicYearId", false);
    const quarterId = getItem("quarterId", false);
    const sectionId = getItem("sectionId", false);

    set({
      globalFilters: {
        academicYearId: academicYearId ? parseInt(academicYearId, 10) : null,
        quarterId: quarterId ? parseInt(quarterId, 10) : null,
        sectionId: sectionId ? parseInt(sectionId, 10) : null,
      },
    });
  },

  // Set global filters and save to localStorage
  setGlobalFilters: (filters) => {
    const prev = get().globalFilters;
    const next = {
      ...prev,
      ...filters,
    };

    // Save to localStorage (handle null values properly)
    if (next.academicYearId !== null) {
      setItem("academicYearId", String(next.academicYearId));
    } else {
      setItem("academicYearId", "");
    }

    if (next.quarterId !== null) {
      setItem("quarterId", String(next.quarterId));
    } else {
      setItem("quarterId", "");
    }

    if (next.sectionId !== null) {
      setItem("sectionId", String(next.sectionId));
    } else {
      setItem("sectionId", "");
    }

    set({ globalFilters: next });

    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", { detail: next })
    );
  },

  // Clear all global filters
  clearGlobalFilters: () => {
    setItem("academicYearId", "");
    setItem("quarterId", "");
    setItem("sectionId", "");

    set({
      globalFilters: {
        academicYearId: null,
        quarterId: null,
        sectionId: null,
      },
    });

    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: {
          academicYearId: null,
          quarterId: null,
          sectionId: null,
        },
      })
    );
  },

  // Fetch filter options and set defaults
  fetchGlobalFilterOptions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(
        "/teacher/academic-records/filter-options"
      );

      const rawYears = res.data?.academic_years || [];
      const sections = res.data?.sections || [];

      // Format academic years for dropdown
      const academicYears = rawYears.map((y) => ({
        id: y.id,
        name: y.name,
        is_current: !!y.is_current,
        quarters: Array.isArray(y.quarters) ? y.quarters : [],
      }));

      // Find current academic year or first available
      const currentYear =
        academicYears.find((y) => y.is_current) || academicYears[0] || null;

      // Get quarters for the current/selected academic year
      const availableQuarters = currentYear?.quarters?.length
        ? currentYear.quarters
        : get().filterOptions.quarters;

      // Set filter options
      set({
        filterOptions: {
          academicYears: academicYears.map(({ id, name, is_current }) => ({
            id,
            name,
            is_current,
          })),
          quarters: availableQuarters,
          sections,
        },
        loading: false,
      });

      // Set defaults if no filters are currently set
      const { globalFilters } = get();
      const shouldSetDefaults =
        !globalFilters.academicYearId ||
        !globalFilters.quarterId ||
        !globalFilters.sectionId;

      if (shouldSetDefaults && currentYear) {
        const defaultQuarterId = availableQuarters[0]?.id || null;
        const defaultSectionId = sections[0]?.id || null;

        get().setGlobalFilters({
          academicYearId: currentYear.id,
          quarterId: defaultQuarterId,
          sectionId: defaultSectionId,
        });
      }
    } catch (err) {
      console.error("Filter fetch error:", err);
      handleError(err, "Unable to load filter options", set);
    }
  },

  // Update quarters when academic year changes
  updateQuartersForAcademicYear: async (academicYearId) => {
    if (!academicYearId) return;

    try {
      // Find the selected academic year from our stored data
      const { filterOptions } = get();
      const selectedYear = filterOptions.academicYears.find(
        (y) => y.id === academicYearId
      );

      if (selectedYear) {
        // If we have quarters data, use it
        const quarters = selectedYear.quarters?.length
          ? selectedYear.quarters
          : filterOptions.quarters;

        set({
          filterOptions: {
            ...filterOptions,
            quarters,
          },
        });

        // Update section list for this academic year
        await get().updateSectionsForAcademicYear(academicYearId);
      }
    } catch (err) {
      console.error("Error updating quarters:", err);
    }
  },

  // Update sections when academic year changes
  updateSectionsForAcademicYear: async (academicYearId) => {
    if (!academicYearId) return;

    try {
      const res = await axiosInstance.get(
        `/teacher/academic-records/filter-options?academic_year_id=${academicYearId}`
      );
      const sections = res.data?.sections || [];

      const { filterOptions } = get();
      set({
        filterOptions: {
          ...filterOptions,
          sections,
        },
      });
    } catch (err) {
      console.error("Error updating sections:", err);
    }
  },

  // Get current filter values (with fallback to localStorage)
  getCurrentFilters: () => {
    const { globalFilters } = get();
    const lsYear = getItem("academicYearId", false);
    const lsQuarter = getItem("quarterId", false);
    const lsSection = getItem("sectionId", false);

    return {
      academicYearId:
        globalFilters.academicYearId ?? (lsYear ? parseInt(lsYear, 10) : null),
      quarterId:
        globalFilters.quarterId ?? (lsQuarter ? parseInt(lsQuarter, 10) : null),
      sectionId:
        globalFilters.sectionId ?? (lsSection ? parseInt(lsSection, 10) : null),
    };
  },

  // State
  dashboardData: null,
  loading: false,
  error: null,
  lastUpdated: null,

  // Actions
  fetchDashboardData: async (quarterId = null, attendanceDate = null) => {
    set({ loading: true, error: null });

    try {
      const params = {};
      if (quarterId) params.quarter_id = quarterId;
      if (attendanceDate) params.attendance_date = attendanceDate;

      const response = await axiosInstance.get("/teacher/dashboard", {
        params,
      });

      if (response.data.success) {
        set({
          dashboardData: response.data.data,
          loading: false,
          lastUpdated: new Date().toISOString(),
          error: null,
        });
      } else {
        set({
          error: response.data.message || "Failed to fetch dashboard data",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);

      let errorMessage = "Network error";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  // Update attendance data specifically
  updateAttendanceData: async (attendanceData) => {
    set({ loading: true, error: null });

    try {
      const response = await dashboardAPI.updateAttendance(attendanceData);

      if (response.data.success) {
        // Refresh dashboard data after successful attendance update
        await get().fetchDashboardData();
        return { success: true };
      } else {
        set({
          error: response.data.message || "Failed to update attendance",
          loading: false,
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update attendance";
      set({
        error: errorMessage,
        loading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  // Reset store
  resetDashboard: () => {
    set({
      dashboardData: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Getters (computed values)
  getAttendanceData: () => {
    const data = get().dashboardData;
    if (!data?.today_attendance) return null;

    return {
      present: {
        count: data.today_attendance.present || 0,
        percent:
          Math.round((data.today_attendance.present_percentage || 0) * 10) / 10,
      },
      absent: {
        count: data.today_attendance.absent || 0,
        percent:
          Math.round((data.today_attendance.absent_percentage || 0) * 10) / 10,
      },
      late: {
        count: data.today_attendance.late || 0,
        percent:
          Math.round((data.today_attendance.late_percentage || 0) * 10) / 10,
      },
    };
  },

  getAcademicData: () => {
    const data = get().dashboardData;
    if (!data?.academic_status) return null;

    return {
      reportsIssued: data.academic_status.report_cards || 0,
      honorEligible: data.academic_status.honors_eligible || 0,
      gradesSubmitted: data.academic_status.grades_submitted_percentage || 0,
    };
  },

  getResourcesData: () => {
    const data = get().dashboardData;
    if (!data?.resources_calendar) return null;

    return {
      textbookOverdues: data.resources_calendar.textbook_overdues || 0,
      pendingReturns: data.resources_calendar.pending_returns || 0,
      upcomingEvents: (data.resources_calendar.upcoming_events || []).map(
        (event) => ({
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
        })
      ),
    };
  },

  getWeeklySummary: () => {
    const data = get().dashboardData;
    if (!data?.weekly_summary) return null;

    return {
      attendanceTrends: {
        averageDaily:
          Math.round(
            (data.weekly_summary.attendance_trends?.average_daily || 0) * 10
          ) / 10,
        bestDay: data.weekly_summary.attendance_trends?.best_day || "No data",
        improvement: data.weekly_summary.attendance_trends?.improvement || "0%",
      },
      academicUpdates: {
        gradesSubmitted:
          data.weekly_summary.academic_updates?.grades_submitted || 0,
        reportsGenerated:
          data.weekly_summary.academic_updates?.reports_generated || 0,
        pendingReviews:
          data.weekly_summary.academic_updates?.pending_reviews || 0,
      },
      systemStatus: {
        serverHealth:
          data.weekly_summary.system_status?.server_health || "Unknown",
        lastBackup: data.weekly_summary.system_status?.last_backup || "Unknown",
        activeUsers: data.weekly_summary.system_status?.active_users || 0,
      },
    };
  },

  getSectionInfo: () => {
    const data = get().dashboardData;
    return data?.section_info || null;
  },

  // Additional utility methods
  isDataStale: (maxAgeMinutes = 5) => {
    const lastUpdated = get().lastUpdated;
    if (!lastUpdated) return true;

    const now = new Date();
    const lastUpdateTime = new Date(lastUpdated);
    const diffMinutes = (now - lastUpdateTime) / (1000 * 60);

    return diffMinutes > maxAgeMinutes;
  },

  getTotalStudents: () => {
    const sectionInfo = get().getSectionInfo();
    return sectionInfo?.total_students || 0;
  },

  getAttendanceTotal: () => {
    const attendanceData = get().getAttendanceData();
    if (!attendanceData) return 0;

    return (
      attendanceData.present.count +
      attendanceData.absent.count +
      attendanceData.late.count
    );
  },

  // *Attendance
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  weeklySchedule: null,
  fetchWeeklySchedule: async (
    sectionId,
    academicYearId,
    quarterId,
    weekStart
  ) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (sectionId) params.append("section_id", sectionId);
      if (academicYearId) params.append("academic_year_id", academicYearId);
      if (quarterId) params.append("quarter_id", quarterId);
      if (weekStart) params.append("week_start", weekStart);

      const res = await axiosInstance.get(
        `/teacher/schedule/weekly?${params.toString()}`
      );

      if (res.data?.success) {
        set({
          weeklySchedule: res.data.data,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(res.data?.message || "Failed to fetch weekly schedule");
      }
    } catch (err) {
      console.error("Weekly schedule fetch error:", err);
      set({
        weeklySchedule: null,
        loading: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch weekly schedule",
      });
    }
  },

  // New function to fetch schedule attendance data
  fetchScheduleAttendance: async ({
    scheduleId,
    sectionId,
    academicYearId,
    quarterId,
    date,
  }) => {
    set({ loading: true, error: null });

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(`/teacher/schedule/attendance`, {
        params: {
          schedule_id: scheduleId,
          section_id: sectionId,
          academic_year_id: academicYearId,
          quarter_id: quarterId,
          date: date,
        },
      });

      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch schedule attendance", set);
    }
  },

  // Updated to match backend parameter names
  fetchScheduleStudents: async (scheduleId, date) => {
    set({ loading: true, error: null });

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/students`,
        {
          params: { date: date },
        }
      );
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch students for schedule", set);
    }
  },

  // Updated to handle both 'date' and 'attendance_date' parameters
  updateIndividualAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      // Ensure proper parameter names for backend
      const backendPayload = {
        student_id: payload.student_id,
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status.toLowerCase(), // Backend expects lowercase
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-individual`,
        backendPayload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Update failed", set);
    }
  },

  // Updated bulk attendance function
  updateBulkAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      // Format payload for backend
      const backendPayload = {
        schedule_id: payload.schedule_id,
        attendance_date: payload.attendance_date,
        attendances: payload.attendances.map((att) => ({
          student_id: att.student_id,
          status: att.status.toLowerCase(),
          time_in: att.time_in,
          time_out: att.time_out,
          remarks: att.remarks || att.reason,
        })),
      };

      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-bulk`,
        backendPayload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Bulk update failed", set);
    }
  },

  // Updated to handle flexible date parameters
  updateAllStudentsAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      // Backend accepts both 'date' and 'attendance_date'
      const backendPayload = {
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status.toLowerCase(), // Backend expects lowercase
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-all`,
        backendPayload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Update for all students failed", set);
    }
  },

  // Keep existing attendance history functions
  fetchScheduleAttendanceHistory: async (scheduleId, startDate, endDate) => {
    set({ loading: true, error: null });

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/attendance-history`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch attendance history", set);
    }
  },

  fetchStudentAttendanceHistory: async (
    studentId,
    scheduleId,
    academicYearId,
    startDate,
    endDate
  ) => {
    set({ loading: true, error: null });

    if (!studentId || !scheduleId) {
      set({ error: "Student or schedule not selected", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/student/${studentId}/schedule/${scheduleId}/attendance-history`,
        {
          params: {
            academic_year_id: academicYearId,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      set({ studentAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch student attendance history", set);
    }
  },

  monthlyAttendanceData: null,
  fetchMonthlyAttendance: async (params) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const advisorySectionId = get().teacherProfile?.advisory_section_id;

    if (!filters.sectionId) {
      set({ error: "Missing section ID", loading: false });
      return;
    }

    if (advisorySectionId && filters.sectionId !== advisorySectionId) {
      set({
        error:
          "This section is not your advisory class. You cannot access its attendance.",
        loading: false,
        monthlyAttendanceData: null,
      });
      return;
    }

    const now = new Date();
    const filterParams = {
      month: params?.month || now.getMonth() + 1,
      year: params?.year || now.getFullYear(),
    };

    try {
      const { data } = await axiosInstance.get(
        `/teacher/sections/${filters.sectionId}/monthly-attendance`,
        { params: filterParams }
      );

      set({
        monthlyAttendanceData: data?.data || null,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Unable to fetch monthly attendance", set);
    }
  },
  downloadQuarterlyAttendancePDF: async () => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();

    if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
      set({
        error: "Section, Academic Year, or Quarter is not selected",
        loading: false,
      });
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/teacher/sections/${filters.sectionId}/attendance/quarterly/pdf`,
        {
          responseType: "blob",
          params: {
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
          },
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Quarterly_Attendance_Summary_${filters.sectionId}_${filters.quarterId}.pdf`;
      downloadPDF(blob, fileName);

      set({ attendancePDFBlob: blob, loading: false });
    } catch (err) {
      console.error("Failed to download attendance PDF:", err);
      handleError(err, "PDF download failed", set);
    }
  },

  resetAttendanceStore: () => {
    set({
      loading: false,
      error: null,
      scheduleAttendance: {},
      studentAttendance: {},
      attendancePDFBlob: null,
      weeklySchedule: [],
    });
  },

  // === Grades ===
  students: [],
  subjects: [],
  currentPage: 1,

  fetchGrades: async (academicYearId, quarterId, sectionId) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const params = {
      academic_year_id: academicYearId || filters.academicYearId,
      quarter_id: quarterId || filters.quarterId,
      section_id: sectionId || filters.sectionId,
    };

    if (!params.academic_year_id || !params.quarter_id || !params.section_id) {
      set({ error: "Missing required filter data", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/students-grade",
        { params }
      );
      set({
        students: Array.isArray(data.students) ? data.students : [],
        subjects: Array.isArray(data.subjects) ? data.subjects : [],
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch grades", set);
    }
  },

  updateGrade: async ({ student_id, subject_id, quarter_id, grade }) => {
    try {
      const payload = { student_id, subject_id, quarter_id, grade };
      const { data } = await axiosInstance.put(
        "/teacher/academic-records/update-grade",
        payload
      );

      const updatedStudents = get().students.map((student) => {
        if (student.id !== student_id) return student;

        const updatedGrades = student.grades.map((g) =>
          g.subject_id === subject_id
            ? { ...g, grade, grade_id: data.grade.id }
            : g
        );

        return { ...student, grades: updatedGrades };
      });

      set({ students: updatedStudents });
      return data;
    } catch (err) {
      handleError(err, "Grade update failed", set);
      throw err;
    }
  },

  fetchStatistics: async (academicYearId, quarterId, sectionId) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const params = {
      academic_year_id: academicYearId || filters.academicYearId,
      quarter_id: quarterId || filters.quarterId,
      section_id: sectionId || filters.sectionId,
    };

    if (!params.academic_year_id || !params.quarter_id || !params.section_id) {
      set({ error: "Missing required filter data", loading: false });
      return null;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/statistics",
        { params }
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Unable to fetch grade statistics", set);
      return null;
    }
  },

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedGradeRecords: () => {
    const { currentPage, students } = get();
    return paginate(students, currentPage, RECORDS_PER_PAGE);
  },

  setPage: (page) => set({ currentPage: page }),

  // === Promotion ===
  promotionStudents: [],
  promotionCurrentPage: 1,
  overallPromotionStats: null,
  isPromotionAccessible: false,
  promotionMessage: null,

  fetchPromotionData: async (academicYearId, sectionId) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const params = {
      academic_year_id: academicYearId || filters.academicYearId,
      section_id: sectionId || filters.sectionId,
    };

    if (!params.academic_year_id || !params.section_id) {
      set({ error: "Missing required filters", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/promotion-reports/statistics",
        { params }
      );

      set({
        promotionStudents: Array.isArray(data?.students) ? data.students : [],
        overallPromotionStats: data.overall_statistics || null,
        isPromotionAccessible: data.accessible ?? false,
        promotionMessage: null,
        loading: false,
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch promotion data";
      set({
        error: message,
        promotionMessage: {
          title: "Promotion Report Unavailable",
          content: message,
        },
        isPromotionAccessible: false,
        loading: false,
      });
    }
  },

  setPromotionCurrentPage: (page) => set({ promotionCurrentPage: page }),

  totalPromotionPages: () =>
    Math.ceil(get().promotionStudents.length / RECORDS_PER_PAGE),

  paginatedPromotionRecords: () => {
    const { promotionStudents, promotionCurrentPage } = get();
    return paginate(promotionStudents, promotionCurrentPage, RECORDS_PER_PAGE);
  },

  // === Certificates ===
  attendanceCertificates: [],
  honorCertificates: [],
  certificateCurrentPage: 1,

  fetchAdminCertificateData: async (academicYearId, sectionId, quarterId) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const params = {
      academic_year_id: academicYearId || filters.academicYearId,
      section_id: sectionId || filters.sectionId,
      quarter_id: quarterId || filters.quarterId,
    };

    if (!params.academic_year_id || !params.section_id || !params.quarter_id) {
      set({ error: "Missing certificate filter data", loading: false });
      return;
    }

    try {
      const response = await axiosInstance.get("/teacher/certificate", {
        params,
      });

      set({
        attendanceCertificates: response.data.perfect_attendance || [],
        honorCertificates: response.data.honor_roll || [],
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch certificates", set);
    }
  },

  setCertificateCurrentPage: (page) => set({ certificateCurrentPage: page }),

  totalCertificatePages: (type) => {
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return Math.ceil(certificates.length / RECORDS_PER_PAGE);
  },

  paginatedCertificateRecords: (type) => {
    const { certificateCurrentPage } = get();
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return paginate(certificates, certificateCurrentPage, RECORDS_PER_PAGE);
  },

  // === Textbooks === CORRECTED ENDPOINTS
  textbooks: [],
  textbookCurrentPage: 1,
  bookFilters: {
    sections: [],
    students: [],
    books: [],
  },

  fetchTextbooks: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get("/teacher/book-management");
      const textbooks =
        response.data?.books?.data ||
        response.data?.data ||
        response.data ||
        [];
      set({ textbooks, loading: false });
    } catch (err) {
      handleError(err, "Failed to fetch textbooks", set);
    }
  },

  fetchBookFilters: async (sectionId) => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const targetSectionId = sectionId || filters.sectionId;

    try {
      const params = targetSectionId ? { section_id: targetSectionId } : {};
      const response = await axiosInstance.get(
        "/teacher/book-management/filter-options",
        { params }
      );

      set({
        bookFilters: {
          sections: response.data.sections || [],
          students: response.data.students || [],
          books: response.data.books || [],
        },
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch book filters", set);
    }
  },

  // CORRECTED: Fixed endpoint names based on routes
  distributeBook: async (bookData) => {
    set({ loading: true, error: null });

    try {
      await axiosInstance.post(
        "/teacher/book-management/distribute-books",
        bookData
      );
      set({ loading: false });
      toast.success("Book distributed successfully!");
      await get().fetchTextbooks();
    } catch (err) {
      handleError(err, "Failed to distribute book", set);
      toast.error("Failed to distribute book");
    }
  },

  // CORRECTED: Fixed endpoint name based on routes
  returnBook: async (borrowId) => {
    set({ loading: true, error: null });

    try {
      await axiosInstance.put(
        `/teacher/book-management/return-book/${borrowId}`
      );
      set({ loading: false });
      toast.success("Book returned successfully!");
      await get().fetchTextbooks();
    } catch (err) {
      handleError(err, "Failed to return book", set);
      toast.error("Failed to return book");
    }
  },

  setTextbookCurrentPage: (page) => set({ textbookCurrentPage: page }),

  totalTextbookPages: () =>
    Math.ceil(get().textbooks.length / RECORDS_PER_PAGE),

  paginatedTextbookRecords: () => {
    const { textbookCurrentPage, textbooks } = get();
    return paginate(textbooks, textbookCurrentPage, RECORDS_PER_PAGE);
  },

  // === Workloads ===
  workloads: [],
  workloadSummary: null,
  quarterComparison: [],
  availableQuarters: [],
  currentQuarter: null,
  currentAcademicYear: null,
  workloadCurrentPage: 1,

  fetchWorkloads: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get("/teacher/workload");

      const teachingLoadDetails = Array.isArray(
        data?.data?.teaching_load_details
      )
        ? data.data.teaching_load_details
        : [];

      set({
        workloads: teachingLoadDetails,
        workloadSummary: data?.data?.summary || null,
        quarterComparison: Array.isArray(data?.data?.quarter_comparison)
          ? data.data.quarter_comparison
          : [],
        currentQuarter: data?.current_quarter || null,
        currentAcademicYear: data?.current_academic_year || null,
        availableQuarters: Array.isArray(data?.available_quarters)
          ? data.available_quarters
          : [],
        loading: false,
      });
    } catch (error) {
      handleError(error, "Failed to fetch workload data", set);
    }
  },

  setWorkloadCurrentPage: (page) => set({ workloadCurrentPage: page }),

  totalWorkloadPages: () =>
    Math.ceil(get().workloads.length / RECORDS_PER_PAGE),

  paginatedWorkloadRecords: () => {
    const { workloads, workloadCurrentPage } = get();
    return paginate(workloads, workloadCurrentPage, RECORDS_PER_PAGE);
  },

  // === Student Approval ===
  studentRequests: {
    approved: [],
    pending: [],
    rejected: [],
  },
  loadingStudentRequests: false,
  studentRequestError: null,

  fetchStudentRequests: async () => {
    set({ loadingStudentRequests: true, studentRequestError: null });

    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosInstance.get("/teacher/students/pending"),
        axiosInstance.get("/teacher/students/approved"),
        axiosInstance.get("/teacher/students/rejected"),
      ]);

      set({
        studentRequests: {
          pending: pendingRes.data.requests?.data || pendingRes.data || [],
          approved: approvedRes.data.requests?.data || approvedRes.data || [],
          rejected: rejectedRes.data.requests?.data || rejectedRes.data || [],
        },
        loadingStudentRequests: false,
      });
    } catch (err) {
      console.error("Failed to fetch student requests:", err);
      set({
        studentRequestError: "Failed to fetch student requests.",
        loadingStudentRequests: false,
      });
    }
  },

  approveStudentRequest: async (id) => {
    try {
      await axiosInstance.put(`/teacher/student-requests/${id}/approve`);
      await get().fetchStudentRequests();
      toast.success("Student request approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      const message = "Failed to approve student request.";
      set({ studentRequestError: message });
      toast.error(message);
    }
  },

  rejectStudentRequest: async (id) => {
    try {
      await axiosInstance.put(`/teacher/student-requests/${id}/reject`);
      await get().fetchStudentRequests();
      toast.success("Student request rejected successfully!");
    } catch (err) {
      console.error("Rejection failed:", err);
      const message = "Failed to reject student request.";
      set({ studentRequestError: message });
      toast.error(message);
    }
  },

  studentRequestCurrentPage: 1,

  setStudentRequestCurrentPage: (page) =>
    set({ studentRequestCurrentPage: page }),

  totalStudentRequestPages: () =>
    Math.ceil(get().studentRequests.pending.length / RECORDS_PER_PAGE),

  paginatedStudentRequests: () => {
    const { studentRequests, studentRequestCurrentPage } = get();
    return paginate(
      studentRequests.pending,
      studentRequestCurrentPage,
      RECORDS_PER_PAGE
    );
  },

  // === Parent Conference ===
  conferenceStudents: [],
  selectedConferenceStudent: null,
  conferenceSection: "",
  conferenceLoading: false,
  conferenceError: null,

  fetchConferenceDashboard: async () => {
    set({ conferenceLoading: true, conferenceError: null });

    try {
      const { data } = await axiosInstance.get(
        "/teacher/parents-conference/dashboard"
      );

      set({
        conferenceSection: data.section || "",
        conferenceStudents: Array.isArray(data.students) ? data.students : [],
        conferenceLoading: false,
      });
    } catch (err) {
      console.error("Conference dashboard error:", err.response);

      if (err.response?.status === 403) {
        const message =
          err.response?.data?.message ||
          "Access denied. You may not be assigned as a section advisor for the current academic year.";
        set({
          conferenceError: message,
          conferenceLoading: false,
        });
      } else {
        handleError(err, "Failed to load parent conference data", set);
      }
    }
  },

  fetchConferenceStudentProfile: async (studentId) => {
    set({ conferenceLoading: true, conferenceError: null });

    try {
      const { data } = await axiosInstance.get(
        `/teacher/parents-conference/student-data/${studentId}`
      );
      set({
        selectedConferenceStudent: data.student,
        conferenceSection: data.section || "",
        conferenceLoading: false,
      });
    } catch (err) {
      handleError(err, "Unable to load student profile", set);
    }
  },

  downloadStudentReportCard: async (studentId) => {
    set({ conferenceLoading: true, conferenceError: null });

    try {
      const response = await axiosInstance.get(
        `/teacher/parents-conference/print-student-card/${studentId}`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Student_Report_Card_${studentId}.pdf`;
      downloadPDF(blob, fileName);

      set({ conferenceLoading: false });
      toast.success("Report card downloaded successfully!");
    } catch (err) {
      handleError(err, "Failed to download student report card", set);
      toast.error("Download failed");
    }
  },

  downloadAllStudentReportCards: async () => {
    set({ conferenceLoading: true, conferenceError: null });

    try {
      const response = await axiosInstance.get(
        "/teacher/parents-conference/print-all-student-cards",
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = "All_Student_Report_Cards.pdf";
      downloadPDF(blob, fileName);

      set({ conferenceLoading: false });
      toast.success("All report cards downloaded successfully!");
    } catch (err) {
      handleError(err, "Failed to download all report cards", set);
      toast.error("Download failed");
    }
  },

  clearConferenceData: () => {
    set({
      conferenceStudents: [],
      selectedConferenceStudent: null,
      conferenceSection: "",
      conferenceError: null,
    });
  },

  // === BMI / Health Profile ===
  bmiStudents: [],
  bmiLoading: false,
  bmiError: null,

  fetchBmiStudents: async (sectionId, academicYearId, quarterId) => {
    set({ bmiLoading: true, bmiError: null });

    const filters = get().getCurrentFilters();
    const params = {
      section_id: sectionId || filters.sectionId,
      academic_year_id: academicYearId || filters.academicYearId,
      quarter_id: quarterId || filters.quarterId,
    };

    if (!params.section_id || !params.academic_year_id || !params.quarter_id) {
      set({
        bmiError: "Missing required parameters for BMI data",
        bmiLoading: false,
      });
      return;
    }

    try {
      const { data } = await axiosInstance.get("/teacher/student-bmi", {
        params,
      });
      set({ bmiStudents: data.students || data || [], bmiLoading: false });
    } catch (err) {
      console.error("Failed to fetch BMI records:", err);
      set({
        bmiError: "Could not load BMI data.",
        bmiLoading: false,
      });
    }
  },

  addStudentBmi: async (bmiData) => {
    try {
      const response = await axiosInstance.post(
        "/teacher/student-bmi",
        bmiData
      );
      toast.success("BMI record added successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to add BMI record");
      throw err;
    }
  },

  updateStudentBmi: async (id, bmiData) => {
    try {
      const response = await axiosInstance.put(
        `/teacher/student-bmi/${id}`,
        bmiData
      );
      toast.success("BMI record updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update BMI record");
      throw err;
    }
  },

  deleteStudentBmi: async (id) => {
    try {
      const response = await axiosInstance.delete(`/teacher/student-bmi/${id}`);
      toast.success("BMI record deleted successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to delete BMI record");
      throw err;
    }
  },

  // === GLOBAL ACTIONS ===
  // Refresh data based on current global filters
  refreshAllData: async () => {
    const filters = get().getCurrentFilters();

    if (!filters.academicYearId || !filters.quarterId || !filters.sectionId) {
      console.log("Cannot refresh data - missing required filters");
      return;
    }

    try {
      // Refresh all relevant data
      await Promise.all([
        get().fetchGrades(),
        get().fetchAdminCertificateData(),
        get().fetchBmiStudents(),
        get().fetchMonthlyAttendance(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  },
}));
