import { create } from "zustand";
import { devtools } from "zustand/middleware";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

export const useTextbookStore = create(
  devtools((set, get) => ({
    textbooks: [],
    currentPage: 1,
    loading: false,
    error: null,

    fetchTextbooks: async () => {
      set({ loading: true, error: null });
      try {
        const data = [
          {
            id: 1,
            title: "General Mathematics",
            subject: "Math",
            total: 30,
            issued: 22,
            overdue: 3,
            available: 5,
          },
          {
            id: 2,
            title: "Earth & Life Science",
            subject: "Science",
            total: 25,
            issued: 20,
            overdue: 1,
            available: 4,
          },
          {
            id: 3,
            title: "English for Academic Purposes",
            subject: "English",
            total: 40,
            issued: 35,
            overdue: 2,
            available: 3,
          },
          {
            id: 4,
            title: "Understanding Culture, Society and Politics",
            subject: "Social Science",
            total: 20,
            issued: 18,
            overdue: 0,
            available: 2,
          },
          {
            id: 5,
            title: "Filipino sa Piling Larang",
            subject: "Filipino",
            total: 28,
            issued: 25,
            overdue: 2,
            available: 1,
          },
        ];

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
      const indexOfLast = currentPage * RECORDS_PER_PAGE;
      const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
      return textbooks.slice(indexOfFirst, indexOfLast);
    },
  }))
);
