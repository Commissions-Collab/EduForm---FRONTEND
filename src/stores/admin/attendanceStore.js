import { create } from "zustand";
import {
  downloadPDF,
  downloadExcel,
  getItem,
  setItem,
  removeItem,
} from "../../lib/utils";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import useFilterStore from "./filterStore";
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

const useAttendanceStore = create((set, get) => ({
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  monthlySchedule: null,
  monthlyAttendanceData: null,
  studentId: getItem("studentId", false, sessionStorage) || null,
  scheduleId: getItem("scheduleId", false, sessionStorage) || null,
  loading: false,
  error: null,

  setStudentId: (id) => {
    try {
      if (typeof id !== "string" && id !== null) {
        throw new Error("Invalid student ID");
      }
      setItem("studentId", id, sessionStorage);
      set({ studentId: id });
    } catch (error) {
      console.error("Failed to set student ID:", { error: error.message, id });
      toast.error("Invalid student ID");
    }
  },

  setScheduleId: (id) => {
    try {
      if (typeof id !== "string" && id !== null) {
        throw new Error("Invalid schedule ID");
      }
      setItem("scheduleId", id, sessionStorage);
      set({ scheduleId: id });
    } catch (error) {
      console.error("Failed to set schedule ID:", { error: error.message, id });
      toast.error("Invalid schedule ID");
    }
  },

  fetchMonthlySchedule: async (
    sectionId,
    academicYearId,
    quarterId,
    monthStart = null
  ) => {
    // Clear old schedule data before fetching new
    set({ loading: true, error: null, monthlySchedule: null });

    try {
      if (!sectionId || !academicYearId || !quarterId) {
        throw new Error(
          "Missing required filters for fetching monthly schedule"
        );
      }

      if (monthStart && !/^\d{4}-\d{2}-\d{2}$/.test(monthStart)) {
        throw new Error("Invalid month start date format");
      }

      const params = new URLSearchParams();
      params.append("section_id", sectionId);
      params.append("academic_year_id", academicYearId);
      params.append("quarter_id", quarterId);
      if (monthStart) params.append("month_start", monthStart);

      const { data, status } = await axiosInstance.get(
        `/teacher/schedule/monthly?${params.toString()}`,
        { timeout: 10000 }
      );

      console.log("Monthly Schedule API Response:", data);

      if (status !== 200 || !data?.success) {
        throw new Error(data?.message || "Invalid response from server");
      }

      // IMPORTANT: Store ONLY the schedule object, not the entire data
      console.log("Setting monthlySchedule to:", data.data.schedule);
      set({ monthlySchedule: data.data.schedule, loading: false });
      return data.data.schedule;
    } catch (err) {
      handleError(err, "Failed to fetch monthly schedule", set);
      return null;
    }
  },

  fetchScheduleAttendance: async ({ scheduleId, date }) => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/teacher/schedule/attendance`,
        {
          params: {
            schedule_id: scheduleId,
            section_id: filters.sectionId,
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
            date,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
      return data?.data;
    } catch (err) {
      handleError(err, "Unable to fetch schedule attendance", set);
      return null;
    }
  },

  fetchScheduleStudents: async (scheduleId, date) => {
    set({ loading: true, error: null });

    try {
      if (!scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/students`,
        { params: { date }, timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
      return data?.data;
    } catch (err) {
      handleError(err, "Unable to fetch students for schedule", set);
      return null;
    }
  },

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
        `/teacher/attendance/update-individual`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });

      if (data.tardiness_conversion) {
        toast.error(data.warning, {
          duration: 6000,
          icon: "⚠️",
        });
      } else {
        toast.success("Attendance updated successfully");
      }

      return data;
    } catch (err) {
      handleError(err, "Update failed", set);
      return null;
    }
  },

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
        `/teacher/attendance/update-bulk`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });

      if (data.tardiness_conversions && data.tardiness_conversions.length > 0) {
        const warningMessage =
          data.warning +
          "\n" +
          data.tardiness_conversions.map((tc) => tc.message).join("\n");

        toast.error(warningMessage, {
          duration: 8000,
          icon: "⚠️",
        });
      } else {
        toast.success("Bulk attendance updated successfully");
      }

      return data;
    } catch (err) {
      handleError(err, "Bulk update failed", set);
      return null;
    }
  },

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
        `/teacher/attendance/update-all`,
        backendPayload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });

      if (data.tardiness_conversions && data.tardiness_conversions.length > 0) {
        const studentList = data.tardiness_conversions
          .map((tc) => tc.student_name)
          .join(", ");

        toast.error(`${data.warning}\nAffected students: ${studentList}`, {
          duration: 10000,
          icon: "⚠️",
        });
      } else {
        toast.success("Attendance for all students updated successfully");
      }

      return data;
    } catch (err) {
      handleError(err, "Update for all students failed", set);
      return null;
    }
  },

  fetchTardinessStats: async (studentId, scheduleId) => {
    try {
      if (!studentId) {
        console.warn("Student ID is required for tardiness stats");
        return null;
      }

      const filters = useFilterStore.getState().globalFilters;

      if (!filters?.academicYearId || !filters?.quarterId) {
        console.warn("Missing required filters for tardiness stats");
        return null;
      }

      const params = new URLSearchParams({
        academic_year_id: filters.academicYearId,
        quarter_id: filters.quarterId,
      });

      if (scheduleId) {
        params.append("schedule_id", scheduleId);
      }

      const { data, status } = await axiosInstance.get(
        `/teacher/student/${studentId}/tardiness-stats?${params.toString()}`,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      return data.data;
    } catch (err) {
      console.error("Failed to fetch tardiness statistics:", err);
      return null;
    }
  },

  fetchScheduleAttendanceHistory: async (scheduleId, startDate, endDate) => {
    set({ loading: true, error: null });

    try {
      if (!scheduleId) {
        throw new Error("Schedule not selected");
      }

      const { data, status } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/attendance-history`,
        {
          params: { start_date: startDate, end_date: endDate },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ scheduleAttendance: data?.data || {}, loading: false });
      return data?.data;
    } catch (err) {
      handleError(err, "Unable to fetch attendance history", set);
      return null;
    }
  },

  fetchStudentAttendanceHistory: async (
    studentId,
    scheduleId,
    startDate,
    endDate
  ) => {
    set({ loading: true, error: null });

    try {
      if (!studentId || !scheduleId) {
        throw new Error("Student or schedule not selected");
      }

      const filters = useFilterStore.getState().globalFilters;
      const { data, status } = await axiosInstance.get(
        `/teacher/student/${studentId}/schedule/${scheduleId}/attendance-history`,
        {
          params: {
            academic_year_id: filters.academicYearId,
            start_date: startDate,
            end_date: endDate,
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
      return transformedData;
    } catch (err) {
      handleError(err, "Unable to fetch student attendance history", set);
      return null;
    }
  },

  downloadQuarterlyAttendancePDF: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
        throw new Error("Section, Academic Year, or Quarter is not selected");
      }

      const response = await axiosInstance.get(
        `/teacher/sections/${filters.sectionId}/attendance/quarterly/pdf`,
        {
          responseType: "blob",
          params: {
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
          },
          headers: { Accept: "application/pdf" },
          timeout: 15000,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `Quarterly_Attendance_Summary_${filters.sectionId}_${filters.quarterId}.pdf`;
      downloadPDF(blob, fileName);

      set({ attendancePDFBlob: blob, loading: false });
      toast.success("PDF downloaded successfully");
    } catch (err) {
      handleError(err, "PDF download failed", set);
    }
  },

  exportSF2Excel: async (month = null) => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.sectionId || !filters.academicYearId) {
        throw new Error("Section and Academic Year must be selected");
      }

      const selectedMonth =
        month ||
        (() => {
          const today = new Date();
          const year = today.getFullYear();
          const monthNum = String(today.getMonth() + 1).padStart(2, "0");
          return `${year}-${monthNum}`;
        })();

      if (!/^\d{4}-\d{2}$/.test(selectedMonth)) {
        throw new Error("Invalid month format. Use YYYY-MM (e.g., 2024-01)");
      }

      const response = await axiosInstance.get(
        `/teacher/attendance/export-sf2-excel`,
        {
          responseType: "blob",
          params: {
            section_id: filters.sectionId,
            academic_year_id: filters.academicYearId,
            month: selectedMonth,
          },
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          timeout: 30000,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid Excel response from server");
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const [year, monthNum] = selectedMonth.split("-");
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[parseInt(monthNum) - 1];
      const fileName = `SF2_Daily_Attendance_${monthName}_${year}.xlsx`;

      downloadExcel(blob, fileName);

      set({ loading: false });
      toast.success("SF2 Excel file downloaded successfully");
    } catch (err) {
      handleError(err, "SF2 Excel export failed", set);
    }
  },

  resetAttendanceStore: () => {
    try {
      removeItem("studentId", sessionStorage);
      removeItem("scheduleId", sessionStorage);
      set({
        scheduleAttendance: {},
        studentAttendance: {},
        attendancePDFBlob: null,
        monthlySchedule: null,
        monthlyAttendanceData: null,
        studentId: null,
        scheduleId: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to reset attendance store:", {
        error: error.message,
      });
      toast.error("Failed to reset attendance data");
    }
  },
}));

const handleUnauthorized = () => {
  useAttendanceStore.getState().resetAttendanceStore();
};

window.addEventListener("unauthorized", handleUnauthorized);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useAttendanceStore;
