import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getGrades, updateGrade } from "../api/grades";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

export const useGradesStore = create(
  devtools((set, get) => ({
    students: [],
    selectedQuarter: "All Quarters",
    currentPage: 1,
    loading: false,
    error: null,

    fetchGrades: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getGrades();
        if (!Array.isArray(data)) throw new Error("Invalid grades format");
        set({ students: data, loading: false });
        toast.success("Grades loaded");
      } catch (err) {
        console.error("Grades fetch failed:", err);
        set({ error: "Failed to fetch grades", loading: false });
        toast.error("Failed to fetch grades");
      }
    },

    updateGrade: async (id, field, value) => {
      const updated = get().students.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]:
                field === "name" ? value : value === "" ? "" : Number(value),
            }
          : student
      );
      set({ students: updated });

      try {
        await updateGrade(id, field, value);
        toast.success("Grade updated");
      } catch (err) {
        console.error("Failed to update grade:", err);
        toast.error("Failed to update grade");
      }
    },

    setSelectedQuarter: (quarter) => set({ selectedQuarter: quarter }),
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
