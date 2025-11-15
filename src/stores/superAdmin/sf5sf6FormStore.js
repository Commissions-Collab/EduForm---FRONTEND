import { create } from "zustand";

import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    errorMessage =
      err.response.data?.message ||
      err.response.data?.error ||
      `Server Error: ${err.response.status}`;
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  console.error(defaultMessage, {
    status: err.response?.status,
    data: err.response?.data,
    message: err.message,
  });

  set({ error: errorMessage, loading: false });
  toast.error(errorMessage);
  return errorMessage;
};

const useSF5SF6FormStore = create((set, get) => ({
  // State
  formStudents: [],
  currentPage: 1,
  overallFormStats: null,
  isFormAccessible: false,
  formMessage: null,
  formWarning: null,
  filterOptions: {
    academic_years: [],
    sections_by_year: [],
  },
  loading: false,
  filterLoading: false,
  error: null,

  // Fetch filter options
  fetchFilterOptions: async () => {
    set({ filterLoading: true, error: null });

    try {
      const { data, status } = await axiosInstance.get(
        "/admin/forms/sf5-sf6/filter-options",
        { timeout: 10000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        filterOptions: {
          academic_years: data.academic_years || [],
          sections_by_year: data.sections_by_year || [],
        },
        filterLoading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch filter options", set);
    }
  },

  // Fetch form statistics
  fetchFormStatistics: async (academicYearId, sectionId, formType) => {
    set({ loading: true, error: null, formWarning: null });

    try {
      if (!academicYearId || !sectionId || !formType) {
        const message = "Please select Academic Year, Section, and Form Type";
        set({
          error: message,
          formMessage: { title: "Missing Filters", content: message },
          loading: false,
        });
        toast.error(message);
        return;
      }

      const { data, status } = await axiosInstance.get(
        "/admin/forms/sf5-sf6/statistics",
        {
          params: {
            academic_year_id: Number(academicYearId),
            section_id: Number(sectionId),
            form_type: formType,
          },
          timeout: 10000,
        }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      const isAccessible = data?.accessible !== false;
      const hasStudents =
        Array.isArray(data?.students) && data.students.length > 0;

      if (!isAccessible || (!hasStudents && !data?.overall_statistics)) {
        const warningMessage = {
          type: "incomplete",
          title: "Section Not Ready",
          content:
            data?.message ||
            "This section has incomplete grades. Please ensure all grades are finalized.",
          details:
            "Promotion data may not be accessible due to incomplete grades or missing records.",
        };

        set({
          formWarning: warningMessage,
          isFormAccessible: false,
          formMessage: null,
          loading: false,
        });
        return;
      }

      const transformedStudents = (data?.students || []).map((student) => ({
        student_id: String(student.student_id || student.id || ""),
        student_name: String(student.student_name || student.name || "Unknown"),
        final_average: Number(student.final_average || 0),
        attendance_percentage: Number(student.attendance_percentage || 0),
        honor_classification: String(student.honor_classification || "None"),
        promotion_status: String(student.promotion_status || "Pending"),
        has_discrepancy: Boolean(student.has_discrepancy),
        grades_complete: Boolean(student.grades_complete),
      }));

      set({
        formStudents: transformedStudents,
        overallFormStats: data.overall_statistics || null,
        isFormAccessible: true,
        formMessage: null,
        formWarning: null,
        loading: false,
      });
    } catch (err) {
      if (err.response?.status === 403) {
        const warningMessage = {
          type: "incomplete",
          title: "Section Not Ready for Forms",
          content:
            err.response?.data?.message ||
            "This section is not ready for SF5 generation.",
        };

        set({
          formWarning: warningMessage,
          isFormAccessible: false,
          formMessage: null,
          loading: false,
          error: null,
        });
        return;
      }

      handleError(err, "Failed to fetch form statistics", set);
    }
  },

  // Export form as PDF
  exportFormPDF: async (academicYearId, sectionId, formType) => {
    set({ loading: true });

    try {
      const { data, status } = await axiosInstance.post(
        "/admin/forms/sf5-sf6/export-pdf",
        {
          academic_year_id: Number(academicYearId),
          section_id: Number(sectionId),
          form_type: formType,
        },
        { timeout: 15000 }
      );

      if (status !== 200) {
        throw new Error(data?.message || "Export failed");
      }

      set({ loading: false });
      toast.success("PDF exported successfully");
      return data;
    } catch (err) {
      handleError(err, "PDF export failed", set);
      return null;
    }
  },

  // Set current page
  setCurrentPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      console.error("Failed to set current page:", error.message);
      toast.error("Invalid page number");
    }
  },

  // Get paginated records
  getPaginatedRecords: () => {
    const { formStudents, currentPage } = get();
    const recordsPerPage = 10;
    const start = (currentPage - 1) * recordsPerPage;
    return formStudents.slice(start, start + recordsPerPage);
  },

  // Get total pages
  getTotalPages: () => {
    const { formStudents } = get();
    return Math.ceil(formStudents.length / 10);
  },

  // Reset store
  resetFormStore: () => {
    set({
      formStudents: [],
      currentPage: 1,
      overallFormStats: null,
      isFormAccessible: false,
      formMessage: null,
      formWarning: null,
      loading: false,
      error: null,
    });
  },
}));

export default useSF5SF6FormStore;
