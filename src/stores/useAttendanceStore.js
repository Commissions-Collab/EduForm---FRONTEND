import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getAttendanceRecords,
  updateAttendanceStatus,
  updateAttendanceReason,
} from "../api/attendance";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

export const useAttendanceStore = create(
  devtools((set, get) => ({
    records: [],
    currentPage: 1,
    loading: false,
    error: null,

    fetchAttendanceData: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getAttendanceRecords();
        if (!Array.isArray(data)) throw new Error("Invalid attendance format");
        set({ records: data, loading: false });
        toast.success("Attendance loaded");
      } catch (err) {
        console.error("Fetch error:", err);
        set({
          error: "Failed to fetch attendance",
          loading: false,
          records: [],
        });
        toast.error("Failed to fetch attendance");
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
      } catch (err) {
        console.error("Status update failed:", err);
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
      } catch (err) {
        console.error("Reason update failed:", err);
        toast.error("Failed to update reason");
      }
    },

    attendanceSummary: () => {
      const { records } = get();
      const validRecords = Array.isArray(records) ? records : [];
      const total = validRecords.length || 1;

      const countByStatus = {
        present: validRecords.filter((r) => r.status === "Present").length,
        absent: validRecords.filter((r) => r.status === "Absent").length,
        late: validRecords.filter((r) => r.status === "Late").length,
      };

      return {
        present: {
          count: countByStatus.present,
          percent: ((countByStatus.present / total) * 100).toFixed(0),
        },
        absent: {
          count: countByStatus.absent,
          percent: ((countByStatus.absent / total) * 100).toFixed(0),
        },
        late: {
          count: countByStatus.late,
          percent: ((countByStatus.late / total) * 100).toFixed(0),
        },
      };
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    totalPages: () => Math.ceil(get().records.length / RECORDS_PER_PAGE),

    paginatedRecords: () => {
      const { currentPage, records } = get();
      const indexOfLast = currentPage * RECORDS_PER_PAGE;
      const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
      return records.slice(indexOfFirst, indexOfLast);
    },
  }))
);
