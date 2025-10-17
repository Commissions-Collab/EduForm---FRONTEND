import { create } from "zustand";
import { downloadPDF, getItem, setItem, removeItem } from "../../lib/utils";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import toast from "react-hot-toast";

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  console.error(defaultMessage, {
    status: err?.response?.status,
    data: err?.response?.data,
    message: err.message,
  });
  set({ error: message, loading: false });
  toast.error(message);
  return message;
};

/**
 * SuperAdmin Attendance Store
 * Manages all attendance operations for super admin users
 */
const useSuperAdminAttendanceStore = create((set, get) => ({
  // ==================== State ====================
  loading: false,
  error: null,
  cacheTimestamp: null,

  // ==================== Monthly Attendance State ====================
  monthlyAttendanceData: null,
  monthlyLoading: false,
  monthlyError: null,

  // ==================== Other Attendance State ====================
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  weeklySchedule: null,

  // ==================== Monthly Attendance Actions ====================
  /**
   * Fetch monthly attendance summary for any section (Super Admin Access)
   */
  fetchMonthlyAttendance: async (params = {}) => {
    set({ monthlyLoading: true, monthlyError: null });

    try {
      if (!params.sectionId) {
        throw new Error("Missing section ID");
      }

      const now = new Date();
      let month = params.month || now.getMonth() + 1;
      let year = params.year || now.getFullYear();

      // Handle YYYY-MM format
      if (
        typeof params.month === "string" &&
        params.month.match(/^\d{4}-\d{2}$/)
      ) {
        const [parsedYear, parsedMonth] = params.month.split("-").map(Number);
        if (parsedMonth < 1 || parsedMonth > 12 || parsedYear < 2000) {
          throw new Error("Invalid month format. Expected YYYY-MM");
        }
        month = parsedMonth;
        year = parsedYear;
      } else if (month < 1 || month > 12 || year < 2000) {
        throw new Error("Invalid month or year");
      }

      const filterParams = {
        month,
        year,
        academic_year_id: params.academicYearId,
      };

      const { data, status } = await axiosInstance.get(
        `/admin/sections/${params.sectionId}/monthly-attendance`,
        { params: filterParams, timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        monthlyAttendanceData: data?.data || null,
        monthlyLoading: false,
        cacheTimestamp: Date.now(),
      });
    } catch (err) {
      handleError(err, "Unable to fetch monthly attendance", (state) => {
        set({ monthlyLoading: false, monthlyError: state.error });
      });
    }
  },

  /**
   * Download quarterly attendance PDF
   */
  downloadQuarterlyAttendancePDF: async (params = {}) => {
    set({ monthlyLoading: true, monthlyError: null });

    try {
      if (!params.sectionId || !params.academicYearId || !params.quarterId) {
        throw new Error("Section, Academic Year, or Quarter is not selected");
      }

      const response = await axiosInstance.get(
        `/admin/sections/${params.sectionId}/attendance/quarterly/pdf`,
        {
          responseType: "blob",
          params: {
            academic_year_id: params.academicYearId,
            quarter_id: params.quarterId,
          },
          headers: { Accept: "application/pdf" },
          timeout: 15000,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Quarterly_Attendance_Summary_${params.sectionId}_${params.quarterId}.pdf`;
      downloadPDF(blob, fileName);

      set({ attendancePDFBlob: blob, monthlyLoading: false });
      toast.success("PDF downloaded successfully");
    } catch (err) {
      handleError(err, "PDF download failed", (state) => {
        set({ monthlyLoading: false, monthlyError: state.error });
      });
    }
  },

  /**
   * Export monthly attendance data to CSV
   */
  exportMonthlyAttendanceCSV: async () => {
    try {
      const state = get();

      if (!state.monthlyAttendanceData) {
        throw new Error("No attendance data available to export");
      }

      const data = state.monthlyAttendanceData;
      const csvContent = generateCSVContent(data);

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const fileName = `Monthly_Attendance_${data.section?.name}_${data.period?.month_name}.csv`;
      downloadPDF(blob, fileName.replace(/\s+/g, "_"));

      toast.success("CSV exported successfully");
    } catch (err) {
      handleError(err, "CSV export failed", set);
    }
  },

  /**
   * Check if cached monthly data is still valid (5 minutes)
   */
  isMonthlyCacheValid: () => {
    const state = get();
    if (!state.cacheTimestamp) return false;
    const now = Date.now();
    const cacheAge = now - state.cacheTimestamp;
    return cacheAge < 5 * 60 * 1000; // 5 minutes
  },

  /**
   * Clear monthly attendance cache
   */
  clearMonthlyCache: () => {
    set({
      monthlyAttendanceData: null,
      monthlyLoading: false,
      monthlyError: null,
      cacheTimestamp: null,
    });
  },

  /**
   * Get cached monthly attendance data
   */
  getCachedMonthlyData: () => {
    return get().monthlyAttendanceData;
  },

  // ==================== Other Attendance Actions ====================
  /**
   * Fetch schedule attendance for a specific date
   */
  fetchScheduleAttendance: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      if (!params.scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/admin/schedule/attendance`,
        {
          params: {
            schedule_id: params.scheduleId,
            section_id: params.sectionId,
            academic_year_id: params.academicYearId,
            date: params.date,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch schedule attendance", set);
    }
  },

  /**
   * Fetch students for a specific schedule
   */
  fetchScheduleStudents: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      if (!params.scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/admin/schedule/${params.scheduleId}/students`,
        { params: { date: params.date }, timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch students for schedule", set);
    }
  },

  /**
   * Fetch attendance history for a schedule
   */
  fetchScheduleAttendanceHistory: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      if (!params.scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/admin/schedule/${params.scheduleId}/attendance-history`,
        {
          params: {
            start_date: params.startDate,
            end_date: params.endDate,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch attendance history", set);
    }
  },

  /**
   * Fetch student attendance history for a specific period
   */
  fetchStudentAttendanceHistory: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      if (!params.studentId || !params.scheduleId) {
        throw new Error("Student or schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/admin/student/${params.studentId}/schedule/${params.scheduleId}/attendance-history`,
        {
          params: {
            academic_year_id: params.academicYearId,
            start_date: params.startDate,
            end_date: params.endDate,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const transformedData = {
        student: {
          full_name:
            data.data.student?.full_name ||
            data.data.student?.name ||
            "Unknown",
          name:
            data.data.student?.name ||
            data.data.student?.full_name ||
            "Unknown",
        },
        subject: {
          name: data.data.subject?.name || data.data.subject?.title || "N/A",
        },
        section: {
          name: data.data.section?.name || data.data.section?.id || "N/A",
        },
        academic_year: {
          name:
            data.data.academic_year?.name ||
            data.data.academic_year?.id ||
            "N/A",
        },
        period: {
          start_date:
            data.data.period?.start_date || data.data.start_date || "",
          end_date: data.data.period?.end_date || data.data.end_date || "",
        },
        attendance_summary: data.data.attendance_summary || {},
        monthly_breakdown: data.data.monthly_breakdown || {},
        attendance_records: Array.isArray(data.data.attendance_records)
          ? data.data.attendance_records.map((record) => ({
              date: record.date || record.attendance_date || "",
              status: record.status || "Unknown",
              reason: record.reason || record.remarks || null,
              time_in: record.time_in || null,
              time_out: record.time_out || null,
            }))
          : [],
      };

      set({ studentAttendance: transformedData, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch student attendance history", set);
    }
  },

  /**
   * Fetch weekly schedule
   */
  fetchWeeklySchedule: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      if (!params.sectionId || !params.academicYearId || !params.quarterId) {
        throw new Error(
          "Missing required filters for fetching weekly schedule"
        );
      }

      if (params.weekStart && !/^\d{4}-\d{2}-\d{2}$/.test(params.weekStart)) {
        throw new Error("Invalid week start date format");
      }

      const queryParams = new URLSearchParams();
      queryParams.append("section_id", params.sectionId);
      queryParams.append("academic_year_id", params.academicYearId);
      queryParams.append("quarter_id", params.quarterId);
      if (params.weekStart) queryParams.append("week_start", params.weekStart);

      const { data, status } = await axiosInstance.get(
        `/admin/schedule/weekly?${queryParams.toString()}`,
        { timeout: 10000 }
      );

      if (status !== 200 || !data?.success) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ weeklySchedule: data.data, loading: false });
    } catch (err) {
      handleError(err, "Failed to fetch weekly schedule", set);
    }
  },

  /**
   * Update individual attendance record
   */
  updateIndividualAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const backendPayload = {
        student_id: payload.student_id,
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status?.toLowerCase(),
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      if (
        !backendPayload.student_id ||
        !backendPayload.schedule_id ||
        !backendPayload.attendance_date
      ) {
        throw new Error("Missing required attendance fields");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        `/admin/attendance/update-individual`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      toast.success("Attendance updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Update failed", set);
      return null;
    }
  },

  /**
   * Update bulk attendance records
   */
  updateBulkAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const backendPayload = {
        schedule_id: payload.schedule_id,
        attendance_date: payload.attendance_date,
        attendances: Array.isArray(payload.attendances)
          ? payload.attendances.map((att) => ({
              student_id: att.student_id,
              status: att.status?.toLowerCase(),
              time_in: att.time_in,
              time_out: att.time_out,
              remarks: att.remarks || att.reason,
            }))
          : [],
      };

      if (
        !backendPayload.schedule_id ||
        !backendPayload.attendance_date ||
        !backendPayload.attendances.length
      ) {
        throw new Error("Missing required bulk attendance fields");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        `/admin/attendance/update-bulk`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      toast.success("Bulk attendance updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Bulk update failed", set);
      return null;
    }
  },

  /**
   * Update attendance for all students in a schedule
   */
  updateAllStudentsAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const backendPayload = {
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status?.toLowerCase(),
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      if (
        !backendPayload.schedule_id ||
        !backendPayload.attendance_date ||
        !backendPayload.status
      ) {
        throw new Error("Missing required fields for updating all students");
      }

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.post(
        `/admin/attendance/update-all`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      toast.success("Attendance for all students updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Update for all students failed", set);
      return null;
    }
  },

  /**
   * Reset entire attendance store
   */
  resetAttendanceStore: () => {
    try {
      set({
        loading: false,
        error: null,
        cacheTimestamp: null,
        monthlyAttendanceData: null,
        monthlyLoading: false,
        monthlyError: null,
        scheduleAttendance: {},
        studentAttendance: {},
        attendancePDFBlob: null,
        weeklySchedule: null,
      });
    } catch (error) {
      console.error("Failed to reset attendance store:", {
        error: error.message,
      });
      toast.error("Failed to reset attendance data");
    }
  },

  /**
   * Clear only errors
   */
  clearErrors: () => {
    set({
      error: null,
      monthlyError: null,
    });
  },
}));

/**
 * Generate CSV content from monthly attendance data
 */
function generateCSVContent(data) {
  if (!data || !data.students) {
    return "";
  }

  const headers = [
    "Student Name",
    "Student ID",
    "LRN",
    "Present Days",
    "Absent Days",
    "Half Days",
    "Attendance Rate (%)",
  ];

  const rows = data.students.map((studentData) => [
    studentData.student.full_name,
    studentData.student.student_id,
    studentData.student.lrn,
    studentData.monthly_summary.present_days,
    studentData.monthly_summary.absent_days,
    studentData.monthly_summary.half_days,
    studentData.attendance_rate,
  ]);

  const csvContent = [
    [
      `Section: ${data.section?.name}`,
      `Year Level: ${data.section?.year_level}`,
    ],
    [`Academic Year: ${data.academic_year?.name}`],
    [
      `Period: ${data.period?.month_name} (${data.period?.start_date} to ${data.period?.end_date})`,
    ],
    [],
    headers,
    ...rows,
    [],
    ["Class Statistics"],
    [
      `Total Students: ${data.class_statistics?.total_students}`,
      `Average Attendance Rate: ${data.class_statistics?.average_attendance_rate}%`,
    ],
    [
      `Students Above 90%: ${data.class_statistics?.students_above_90}`,
      `Students Below 75%: ${data.class_statistics?.students_below_75}`,
    ],
    [
      `Highest Attendance: ${data.class_statistics?.highest_attendance}%`,
      `Lowest Attendance: ${data.class_statistics?.lowest_attendance}%`,
    ],
  ]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
}

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useSuperAdminAttendanceStore.getState().resetAttendanceStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useSuperAdminAttendanceStore;
