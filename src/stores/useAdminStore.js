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
      const scheduleId = getItem("scheduleId", false);

      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/students`
      );

      set({ records: data });
    } catch {
      set({ error: "Failed to fetch attendance" });
    } finally {
      set({ loading: false });
    }
  },

  setStatus: async (student_id, status) => {
    const updated = get().records.map((student) =>
      student.id === student_id
        ? {
            ...student,
            status,
            reason: status === "Present" ? "" : student.reason,
          }
        : student
    );
    set({ records: updated });

    try {
      await axiosInstance.post(`/teacher/attendance/update-individual`, {
        student_id,
        status,
      });
    } catch {
      set({ error: "Failed to update status" });
    }
  },

  setReason: async (student_id, reason) => {
    const updated = get().records.map((student) =>
      student.id === student_id ? { ...student, reason } : student
    );
    set({ records: updated });

    try {
      await axiosInstance.post(`/teacher/attendance/update-individual`, {
        student_id,
        reason,
      });
    } catch {
      set({ error: "Failed to update reason" });
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

      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/attendance/quarterly/pdf`,
        {
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

  // === Grades ===
  students: [],
  subjects: [],
  selectedQuarter: null,
  selectedAcademicYear: null,
  selectedSection: null,
  currentPage: 1,
  filters: {
    academic_years: [],
    assignments_by_year: [],
  },

  fetchFilterOptions: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/filter-options"
      );
      set({ filters: data });
    } catch (error) {
      console.error("Failed to fetch filter options", error);
      set({ error: "Unable to load filter options" });
    } finally {
      set({ loading: false });
    }
  },

  fetchGrades: async () => {
    set({ loading: true });
    try {
      const params = {
        academic_year_id: getItem("academicYearId", false),
        quarter_id: getItem("quarterId", false),
        section_id: getItem("sectionId", false),
      };

      const { data } = await axiosInstance.get(
        "/teacher/academic-records/students-grade",
        { params }
      );

      set({
        students: data.students,
        subjects: data.subjects,
      });
    } catch (error) {
      console.error("Grades fetch failed:", error);
      set({ error: "Failed to fetch grades" });
    } finally {
      set({ loading: false });
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
    } catch (error) {
      console.error("Failed to update grade:", error);
      set({ error: "Grade update failed" });
    }
  },

  fetchStatistics: async () => {
    set({ loading: true });

    try {
      const params = {
        academic_year_id: getItem("academicYearId", false),
        quarter_id: getItem("quarterId", false),
        section_id: getItem("sectionId", false),
      };

      const { data } = await axiosInstance.get(
        "/teacher/academic-records/statistics",
        { params }
      );

      return data;
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      set({ error: "Unable to fetch grade statistics" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setSelectedQuarter: (quarterId) => set({ selectedQuarter: quarterId }),

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedGradeRecords: () => {
    const { currentPage, students } = get();
    return paginate(students, currentPage, RECORDS_PER_PAGE);
  },

  setPage: (page) => set({ currentPage: page }),

  // === Promotion Reports ===
  promotionStudents: [],
  promotionCurrentPage: 1,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });

    try {
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);
      const sectionId = getItem("sectionId", false);

      const { data } = await axiosInstance.get(
        "/teacher/promotion-reports/statistics",
        {
          params: {
            academic_year_id: academicYearId,
            quarter_id: quarterId,
            section_id: sectionId,
          },
        }
      );

      const students = data?.students ?? [];
      if (!Array.isArray(students)) throw new Error("Invalid students format");

      set({ promotionStudents: students });
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
