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

    // fetchGrades: async () => {
    //   set({ loading: true, error: null });
    //   try {
    //     const data = await getGrades();
    //     if (!Array.isArray(data)) throw new Error("Invalid grades format");
    //     set({ students: data, loading: false });
    //     toast.success("Grades loaded");
    //   } catch (err) {
    //     console.error("Grades fetch failed:", err);
    //     set({ error: "Failed to fetch grades", loading: false });
    //     toast.error("Failed to fetch grades");
    //   }
    // },

    fetchGrades: async () => {
      set({ loading: true, error: null });
      try {
        // 💡 Dummy grade data
        const data = [
          {
            id: 1,
            name: "Juan Dela Cruz",
            math: 89,
            science: 92,
            english: 85,
            filipino: 88,
            history: 90,
            attendance: [
              { date: "2025-07-01", status: "Present" },
              { date: "2025-07-02", status: "Present" },
              { date: "2025-07-03", status: "Absent" },
            ],
          },
          {
            id: 2,
            name: "Maria Clara",
            math: 91,
            science: 95,
            english: 90,
            filipino: 93,
            history: 94,
            attendance: [
              { date: "2025-07-01", status: "Present" },
              { date: "2025-07-02", status: "Present" },
              { date: "2025-07-03", status: "Present" },
            ],
          },
          {
            id: 3,
            name: "Jose Rizal",
            math: 76,
            science: 80,
            english: 79,
            filipino: 77,
            history: 74,
            attendance: [
              { date: "2025-07-01", status: "Late" },
              { date: "2025-07-02", status: "Absent" },
              { date: "2025-07-03", status: "Late" },
            ],
          },
        ];

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
