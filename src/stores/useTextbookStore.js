import { create } from "zustand";
import toast from "react-hot-toast";
import { getTextbooks } from "../api/textbook";
import { paginate } from "../utils/pagination";

const RECORDS_PER_PAGE = 5;

export const useTextbookStore = create((set, get) => ({
  textbooks: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchTextbooks: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTextbooks();
      set({ textbooks: data, loading: false });
      toast.success("Textbooks loaded");
    } catch (err) {
      console.error("Textbook fetch failed:", err);
      set({ error: "Failed to fetch textbooks", loading: false });
      toast.error("Failed to fetch textbooks");
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () => Math.ceil(get().textbooks.length / RECORDS_PER_PAGE),

  paginatedRecords: () => {
    const { currentPage, textbooks } = get();
    return paginate(textbooks, currentPage, RECORDS_PER_PAGE);
  },
}));
