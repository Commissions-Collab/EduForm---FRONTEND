import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getItem, paginate } from "../lib/utils";

const RECORDS_PER_PAGE = 10;

export const useAdminStore = create((set, get) => ({
  loading: false,
  error: null,

  // === Attendance ===
  records: [],

  fetchAttendanceData: async () => {
    set({ loading: true, error: null });
    const scheduleId = getItem("scheduleId", false);

    if (!scheduleId) {
      set({ error: "Schedule not selected", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        `/teacher/schedule/${scheduleId}/students`
      );
      set({ records: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
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
      await axiosInstance.post("/teacher/attendance/update-individual", {
        student_id,
        status,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      set({ error: "Failed to update status" });
    }
  },

  setReason: async (student_id, reason) => {
    const updated = get().records.map((student) =>
      student.id === student_id ? { ...student, reason } : student
    );
    set({ records: updated });

    try {
      await axiosInstance.post("/teacher/attendance/update-individual", {
        student_id,
        reason,
      });
    } catch (err) {
      console.error("Failed to update reason:", err);
      set({ error: "Failed to update reason" });
    }
  },

  attendanceSummary: () => {
    const { records } = get();
    const total = records.length || 1;

    const count = (status) => records.filter((r) => r.status === status).length;

    return {
      present: {
        count: count("Present"),
        percent: ((count("Present") / total) * 100).toFixed(0),
      },
      absent: {
        count: count("Absent"),
        percent: ((count("Absent") / total) * 100).toFixed(0),
      },
      late: {
        count: count("Late"),
        percent: ((count("Late") / total) * 100).toFixed(0),
      },
    };
  },

  downloadAttendancePDF: async () => {
    set({ loading: true, error: null });
    const sectionId = getItem("sectionId", false);

    if (!sectionId) {
      set({ error: "Section not selected", loading: false });
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/attendance/quarterly/pdf`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Quarterly_Attendance_Summary.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      set({ error: err.message || "PDF download failed" });
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
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/filter-options"
      );
      set({ filters: data });
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
      set({ error: "Unable to load filter options" });
    } finally {
      set({ loading: false });
    }
  },

  fetchGrades: async () => {
    set({ loading: true, error: null });

    const params = {
      academic_year_id: 3,
      quarter_id: 1,
      section_id: 5,
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
      });
    } catch (err) {
      console.error("Grades fetch failed:", err);
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
    } catch (err) {
      console.error("Failed to update grade:", err);
      set({ error: "Grade update failed" });
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });

    const params = {
      academic_year_id: getItem("academicYearId", false),
      quarter_id: getItem("quarterId", false),
      section_id: getItem("sectionId", false),
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
      return data;
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
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

  // Promotion
  promotionStudents: [],
  promotionCurrentPage: 1,
  overallPromotionStats: null,
  isPromotionAccessible: false,
  promotionMessage: null,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });

    const academicYearId = getItem("academicYearId", false);
    const sectionId = getItem("sectionId", false);

    if (!academicYearId || !sectionId) {
      set({ error: "Missing required filters", loading: false });
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/promotion-reports/statistics",
        {
          params: { academic_year_id: academicYearId, section_id: sectionId },
        }
      );

      set({
        promotionStudents: Array.isArray(data?.students) ? data.students : [],
        overallPromotionStats: data.overall_statistics || null,
        isPromotionAccessible: data.accessible ?? false,
        promotionMessage: null,
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
      });
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
  certificateCurrentPage: 1,

  fetchAdminCertificateData: async () => {
    set({ loading: true, error: null });

    const sectionId = getItem("sectionId", false);
    const academicYearId = getItem("academicYearId", false);
    const quarterId = getItem("quarterId", false);

    if (!sectionId || !academicYearId || !quarterId) {
      set({ error: "Missing certificate filter data", loading: false });
      return;
    }

    try {
      const response = await axiosInstance.get("/teacher/certificate", {
        params: {
          academic_year_id: academicYearId,
          section_id: sectionId,
          quarter_id: quarterId,
        },
      });

      set({
        attendanceCertificates: response.data.perfect_attendance || [],
        honorCertificates: response.data.honor_roll || [],
      });
    } catch (err) {
      console.error("Failed to fetch admin certificates:", err);
      set({ error: "Failed to fetch certificates" });
    } finally {
      set({ loading: false });
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

  // === Textbooks ===
  textbooks: [],
  textbookCurrentPage: 1,

  fetchTextbooks: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get("/teacher/book-management");
      const textbooks = response.data?.books?.data || [];
      set({ textbooks });
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
      });
    } catch (error) {
      console.error("Workload fetch failed:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch workload data";
      set({ error: errorMessage });
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
