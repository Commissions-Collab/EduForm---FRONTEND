import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  console.error(defaultMessage, err);
  toast.error(message);
  return message;
};

const useWorkloadsStore = create((set, get) => ({
  workloads: [],
  workloadSummary: null,
  quarterComparison: [],
  availableQuarters: [],
  currentQuarter: null,
  currentAcademicYear: null,
  currentPage: 1,
  loading: false,
  error: null,

  fetchWorkloads: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get("/teacher/workload");

      set({
        workloads: Array.isArray(data?.data?.teaching_load_details)
          ? data.data.teaching_load_details
          : [],
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
    } catch (err) {
      handleError(err, "Failed to fetch workload data", set);
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () => Math.ceil(get().workloads.length / RECORDS_PER_PAGE),

  paginatedRecords: () =>
    paginate(get().workloads, get().currentPage, RECORDS_PER_PAGE),

  resetWorkloadsStore: () => {
    set({
      workloads: [],
      workloadSummary: null,
      quarterComparison: [],
      availableQuarters: [],
      currentQuarter: null,
      currentAcademicYear: null,
      currentPage: 1,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useWorkloadsStore.getState().resetWorkloadsStore();
});

export default useWorkloadsStore;
