import { create } from "zustand";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const useStudentRequestsStore = create((set, get) => ({
  studentRequests: {
    approved: [],
    pending: [],
    rejected: [],
  },
  currentPage: 1,
  loading: false,
  error: null,

  fetchStudentRequests: async () => {
    set({ loading: true, error: null });

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
        loading: false,
      });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to fetch student requests";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  approveStudentRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      await axiosInstance.put(`/teacher/student-requests/${id}/approve`);
      await get().fetchStudentRequests();
      set({ loading: false });
      toast.success("Student request approved successfully!");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to approve student request";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  rejectStudentRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetchCsrfToken();
      await axiosInstance.put(`/teacher/student-requests/${id}/reject`);
      await get().fetchStudentRequests();
      set({ loading: false });
      toast.success("Student request rejected successfully!");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to reject student request";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () =>
    Math.ceil(get().studentRequests.pending.length / RECORDS_PER_PAGE),

  paginatedRecords: () =>
    paginate(
      get().studentRequests.pending,
      get().currentPage,
      RECORDS_PER_PAGE
    ),

  resetStudentRequestsStore: () => {
    set({
      studentRequests: {
        approved: [],
        pending: [],
        rejected: [],
      },
      currentPage: 1,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useStudentRequestsStore.getState().resetStudentRequestsStore();
});

export default useStudentRequestsStore;
