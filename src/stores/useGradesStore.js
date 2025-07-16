import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { studentsData } from "../constants";

const RECORDS_PER_PAGE = 5;

export const useGradesStore = create(
  devtools((set, get) => ({
    students: studentsData,
    selectedQuarter: "All Quarters",
    currentPage: 1,
    loading: false,
    error: null,

    // fetchStudents: async () => {
    //   try {
    //     set({ loading: true, error: null });
    //     const response = await axios.get("/api/grades");
    //     set({ students: response.data, loading: false });
    //   } catch (err) {
    //     set({ error: "Failed to fetch grades", loading: false });
    //   }
    // },

    updateGrade: (id, field, value) => {
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

      // axios.put(`/api/grades/${id}`, { field, value });
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
