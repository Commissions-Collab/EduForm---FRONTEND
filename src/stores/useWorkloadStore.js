import { create } from "zustand";
import toast from "react-hot-toast";
import { getWorkloads } from "../api/workload";
import { paginate } from "../utils/pagination";

const RECORDS_PER_PAGE = 5;

export const useWorkloadStore = create((set, get) => ({
  workloads: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchWorkloads: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getWorkloads();
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
    return paginate(workloads, currentPage, RECORDS_PER_PAGE);
  },
}));
