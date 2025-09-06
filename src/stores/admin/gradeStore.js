import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  const message = err?.response?.data?.message || defaultMessage;
  set({ error: message, loading: false });
  console.error(defaultMessage, err);
  toast.error(message);
  return message;
};

const useGradesStore = create((set, get) => ({
  students: [],
  subjects: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchGrades: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.academicYearId || !filters.quarterId || !filters.sectionId) {
      const message = "Missing required filter data";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/students-grade",
        {
          params: {
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
            section_id: filters.sectionId,
          },
        }
      );

      const responseData = data.data || data;
      set({
        students: Array.isArray(responseData.students)
          ? responseData.students
          : [],
        subjects: Array.isArray(responseData.subjects)
          ? responseData.subjects
          : [],
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch grades", set);
    }
  },

  updateGrade: async ({
    student_id,
    subject_id,
    quarter_id,
    academic_year_id,
    grade,
  }) => {
    set({ loading: true, error: null });
    try {
      const processedGrade =
        grade === "" || grade === undefined ? null : Number(grade);

      const payload = {
        student_id: Number(student_id),
        subject_id: Number(subject_id),
        quarter_id: Number(quarter_id),
        academic_year_id: Number(academic_year_id),
        grade: processedGrade,
      };

      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        "/teacher/academic-records/update-grade",
        payload
      );

      const gradeData = data.grade || data;

      const updatedStudents = get().students.map((student) => {
        if (student.id !== student_id) return student;

        const updatedGrades = student.grades.map((g) =>
          g.subject_id === subject_id
            ? { ...g, grade: gradeData.grade, grade_id: gradeData.id }
            : g
        );

        const filledGrades = updatedGrades.filter((g) => g.grade != null);
        const allSubjectsFilled = filledGrades.length === updatedGrades.length;
        let status = "Incomplete";

        if (allSubjectsFilled && filledGrades.length > 0) {
          const average =
            filledGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
            filledGrades.length;
          status = average >= 75 ? "Passing" : "Failing";
        }

        return {
          ...student,
          grades: updatedGrades,
          status,
          all_subjects_filled: allSubjectsFilled,
        };
      });

      set({ students: updatedStudents, loading: false });
      toast.success("Grade updated successfully");
      return gradeData;
    } catch (err) {
      if (err.response?.status === 403) {
        const message = "You don't have permission to edit this grade";
        set({ error: message, loading: false });
        toast.error(message);
        throw new Error(message);
      } else if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        const errorMessage = Object.values(validationErrors).flat().join(", ");
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      handleError(err, "Grade update failed", set);
      throw err;
    }
  },

  updateMultipleGrades: async (gradeUpdates) => {
    set({ loading: true, error: null });
    try {
      const processedGrades = gradeUpdates.map((update) => ({
        student_id: Number(update.student_id),
        subject_id: Number(update.subject_id),
        quarter_id: Number(update.quarter_id),
        academic_year_id: Number(update.academic_year_id),
        grade:
          update.grade === "" || update.grade === undefined
            ? null
            : Number(update.grade),
      }));

      const payload = { grades: processedGrades };

      await fetchCsrfToken();
      const { data } = await axiosInstance.put(
        "/teacher/academic-records/update-grade",
        payload
      );

      const updatedStudents = get().students.map((student) => {
        const studentGradeUpdates = gradeUpdates.filter(
          (u) => u.student_id === student.id
        );
        if (!studentGradeUpdates.length) return student;

        const updatedGrades = student.grades.map((g) => {
          const gradeUpdate = studentGradeUpdates.find(
            (u) => u.subject_id === g.subject_id
          );
          if (!gradeUpdate) return g;

          const updatedGrade = data.grades?.find(
            (gd) =>
              gd.student_id === student.id && gd.subject_id === g.subject_id
          );

          return {
            ...g,
            grade: updatedGrade?.grade || gradeUpdate.grade,
            grade_id: updatedGrade?.id || null,
          };
        });

        const filledGrades = updatedGrades.filter((g) => g.grade != null);
        const allSubjectsFilled = filledGrades.length === updatedGrades.length;
        let status = "Incomplete";

        if (allSubjectsFilled && filledGrades.length > 0) {
          const average =
            filledGrades.reduce((sum, g) => sum + Number(g.grade), 0) /
            filledGrades.length;
          status = average >= 75 ? "Passing" : "Failing";
        }

        return {
          ...student,
          grades: updatedGrades,
          status,
          all_subjects_filled: allSubjectsFilled,
        };
      });

      set({ students: updatedStudents, loading: false });
      toast.success("Grades updated successfully");
      return data;
    } catch (err) {
      if (err.response?.status === 403) {
        const message = "You don't have permission to edit one or more grades";
        set({ error: message, loading: false });
        toast.error(message);
        throw new Error(message);
      } else if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        let errorMessage;
        if (Array.isArray(errors)) {
          errorMessage = `Some grades failed to update: ${errors
            .map((e) => e.error)
            .join(", ")}`;
        } else {
          errorMessage = Object.values(errors).flat().join(", ");
        }
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      handleError(err, "Bulk grade update failed", set);
      throw err;
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.academicYearId || !filters.quarterId || !filters.sectionId) {
      const message = "Missing required filter data";
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/academic-records/statistics",
        {
          params: {
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
            section_id: filters.sectionId,
          },
        }
      );
      set({ loading: false });
      return data.data || data;
    } catch (err) {
      handleError(err, "Unable to fetch grade statistics", set);
      return null;
    }
  },

  totalPages: () => Math.ceil(get().students.length / RECORDS_PER_PAGE),

  paginatedGradeRecords: () =>
    paginate(get().students, get().currentPage, RECORDS_PER_PAGE),

  setPage: (page) => set({ currentPage: page }),

  resetGradesStore: () => {
    set({
      students: [],
      subjects: [],
      currentPage: 1,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useGradesStore.getState().resetGradesStore();
});

export default useGradesStore;
