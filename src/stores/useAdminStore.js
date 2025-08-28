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
        academicYearId: academicYearId || null,
        quarterId: quarterId ? parseInt(quarterId) : null,
        sectionId: sectionId ? parseInt(sectionId) : null,
      },
    });
  },

  // Set global filters and save to localStorage
  setGlobalFilters: (filters) => {
    const newFilters = { ...get().globalFilters, ...filters };

    // Save to localStorage
    if (newFilters.academicYearId) {
      setItem("academicYearId", newFilters.academicYearId);
    }
    if (newFilters.quarterId) {
      setItem("quarterId", newFilters.quarterId);
    }
    if (newFilters.sectionId) {
      setItem("sectionId", newFilters.sectionId);
    }

    set({ globalFilters: newFilters });

    // Dispatch event for components to listen to
    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: newFilters,
      })
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

  // Fetch filter options - CORRECTED based on actual routes
  fetchGlobalFilterOptions: async () => {
    set({ loading: true, error: null });
    try {
      // Get academic years from the existing endpoint
      const academicResponse = await axiosInstance.get(
        "/teacher/academic-records/filter-options"
      );

      // Get sections from book management filter options (since this exists in your routes)
      const sectionsResponse = await axiosInstance.get(
        "/teacher/book-management/filter-options"
      );

      set({
        filterOptions: {
          academicYears: academicResponse.data?.academic_years || [],
          quarters: get().filterOptions.quarters, // Keep static quarters
          sections: sectionsResponse.data?.sections || [],
        },
        loading: false,
      });
    } catch (err) {
      console.error("Filter fetch error:", err);

      // Fallback: Try to get data from any available endpoint
      try {
        const fallbackResponse = await axiosInstance.get(
          "/teacher/academic-records/filter-options"
        );
        set({
          filterOptions: {
            academicYears: fallbackResponse.data?.academic_years || [],
            quarters: get().filterOptions.quarters,
            sections: [], // Will be empty but won't break
          },
          loading: false,
        });
      } catch (fallbackErr) {
        handleError(fallbackErr, "Unable to load filter options", set);
      }
    }
  },

  // Get current filter values (with fallback to localStorage)
  getCurrentFilters: () => {
    const { globalFilters } = get();
    return {
      academicYearId:
        globalFilters.academicYearId || getItem("academicYearId", false),
      quarterId: globalFilters.quarterId || getItem("quarterId", false),
      sectionId: globalFilters.sectionId || getItem("sectionId", false),
    };
  },

  // === Attendance ===
  scheduleAttendance: {},
  studentAttendance: {},
  attendancePDFBlob: null,
  weeklySchedule: [],

  fetchWeeklySchedule: async (sectionId, academicYearId, quarterId) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(`/teacher/schedule/weekly`, {
        params: {
          section_id: sectionId,
          academic_year_id: academicYearId,
          quarter_id: quarterId,
        },
      });

      console.log("✅ Weekly Schedule Response:", data);

      set({ weeklySchedule: data?.data || [], loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch weekly schedule", set);
    }
  },

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
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch students for schedule", set);
    }
  },

  updateIndividualAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-individual`,
        payload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Update failed", set);
    }
  },

  updateBulkAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-bulk`,
        payload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Bulk update failed", set);
    }
  },

  updateAllStudentsAttendance: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        `/teacher/attendance/update-all`,
        payload
      );
      set({ loading: false });
      return data;
    } catch (err) {
      handleError(err, "Update for all students failed", set);
    }
  },

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
      set({ scheduleAttendance: data?.data || {}, loading: false });
    } catch (err) {
      handleError(err, "Unable to fetch attendance history", set);
    }
  },

  fetchStudentAttendanceHistory: async () => {
    set({ loading: true, error: null });

    const filters = get().getCurrentFilters();
    const studentId = getItem("studentId", false);
    const scheduleId = getItem("scheduleId", false);
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
            academic_year_id: filters.academicYearId,
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

    if (!filters.sectionId) {
      set({ error: "Missing section ID", loading: false });
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
