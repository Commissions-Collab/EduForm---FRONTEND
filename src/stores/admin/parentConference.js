import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { downloadPDF } from "../../lib/utils";
import toast from "react-hot-toast";

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  console.error(defaultMessage, err);
  toast.error(message);
  return message;
};

const useParentConferenceStore = create((set, get) => ({
  conferenceStudents: [],
  selectedConferenceStudent: null,
  conferenceSection: "",
  loading: false,
  error: null,

  fetchConferenceDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(
        "/teacher/parents-conference/dashboard"
      );

      const transformedStudents = (
        Array.isArray(data.students) ? data.students : []
      ).map((student) => ({
        id: student.studentId || student.id,
        name: student.student_name || student.name || "Unknown",
        guardian: student.guardian_name || student.guardian || "Not provided",
        status: student.status || "Good Standing",
      }));

      set({
        conferenceSection: data.section || "",
        conferenceStudents: transformedStudents,
        loading: false,
      });
    } catch (err) {
      if (err.response?.status === 403) {
        const message =
          err.response?.data?.message ||
          "Access denied. You may not be assigned as a section advisor for the current academic year.";
        set({ error: message, loading: false });
        toast.error(message);
      } else {
        handleError(err, "Failed to load parent conference data", set);
      }
    }
  },

  fetchConferenceStudentProfile: async (studentId) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(
        `/teacher/parents-conference/student-data/${studentId}`
      );

      const transformedStudent = {
        id: data.student.studentId || data.student.id,
        name: data.student.student_name || data.student.name || "Unknown",
        student_id: data.student.student_id || data.student.id,
        guardian:
          data.student.guardian_name || data.student.guardian || "Not provided",
        guardian_email: data.student.email || data.student.guardian_email || "",
        guardian_phone: data.student.phone || data.student.guardian_phone || "",
        grades: Array.isArray(data.student.grades)
          ? data.student.grades.map((grade) => ({
              subject: grade.subject || "Unknown",
              average_grade: grade.average_grade || grade.grade || 0,
            }))
          : [],
        attendance_summary: data.student.attendance_summary
          ? {
              present_percent:
                data.student.attendance_summary.present_percent || 0,
              absent_percent:
                data.student.attendance_summary.absent_percent || 0,
              late_percent: data.student.attendance_summary.late_percent || 0,
              recent_absents: Array.isArray(
                data.student.attendance_summary.recent_absents
              )
                ? data.student.attendance_summary.recent_absents.map(
                    (absence) => ({
                      attendance_date:
                        absence.date || absence.attendance_date || "",
                    })
                  )
                : [],
            }
          : null,
        bmi_records: Array.isArray(data.student.bmi_records)
          ? data.student.bmi_records.map((bmi) => ({
              quarter_id: bmi.quarter_id || bmi.quarter || 0,
              height_cm: bmi.height_cm || bmi.height || null,
              weight_kg: bmi.weight_kg || bmi.weight || null,
              bmi: bmi.bmi || null,
              bmi_category: bmi.bmi_category || bmi.category || "N/A",
            }))
          : [],
      };

      set({
        selectedConferenceStudent: transformedStudent,
        conferenceSection: data.section || "",
        loading: false,
      });
    } catch (err) {
      handleError(err, "Unable to load student profile", set);
    }
  },

  downloadStudentReportCard: async (studentId) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get(
        `/teacher/parents-conference/print-student-card/${studentId}`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
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
      const response = await axiosInstance.get(
        "/teacher/parents-conference/print-all-student-cards",
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      downloadPDF(blob, "All_Student_Report_Cards.pdf");

      set({ loading: false });
      toast.success("All report cards downloaded successfully!");
    } catch (err) {
      handleError(err, "Failed to download all report cards", set);
    }
  },

  resetParentConferenceStore: () => {
    set({
      conferenceStudents: [],
      selectedConferenceStudent: null,
      conferenceSection: "",
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useParentConferenceStore.getState().resetParentConferenceStore();
});

export default useParentConferenceStore;
