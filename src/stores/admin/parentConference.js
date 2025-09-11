import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { downloadPDF } from "../../lib/utils";
import toast from "react-hot-toast";

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    if (err.response.status === 403) {
      errorMessage =
        err.response.data?.message ||
        "Access denied. You may not be assigned as a section advisor for the current academic year.";
    } else {
      errorMessage =
        err.response.data?.message ||
        err.response.data?.error ||
        `Server Error: ${err.response.status}`;
    }
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

  set({ error: errorMessage, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

/** @type {import('zustand').StoreApi<ParentConferenceState & ParentConferenceActions>} */
const useParentConferenceStore = create((set, get) => ({
  conferenceStudents: [],
  selectedConferenceStudent: null,
  conferenceSection: "",
  loading: false,
  error: null,

  fetchConferenceDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get(
        "/teacher/parents-conference/dashboard",
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const transformedStudents = (
        Array.isArray(data.students) ? data.students : []
      ).map((student) => ({
        id: Number(student.studentId || student.id) || 0,
        name: String(student.student_name || student.name || "Unknown"),
        guardian: String(
          student.guardian_name || student.guardian || "Not provided"
        ),
        status: String(student.status || "Good Standing"),
      }));

      set({
        conferenceSection: String(data.section || ""),
        conferenceStudents: transformedStudents,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to load parent conference data", set);
    }
  },

  fetchConferenceStudentProfile: async (studentId) => {
    set({ loading: true, error: null });

    try {
      if (!Number.isInteger(Number(studentId))) {
        throw new Error("Invalid student ID");
      }

      const { data, status } = await axiosInstance.get(
        `/teacher/parents-conference/student-data/${studentId}`,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const transformedStudent = {
        id: Number(data.student.studentId || data.student.id) || 0,
        name: String(
          data.student.student_name || data.student.name || "Unknown"
        ),
        student_id: Number(data.student.student_id || data.student.id) || 0,
        guardian: String(
          data.student.guardian_name || data.student.guardian || "Not provided"
        ),
        guardian_email: String(
          data.student.email || data.student.guardian_email || ""
        ),
        guardian_phone: String(
          data.student.phone || data.student.guardian_phone || ""
        ),
        grades: Array.isArray(data.student.grades)
          ? data.student.grades.map((grade) => ({
              subject: String(grade.subject || "Unknown"),
              average_grade: Number(grade.average_grade || grade.grade || 0),
            }))
          : [],
        attendance_summary: data.student.attendance_summary
          ? {
              present_percent: Number(
                data.student.attendance_summary.present_percent || 0
              ),
              absent_percent: Number(
                data.student.attendance_summary.absent_percent || 0
              ),
              late_percent: Number(
                data.student.attendance_summary.late_percent || 0
              ),
              recent_absents: Array.isArray(
                data.student.attendance_summary.recent_absents
              )
                ? data.student.attendance_summary.recent_absents.map(
                    (absence) => ({
                      attendance_date: String(
                        absence.date || absence.attendance_date || ""
                      ),
                    })
                  )
                : [],
            }
          : null,
        bmi_records: Array.isArray(data.student.bmi_records)
          ? data.student.bmi_records.map((bmi) => ({
              quarter_id: Number(bmi.quarter_id || bmi.quarter || 0),
              height_cm: Number(bmi.height_cm || bmi.height) || null,
              weight_kg: Number(bmi.weight_kg || bmi.weight) || null,
              bmi: Number(bmi.bmi) || null,
              bmi_category: String(bmi.bmi_category || bmi.category || "N/A"),
            }))
          : [],
      };

      set({
        selectedConferenceStudent: transformedStudent,
        conferenceSection: String(data.section || ""),
        loading: false,
      });
    } catch (err) {
      handleError(err, "Unable to load student profile", set);
    }
  },

  downloadStudentReportCard: async (studentId) => {
    set({ loading: true, error: null });

    try {
      if (!Number.isInteger(Number(studentId))) {
        throw new Error("Invalid student ID");
      }

      await fetchCsrfToken();
      const { data, status, headers } = await axiosInstance.get(
        `/teacher/parents-conference/print-student-card/${studentId}`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
          timeout: 15000,
        }
      );

      if (status !== 200 || headers["content-type"] !== "application/pdf") {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([data], { type: "application/pdf" });
      downloadPDF(blob, `Student_Report_Card_${studentId}.pdf`);

      set({ loading: false });
      toast.success("Report card downloaded successfully!");
    } catch (err) {
      handleError(err, "Failed to download student report card", set);
    }
  },

  downloadAllStudentReportCards: async () => {
    set({ loading: true, error: null });

    try {
      await fetchCsrfToken();
      const { data, status, headers } = await axiosInstance.get(
        "/teacher/parents-conference/print-all-student-cards",
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
          timeout: 20000,
        }
      );

      if (status !== 200 || headers["content-type"] !== "application/pdf") {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([data], { type: "application/pdf" });
      downloadPDF(blob, "All_Student_Report_Cards.pdf");

      set({ loading: false });
      toast.success("All report cards downloaded successfully!");
    } catch (err) {
      handleError(err, "Failed to download all report cards", set);
    }
  },

  resetParentConferenceStore: () => {
    try {
      set({
        conferenceStudents: [],
        selectedConferenceStudent: null,
        conferenceSection: "",
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset parent conference store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset parent conference data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useParentConferenceStore.getState().resetParentConferenceStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useParentConferenceStore;
