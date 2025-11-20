import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance, fetchCsrfToken } from "../../lib/axios";
import { paginate, downloadExcel } from "../../lib/utils";
import toast from "react-hot-toast";

// Configuration constants
const RECORDS_PER_PAGE = 10;

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    if (err.response.status === 403) {
      errorMessage = defaultMessage.includes("Bulk")
        ? "You don't have permission to edit one or more grades"
        : "You don't have permission to edit this grade";
    } else if (err.response.status === 422) {
      const errors = err.response.data.errors;
      errorMessage = Array.isArray(errors)
        ? `Some grades failed to update: ${errors
            .map((e) => e.error)
            .join(", ")}`
        : Object.values(errors).flat().join(", ");
    } else {
      errorMessage =
        err.response.data?.message ||
        err.response.data?.error ||
        `Server Error: ${err.response.status}`;
    }
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(defaultMessage, {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
  }

  set({ error: errorMessage, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

/** @type {import('zustand').StoreApi<GradesState & GradesActions>} */
const useGradesStore = create((set, get) => ({
  students: [],
  subjects: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchGrades: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.academicYearId || !filters.quarterId || !filters.sectionId) {
        throw new Error("Missing required filter data");
      }

      const { data, status } = await axiosInstance.get(
        "/teacher/academic-records/students-grade",
        {
          params: {
            academic_year_id: Number(filters.academicYearId),
            quarter_id: Number(filters.quarterId),
            section_id: Number(filters.sectionId),
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

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
      // Validate inputs
      if (
        !Number.isInteger(Number(student_id)) ||
        !Number.isInteger(Number(subject_id)) ||
        !Number.isInteger(Number(quarter_id)) ||
        !Number.isInteger(Number(academic_year_id))
      ) {
        throw new Error("Invalid input parameters for grade update");
      }

      const processedGrade =
        grade === "" || grade === undefined || isNaN(Number(grade))
          ? null
          : Number(grade);

      const payload = {
        student_id: Number(student_id),
        subject_id: Number(subject_id),
        quarter_id: Number(quarter_id),
        academic_year_id: Number(academic_year_id),
        grade: processedGrade,
      };

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        "/teacher/academic-records/update-grade",
        payload,
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const gradeData = data.grade || data;

      const updatedStudents = get().students.map((student) => {
        if (student.id !== Number(student_id)) return student;

        const updatedGrades = student.grades.map((g) =>
          g.subject_id === Number(subject_id)
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
      const message = handleError(err, "Grade update failed", set);
      throw new Error(message);
    }
  },

  updateMultipleGrades: async (gradeUpdates) => {
    set({ loading: true, error: null });

    try {
      if (!Array.isArray(gradeUpdates) || !gradeUpdates.length) {
        throw new Error("Invalid or empty grade updates");
      }

      const processedGrades = gradeUpdates.map((update) => {
        if (
          !Number.isInteger(Number(update.student_id)) ||
          !Number.isInteger(Number(update.subject_id)) ||
          !Number.isInteger(Number(update.quarter_id)) ||
          !Number.isInteger(Number(update.academic_year_id))
        ) {
          throw new Error("Invalid input parameters in grade updates");
        }

        return {
          student_id: Number(update.student_id),
          subject_id: Number(update.subject_id),
          quarter_id: Number(update.quarter_id),
          academic_year_id: Number(update.academic_year_id),
          grade:
            update.grade === "" ||
            update.grade === undefined ||
            isNaN(Number(update.grade))
              ? null
              : Number(update.grade),
        };
      });

      const payload = { grades: processedGrades };

      await fetchCsrfToken();
      const { data, status } = await axiosInstance.put(
        "/teacher/academic-records/update-grade",
        payload,
        { timeout: 15000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const updatedStudents = get().students.map((student) => {
        const studentGradeUpdates = gradeUpdates.filter(
          (u) => Number(u.student_id) === Number(student.id)
        );
        if (!studentGradeUpdates.length) return student;

        const updatedGrades = student.grades.map((g) => {
          const gradeUpdate = studentGradeUpdates.find(
            (u) => Number(u.subject_id) === Number(g.subject_id)
          );
          if (!gradeUpdate) return g;

          const updatedGrade = data.grades?.find(
            (gd) =>
              Number(gd.student_id) === Number(student.id) &&
              Number(gd.subject_id) === Number(g.subject_id)
          );

          return {
            ...g,
            grade: updatedGrade?.grade ?? gradeUpdate.grade,
            grade_id: updatedGrade?.id ?? null,
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
      const message = handleError(err, "Bulk grade update failed", set);
      throw new Error(message);
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.academicYearId || !filters.quarterId || !filters.sectionId) {
        throw new Error("Missing required filter data");
      }

      const { data, status } = await axiosInstance.get(
        "/teacher/academic-records/statistics",
        {
          params: {
            academic_year_id: Number(filters.academicYearId),
            quarter_id: Number(filters.quarterId),
            section_id: Number(filters.sectionId),
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({ loading: false });
      return data.data || data;
    } catch (err) {
      handleError(err, "Unable to fetch grade statistics", set);
      return null;
    }
  },

  totalPages: () => {
    try {
      return Math.ceil(get().students.length / RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to calculate total pages:", {
          error: error.message,
        });
      }
      return 0;
    }
  },

  paginatedGradeRecords: () => {
    try {
      return paginate(get().students, get().currentPage, RECORDS_PER_PAGE);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get paginated records:", {
          error: error.message,
        });
      }
      return [];
    }
  },

  setPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to set page:", { error: error.message, page });
      }
      toast.error("Invalid page number");
    }
  },

  resetGradesStore: () => {
    try {
      set({
        students: [],
        subjects: [],
        currentPage: 1,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to reset grades store:", {
          error: error.message,
        });
      }
      toast.error("Failed to reset grades data");
    }
  },

  /**
   * Export SF9 Excel - Learner's Progress Report Card
   */
  exportSF9Excel: async () => {
    set({ loading: true, error: null });
    try {
      const filters = useFilterStore.getState().globalFilters;

      if (!filters.sectionId || !filters.academicYearId || !filters.quarterId) {
        throw new Error("Section, Academic Year, and Quarter must be selected");
      }

      const response = await axiosInstance.get(
        `/teacher/academic-records/export-sf9-excel`,
        {
          responseType: "blob",
          params: {
            section_id: filters.sectionId,
            academic_year_id: filters.academicYearId,
            quarter_id: filters.quarterId,
          },
          headers: { Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
          timeout: 30000,
        }
      );

      if (response.status !== 200) {
        throw new Error("Invalid Excel response from server");
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'SF9_Academic_Records.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      downloadExcel(blob, fileName);
      set({ loading: false });
      toast.success("SF9 Excel file downloaded successfully");
    } catch (err) {
      handleError(err, "SF9 Excel export failed", set);
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useGradesStore.getState().resetGradesStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useGradesStore;
