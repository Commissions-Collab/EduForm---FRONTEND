import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { studentsData } from "../constants";

const RECORDS_PER_PAGE = 5;

export const usePromotionStore = create(
  devtools((set, get) => ({
    students: studentsData,
    currentPage: 1,
    loading: false,
    error: null,

    // fetchPromotionData: async () => {
    //   try {
    //     set({ loading: true, error: null });
    //     const response = await axios.get("/api/promotions");
    //     set({ students: response.data, loading: false });
    //   } catch (err) {
    //     set({ error: "Failed to fetch promotion data", loading: false });
    //   }
    // },

    setCurrentPage: (page) => set({ currentPage: page }),

    totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

    paginatedRecords: () => {
      const { currentPage, students } = get();
      const indexOfLast = currentPage * RECORDS_PER_PAGE;
      const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
      return students.slice(indexOfFirst, indexOfLast);
    },
  }))
);
