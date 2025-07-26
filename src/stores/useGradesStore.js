import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

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
      const sectionId = localStorage.getItem("sectionId");
      const academicYearId = localStorage.getItem("academicYearId");
      const quarterId = localStorage.getItem("quarterId");
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/api/teacher/sections/${sectionId}/grades`,
        {
          params: {
            quarter_id: quarterId,
            academic_year_id: academicYearId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.grades || response.data || [];
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
    const token = localStorage.getItem("token");

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
      await axios.patch(
        `http://127.0.0.1:8000/api/grades/${studentId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    const indexOfLast = currentPage * RECORDS_PER_PAGE;
    const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
    return students.slice(indexOfFirst, indexOfLast);
  },
}));
