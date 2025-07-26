import { create } from "zustand";
import toast from "react-hot-toast";

import {
  fetchAttendance,
  updateAttendanceStatus,
  updateAttendanceReason,
  downloadAttendancePDF,
} from "../api/attendance";
import { getItem } from "../utils/storage";

export const useAttendanceStore = create((set, get) => ({
  records: [],
  loading: false,
  error: null,

  fetchAttendanceData: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);

      const data = await fetchAttendance(sectionId, quarterId, academicYearId);
      set({ records: data });
      toast.success("Attendance loaded");
    } catch (error) {
      console.error("Fetch failed:", error);
      set({ error: "Failed to fetch attendance" });
      toast.error("Failed to fetch attendance");
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

  downloadAttendancePDF: async () => {
    set({ loading: true, error: null });

    try {
      const sectionId = getItem("sectionId", false);
      const academicYearId = getItem("academicYearId", false);
      const quarterId = getItem("quarterId", false);

      const blobData = await downloadAttendancePDF(
        sectionId,
        quarterId,
        academicYearId
      );

      const blob = new Blob([blobData], { type: "application/pdf" });
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
      toast.error("Download failed");
    } finally {
      set({ loading: false });
    }
  },
}));
