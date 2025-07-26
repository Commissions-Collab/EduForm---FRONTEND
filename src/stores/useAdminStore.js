import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getItem, paginate } from "../lib/utils";

const RECORDS_PER_PAGE = 5;

export const useAdminStore = create((set, get) => ({
  // === Global ===
  loading: false,
  error: null,

  // === Attendance ===
  records: [],

  fetchAttendanceData: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);

      const { data } = await axiosInstance.get(
        `/teacher/sections/${sectionId}/attendance`,
        {
          params: {
            quarter_id: quarterId,
            academic_year_id: academicYearId,
          },
        }
      );

      set({ records: data });
    } catch {
      set({ error: "Failed to fetch attendance" });
    } finally {
      set({ loading: false });
    }
  },

  setStatus: async (id, status) => {
    const updated = get().records.map((student) =>
      student.id === id
        ? {
            ...student,
            status,
            reason: status === "Present" ? "" : student.reason,
          }
        : student
    );
    set({ records: updated });

    try {
      await axiosInstance.patch(`/attendance/${id}/status`, { status });
    } catch {
      set({ error: "Failed to fetch" });
    }
  },

  setReason: async (id, reason) => {
    const updated = get().records.map((student) =>
      student.id === id ? { ...student, reason } : student
    );
    set({ records: updated });

    try {
      await axiosInstance.patch(`/attendance/${id}/reason`, { reason });
    } catch {
      set({ error: "Failed to fetch" });
    }
  },

  attendanceSummary: () => {
    const { records } = get();
    const total = records.length || 1;

    const summary = {
      present: records.filter((r) => r.status === "Present").length,
      absent: records.filter((r) => r.status === "Absent").length,
      late: records.filter((r) => r.status === "Late").length,
    };

    return {
      present: {
        count: summary.present,
        percent: ((summary.present / total) * 100).toFixed(0),
      },
      absent: {
        count: summary.absent,
        percent: ((summary.absent / total) * 100).toFixed(0),
      },
      late: {
        count: summary.late,
        percent: ((summary.late / total) * 100).toFixed(0),
      },
    };
  },

  downloadAttendancePDF: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);

      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/attendance/quarterly/pdf`,
        {
          params: {
            quarter_id: quarterId,
            academic_year_id: academicYearId,
          },
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Quarterly_Attendance_Summary.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // === Certificates ===
  attendanceCertificates: [],
  honorCertificates: [],
  currentPage: 1,

  fetchCertificateData: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);
      const token = getItem("token", false);

      const [attendanceRes, honorRes] = await Promise.all([
        axiosInstance.get(
          `/teacher/sections/${sectionId}/certificates/attendance`,
          {
            params: {
              academic_year_id: academicYearId,
              quarter_id: quarterId,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axiosInstance.get(`/teacher/sections/${sectionId}/certificates/honor`, {
          params: { academic_year_id: academicYearId },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      set({
        attendanceCertificates: attendanceRes.data,
        honorCertificates: honorRes.data,
      });
    } catch {
      set({ error: "Failed to fetch certificates" });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: (type) => {
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return Math.ceil(certificates.length / RECORDS_PER_PAGE);
  },

  paginatedRecords: (type) => {
    const { currentPage } = get();
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return paginate(certificates, currentPage, RECORDS_PER_PAGE);
  },

  // === Grades ===
  students: [],
  selectedQuarter: "All Quarters",

  fetchGrades: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);
      const token = getItem("token", false);

      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/grades`,
        {
          params: {
            quarter_id: quarterId,
            academic_year_id: academicYearId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const grades = response.data?.grades || response.data || [];
      set({ students: grades });
    } catch (error) {
      console.error("Grades fetch failed:", error);
      set({ error: "Failed to fetch grades" });
    } finally {
      set({ loading: false });
    }
  },

  updateGrade: async (studentId, field, value) => {
    const updatedStudents = get().students.map((student) =>
      student.id === studentId
        ? {
            ...student,
            [field]:
              field === "name" ? value : value === "" ? "" : Number(value),
          }
        : student
    );

    set({ students: updatedStudents });

    try {
      await axiosInstance.patch(
        `/grades/${studentId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${getItem("token", false)}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update grade:", error);
      set({ error: "Failed to update grade" });
    }
  },

  setSelectedQuarter: (quarter) => set({ selectedQuarter: quarter }),

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedGradeRecords: () => {
    const { currentPage, students } = get();
    return paginate(students, currentPage, RECORDS_PER_PAGE);
  },

  // === Promotions ===
  promotionStudents: [],
  promotionCurrentPage: 1,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const token = getItem("token", false);

      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/promotions`,
        {
          params: { academic_year_id: academicYearId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.students || [];

      if (!Array.isArray(data)) throw new Error("Invalid promotions format");

      set({ promotionStudents: data });
    } catch (err) {
      console.error("Promotion fetch failed:", err);
      set({ error: "Failed to fetch promotions" });
    } finally {
      set({ loading: false });
    }
  },

  setPromotionCurrentPage: (page) => set({ promotionCurrentPage: page }),

  totalPromotionPages: () =>
    Math.ceil(get().promotionStudents.length / RECORDS_PER_PAGE),

  paginatedPromotionRecords: () => {
    const { promotionStudents, promotionCurrentPage } = get();
    return paginate(promotionStudents, promotionCurrentPage, RECORDS_PER_PAGE);
  },

  // === Textbooks ===
  textbooks: [],
  textbookCurrentPage: 1,

  fetchTextbooks: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const token = getItem("token", false);

      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/textbooks`,
        {
          params: { academic_year_id: academicYearId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || [];
      set({ textbooks: data });
    } catch (err) {
      console.error("Textbook fetch failed:", err);
      set({ error: "Failed to fetch textbooks" });
    } finally {
      set({ loading: false });
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
  workloadCurrentPage: 1,

  fetchWorkloads: async () => {
    set({ loading: true, error: null });

    try {
      const token = getItem("token", false);
      const response = await axiosInstance.get("/teacher/workloads", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.workloads || [];
      set({ workloads: data });
    } catch (err) {
      console.error("Workload fetch failed:", err);
      set({ error: "Failed to fetch workloads" });
    } finally {
      set({ loading: false });
    }
  },

  setWorkloadCurrentPage: (page) => set({ workloadCurrentPage: page }),

  totalWorkloadPages: () =>
    Math.ceil(get().workloads.length / RECORDS_PER_PAGE),

  paginatedWorkloadRecords: () => {
    const { workloads, workloadCurrentPage } = get();
    return paginate(workloads, workloadCurrentPage, RECORDS_PER_PAGE);
  },
}));
