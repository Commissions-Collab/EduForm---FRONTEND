import { create } from "zustand";
import { downloadPDF, getItem, setItem, removeItem } from "../../lib/utils";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import useFilterStore from "./filterStore";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  console.error(defaultMessage, err);
  toast.error(message);
  return message;
};

const useAttendanceStore = create((set, get) => ({
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  weeklySchedule: null,
  monthlyAttendanceData: null,
  studentId: getItem("studentId", false, sessionStorage) || null,
  scheduleId: getItem("scheduleId", false, sessionStorage) || null,
  loading: false,
  error: null,

  setStudentId: (id) => {
    if (typeof id !== "string" && id !== null) {
      toast.error("Invalid student ID");
      return;
    }
    setItem("studentId", id, sessionStorage);
    set({ studentId: id });
  },

  setScheduleId: (id) => {
    if (typeof id !== "string" && id !== null) {
      toast.error("Invalid schedule ID");
      return;
    }
    setItem("scheduleId", id, sessionStorage);
    set({ scheduleId: id });
  },

  fetchWeeklySchedule: async (
    sectionId,
    academicYearId,
    quarterId,
    weekStart = null
  ) => {
    set({ loading: true, error: null });

    if (!sectionId || !academicYearId || !quarterId) {
      const message = "Missing required filters for fetching weekly schedule";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    if (weekStart && !/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      const message = "Invalid week start date format";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("section_id", sectionId);
      params.append("academic_year_id", academicYearId);
      params.append("quarter_id", quarterId);
      if (weekStart) params.append("week_start", weekStart);

      const { data } = await axiosInstance.get(
        `/teacher/schedule/weekly?${params.toString()}`
      );

      if (data?.success) {
        set({ weeklySchedule: data.data, loading: false });
      } else {
        throw new Error(data?.message || "Failed to fetch weekly schedule");
      }
    } catch (err) {
      handleError(err, "Failed to fetch weekly schedule", set);
    }
  },

  fetchScheduleAttendance: async ({ scheduleId, date }) => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      toast.error("Schedule not selected");
      return;
    }

    try {
      const { data } = await axiosInstance.get(`/teacher/schedule/attendance`, {
        params: {
          schedule_id: scheduleId,
          section_id: filters.sectionId,
          academic_year_id: filters.academicYearId,
          quarter_id: filters.quarterId,
          date,
        },
      });
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch schedule attendance", set);
    }
  },

  fetchScheduleStudents: async (scheduleId, date) => {
    set({ loading: true, error: null });

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      toast.error("Schedule not selected");
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/students`,
        { params: { date } }
      );
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch students for schedule", set);
    }
  },

  updateIndividualAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const backendPayload = {
        student_id: payload.student_id,
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status.toLowerCase(),
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-individual`,
        backendPayload
      );
      set({ loading: false });
      toast.success("Attendance updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Update failed", set);
    }
  },

  updateBulkAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
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

      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-bulk`,
        backendPayload
      );
      set({ loading: false });
      toast.success("Bulk attendance updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Bulk update failed", set);
    }
  },

  updateAllStudentsAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const backendPayload = {
        schedule_id: payload.schedule_id,
        attendance_date: payload.date || payload.attendance_date,
        status: payload.status.toLowerCase(),
        time_in: payload.time_in,
        time_out: payload.time_out,
        remarks: payload.remarks || payload.reason,
      };

      await fetchCsrfToken();
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-all`,
        backendPayload
      );
      set({ loading: false });
      toast.success("Attendance for all students updated successfully");
      return data;
    } catch (err) {
      handleError(err, "Update for all students failed", set);
    }
  },

  fetchScheduleAttendanceHistory: async (scheduleId, startDate, endDate) => {
    set({ loading: true, error: null });

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      toast.error("Schedule not selected");
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/attendance-history`,
        {
          params: { start_date: startDate, end_date: endDate },
        }
      );
      set({ scheduleAttendance: data?.data || {}, loading: null });
    } catch (err) {
      handleError(err, "Unable to fetch attendance history", set);
    }
  },

  fetchStudentAttendanceHistory: async (
    studentId,
    scheduleId,
    startDate,
    endDate
  ) => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!studentId || !scheduleId) {
      set({ error: "Student or schedule not selected", loading: false });
      toast.error("Student or schedule not selected");
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/student/${studentId}/schedule/${scheduleId}/attendance-history`,
        {
          params: {
            academic_year_id: filters.academicYearId,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

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

  fetchMonthlyAttendance: async (params = {}) => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.sectionId) {
      const message = "Missing section ID";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    const now = new Date();
    let month = params.month || now.getMonth() + 1;
    let year = params.year || now.getFullYear();

    if (
      typeof params.month === "string" &&
      params.month.match(/^\d{4}-\d{2}$/)
    ) {
      const [parsedYear, parsedMonth] = params.month.split("-").map(Number);
      if (parsedMonth >= 1 && parsedMonth <= 12 && parsedYear >= 2000) {
        month = parsedMonth;
        year = parsedYear;
      } else {
        const message = "Invalid month format. Expected YYYY-MM";
        set({ error: message, loading: false });
        toast.error(message);
        return;
      }
    }

    if (month < 1 || month > 12 || year < 2000) {
      const message = "Invalid month or year";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    try {
      const filterParams = {
        month,
        year,
        academic_year_id: filters.academicYearId,
      };

      const { data } = await axiosInstance.get(
        `/teacher/sections/${filters.sectionId}/monthly-attendance`,
        { params: filterParams }
      );
      set({ monthlyAttendanceData: data?.data || null, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch monthly attendance", set);
    }
  },

  downloadQuarterlyAttendancePDF: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
      set({
        error: "Section, Academic Year, or Quarter is not selected",
        loading: false,
      });
      toast.error("Section, Academic Year, or Quarter is not selected");
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
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Quarterly_Attendance_Summary_${filters.sectionId}_${filters.quarterId}.pdf`;
      downloadPDF(blob, fileName);

      set({ attendancePDFBlob: blob, loading: false });
      toast.success("PDF downloaded successfully");
    } catch (err) {
      handleError(err, "PDF download failed", set);
    }
  },

  resetAttendanceStore: () => {
    removeItem("studentId", sessionStorage);
    removeItem("scheduleId", sessionStorage);
    set({
      scheduleAttendance: {},
      studentAttendance: {},
      attendancePDFBlob: null,
      weeklySchedule: null,
      monthlyAttendanceData: null,
      studentId: null,
      scheduleId: null,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useAttendanceStore.getState().resetAttendanceStore();
});

export default useAttendanceStore;
