import { create } from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

export const useWorkloadStore = create(
  devtools((set, get) => ({
    workloads: [],
    currentPage: 1,
    loading: false,
    error: null,

    fetchWorkloads: async () => {
      set({ loading: true, error: null });
      try {
        const data = [
          {
            section: "Grade 7 - Emerald",
            students: 38,
            subject: "Mathematics 7",
            advisory: true,
            hoursPerWeek: 6,
          },
          {
            section: "Grade 7 - Sapphire",
            students: 36,
            subject: "Mathematics 7",
            advisory: false,
            hoursPerWeek: 6,
          },
          {
            section: "Grade 8 - Topaz",
            students: 35,
            subject: "Science 8",
            advisory: false,
            hoursPerWeek: 6,
          },
          {
            section: "Grade 8 - Ruby",
            students: 33,
            subject: "English 8",
            advisory: true,
            hoursPerWeek: 6,
          },
          {
            section: "Grade 9 - Pearl",
            students: 32,
            subject: "Araling Panlipunan 9",
            advisory: false,
            hoursPerWeek: 5,
          },
        ];

        set({ workloads: data, loading: false });
        toast.success("Workload data loaded");
      } catch (err) {
        console.error("Workload fetch failed:", err);
        set({ error: "Failed to fetch workloads", loading: false });
        toast.error("Failed to fetch workloads");
      }
    },

    setCurrentPage: (page) => set({ currentPage: page }),

    totalPages: () => Math.ceil(get().workloads.length / RECORDS_PER_PAGE),

    paginatedRecords: () => {
      const { currentPage, workloads } = get();
      const indexOfLast = currentPage * RECORDS_PER_PAGE;
      const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
      return workloads.slice(indexOfFirst, indexOfLast);
    },
  }))
);
