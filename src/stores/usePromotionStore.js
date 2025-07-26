// src/stores/usePromotionStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { getPromotions } from "../api/promotion";
import { paginate } from "../utils/pagination";

const RECORDS_PER_PAGE = 5;

export const usePromotionStore = create((set, get) => ({
  students: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getPromotions();
      if (!Array.isArray(data)) throw new Error("Invalid promotions format");

      set({ students: data, loading: false });
      toast.success("Promotions loaded");
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "Failed to fetch promotions", loading: false });
      toast.error("Failed to fetch promotions");
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedRecords: () => {
    const { students, currentPage } = get();
    return paginate(students, currentPage, RECORDS_PER_PAGE);
  },
}));
