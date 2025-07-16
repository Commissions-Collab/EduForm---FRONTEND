import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { studentsData } from "../constants";

const RECORDS_PER_PAGE = 5;

export const useAttendanceStore = create(
  devtools((set, get) => ({
    records: studentsData,
    currentPage: 1,
    loading: false,
    error: null,

    // fetchAttendanceData: async () => {
    //   try {
    //     set({ loading: true, error: null });
    //     const response = await axios.get("/api/attendance");
    //     if (!Array.isArray(response.data)) {
    //       throw new Error("Invalid data format");
    //     }
    //     set({ records: response.data, loading: false });
    //   } catch (err) {
    //     console.error("Fetch error:", err);
    //     set({ error: "Failed to fetch attendance", loading: false, records: [] });
    //   }
    // },

    setStatus: (id, status) => {
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

      // axios.put(`/api/attendance/${id}`, { status });
    },

    setReason: (id, reason) => {
      const updated = get().records.map((student) =>
        student.id === id ? { ...student, reason } : student
      );
      set({ records: updated });

      // axios.put(`/api/attendance/${id}`, { reason });
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
