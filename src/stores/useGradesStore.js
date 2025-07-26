// src/stores/useGradesStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import {
  fetchGrades as apiFetchGrades,
  updateGrade as apiUpdateGrade,
} from "../api/grades";
import { paginate } from "../utils/pagination"; // 👈 reusable helper

const RECORDS_PER_PAGE = 5;

export const useGradesStore = create((set, get) => ({
  students: [],
  selectedQuarter: "All Quarters",
  currentPage: 1,
  loading: false,
  error: null,

  fetchGrades: async () => {
    set({ loading: true, error: null });

    try {
      const data = await apiFetchGrades();
      set({ students: data });
      toast.success("Grades loaded");
    } catch (error) {
      console.error("Grades fetch failed:", error);
      set({ error: "Failed to fetch grades" });
      toast.error("Failed to fetch grades");
    } finally {
      set({ loading: false });
    }
  },

  updateGrade: async (studentId, field, value) => {
    const updatedStudents = get().students.map((student) =>
      student.id === studentId
        ? {
            ...student,
            [field]:
              field === "name" ? value : value === "" ? "" : Number(value),
          }
        : student
    );

    set({ students: updatedStudents });

    try {
      await apiUpdateGrade(studentId, field, value);
      toast.success("Grade updated");
    } catch (error) {
      console.error("Failed to update grade:", error);
      toast.error("Failed to update grade");
    }
  },

  setSelectedQuarter: (quarter) => set({ selectedQuarter: quarter }),
  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedRecords: () => {
    const { currentPage, students } = get();
    return paginate(students, currentPage, RECORDS_PER_PAGE);
  },
}));
