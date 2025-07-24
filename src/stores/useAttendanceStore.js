import { create } from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";
import {
  updateAttendanceReason,
  updateAttendanceStatus,
} from "../api/attendance";

export const useAttendanceStore = create(
  devtools((set, get) => ({
    records: [],
    loading: false,
    error: null,

    fetchAttendanceData: async () => {
      set({ loading: true, error: null });
      try {
        const data = [
          { id: 1, name: "Juan Dela Cruz", status: "Present", reason: "" },
          { id: 2, name: "Maria Clara", status: "Absent", reason: "Sick" },
          { id: 3, name: "Jose Rizal", status: "Late", reason: "Traffic" },
          { id: 4, name: "Gregorio Del Pilar", status: "Present", reason: "" },
        ];
        set({ records: data, loading: false });
      } catch (err) {
        set({ error: "Failed to fetch attendance", loading: false });
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
        await updateAttendanceStatus(id, status);
        toast.success("Status updated");
      } catch {
        toast.error("Failed to update status");
      }
    },

    setReason: async (id, reason) => {
      const updated = get().records.map((student) =>
        student.id === id ? { ...student, reason } : student
      );
      set({ records: updated });

      try {
        await updateAttendanceReason(id, reason);
        toast.success("Reason updated");
      } catch {
        toast.error("Failed to update reason");
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

    downloadAttendancePDF: async ({
      sectionId,
      quarterId,
      academicYearId,
      token,
    }) => {
      set({ loading: true, error: null });

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/attendance/pdf/${sectionId}?quarter_id=${quarterId}&academic_year_id=${academicYearId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/pdf",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to download PDF");
        }

        const blob = await response.blob();
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
        console.error("Error downloading PDF:", error);
      } finally {
        set({ loading: false });
      }
    },
  }))
);
