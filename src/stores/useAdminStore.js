import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getItem, paginate } from "../lib/utils";

const RECORDS_PER_PAGE = 10;

export const useAdminStore = create((set, get) => ({
  loading: false,
  error: null,

  // === Attendance ===
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  weeklySchedule: [],

  fetchWeeklySchedule: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(`/teacher/schedule/weekly`);
      set({ weeklySchedule: data?.data || [] });
    } catch (err) {
      console.error("Failed to fetch weekly schedule:", err);
      set({ error: "Unable to fetch weekly schedule" });
    } finally {
      set({ loading: false });
    }
  },

  // === 2. Get list of students in a schedule
  fetchScheduleStudents: async () => {
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
      set({ scheduleAttendance: data?.data || {} });
    } catch (err) {
      console.error("Failed to fetch students:", err);
      set({ error: "Unable to fetch students for schedule" });
    } finally {
      set({ loading: false });
    }
  },

  updateIndividualAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-individual`,
        payload
      );

      return data;
    } catch (err) {
      console.error("Failed to update individual attendance:", err);
      set({ error: "Update failed" });
    } finally {
      set({ loading: false });
    }
  },

  // === 4. Bulk update attendance
  updateBulkAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-bulk`,
        payload
      );

      return data;
    } catch (err) {
      console.error("Failed to bulk update attendance:", err);
      set({ error: "Bulk update failed" });
    } finally {
      set({ loading: false });
    }
  },

  // === 5. Update all students with same status (e.g., All Present)
  updateAllStudentsAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-all`,
        payload
      );

      return data;
    } catch (err) {
      console.error("Failed to update all students attendance:", err);
      set({ error: "Update for all students failed" });
    } finally {
      set({ loading: false });
    }
  },

  // === 6. Fetch Schedule Attendance History
  fetchScheduleAttendanceHistory: async () => {
    set({ loading: true, error: null });

    const scheduleId = getItem("scheduleId", false);
    const startDate = getItem("startDate", false);
    const endDate = getItem("endDate", false);

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

      set({ scheduleAttendance: data?.data || {} });
    } catch (err) {
      console.error("Failed to fetch schedule attendance history:", err);
      set({ error: "Unable to fetch attendance history" });
    } finally {
      set({ loading: false });
    }
  },

  // === 7. Fetch Student Attendance History
  fetchStudentAttendanceHistory: async () => {
    set({ loading: true, error: null });

    const studentId = getItem("studentId", false);
    const scheduleId = getItem("scheduleId", false);
    const academicYearId = getItem("academicYearId", false);
    const startDate = getItem("startDate", false);
    const endDate = getItem("endDate", false);

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

      set({ studentAttendance: data?.data || {} });
    } catch (err) {
      console.error("Failed to fetch student attendance:", err);
      set({ error: "Unable to fetch student attendance history" });
    } finally {
      set({ loading: false });
    }
  },

  // === 8. Download Quarterly Attendance PDF
  downloadQuarterlyAttendancePDF: async () => {
    set({ loading: true, error: null });

    const sectionId = getItem("sectionId", false);
    const academicYearId = getItem("academicYearId", false);
    const quarterId = getItem("quarterId", false);

    if (!sectionId || !academicYearId || !quarterId) {
      set({
        error: "Section, Academic Year, or Quarter is not selected",
        loading: false,
      });
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/teacher/sections/${sectionId}/attendance/quarterly/pdf`,
        {
          responseType: "blob",
          params: {
            academic_year_id: academicYearId,
            quarter_id: quarterId,
          },
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fileName = `Quarterly_Attendance_Summary_${sectionId}_${quarterId}.pdf`;
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      set({ attendancePDFBlob: blob });
    } catch (err) {
      console.error("Failed to download attendance PDF:", err);

      if (
        err.response &&
        err.response.data instanceof Blob &&
        err.response.data.type === "application/json"
      ) {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        set({ error: json.message || "Failed to generate PDF" });
      } else {
        set({ error: err.message || "PDF download failed" });
      }
    } finally {
      set({ loading: false });
    }
  },

  // === Reset
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
          pending: pendingRes.data.requests?.data || [],
          approved: approvedRes.data.requests?.data || [],
          rejected: rejectedRes.data.requests?.data || [],
        },
      });
    } catch (err) {
      console.error("Failed to fetch student requests:", err);
      set({ studentRequestError: "Failed to fetch student requests." });
    } finally {
      set({ loadingStudentRequests: false });
    }
  },

  approveStudentRequest: async (id) => {
    try {
      await axiosInstance.put(`/teacher/student-requests/${id}/approve`);
      // Refresh list after approval
      get().fetchStudentRequests();
    } catch (err) {
      console.error("Approval failed:", err);
    }
  },

  rejectStudentRequest: async (id) => {
    try {
      await axiosInstance.put(`/teacher/student-requests/${id}/reject`);
      // Refresh list after rejection
      get().fetchStudentRequests();
    } catch (err) {
      console.error("Rejection failed:", err);
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
      });
    } catch (err) {
      console.error("Failed to fetch conference dashboard:", err);
      set({ conferenceError: "Failed to load parent conference data." });
    } finally {
      set({ conferenceLoading: false });
    }
  },

  fetchConferenceStudent: async (studentId) => {
    set({ conferenceLoading: true, conferenceError: null });

    try {
      const { data } = await axiosInstance.get(
        `/teacher/parents-conference/student-data/${studentId}`
      );
      set({ selectedConferenceStudent: data.student });
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
      set({ conferenceError: "Unable to load student profile." });
    } finally {
      set({ conferenceLoading: false });
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Student_Report_Card_${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download report card:", err);
      set({ conferenceError: "Download failed." });
    } finally {
      set({ conferenceLoading: false });
    }
  },

  downloadAllReportCards: async () => {
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "All_Student_Report_Cards.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download all report cards:", err);
      set({ conferenceError: "Download failed." });
    } finally {
      set({ conferenceLoading: false });
    }
  },

  // === BMI / Health Profile ===
  bmiStudents: [],
  bmiLoading: false,
  bmiError: null,

  fetchBmiStudents: async (sectionId, academicYearId, quarterId) => {
    set({ bmiLoading: true, bmiError: null });

    try {
      const { data } = await axiosInstance.get("/teacher/student-bmi", {
        params: {
          section_id: 1,
          academic_year_id: 2,
          quarter_id: 1,
        },
      });

      set({ bmiStudents: data.students });
    } catch (err) {
      console.error("Failed to fetch BMI records:", err);
      set({ bmiError: "Could not load BMI data." });
    } finally {
      set({ bmiLoading: false });
    }
  },
  addStudentBmi: async (bmiData) => {
    await axiosInstance.post("/teacher/student-bmi", bmiData);
  },

  updateStudentBmi: async (id, bmiData) => {
    await axiosInstance.put(`/teacher/student-bmi/${id}`, bmiData);
  },

  deleteStudentBmi: async (id) => {
    await axiosInstance.delete(`/teacher/student-bmi/${id}`);
  },
}));
