import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance } from "../../lib/axios";
import { paginate } from "../../lib/utils";
import toast from "react-hot-toast";

// Configuration constants
const RECORDS_PER_PAGE = 10;

const useCertificatesStore = create((set, get) => ({
  attendanceCertificates: [],
  honorCertificates: [],
  quarterComplete: false,
  currentPage: 1,
  loading: false,
  error: null,

  fetchCertificateData: async () => {
    set({ loading: true, error: null });

    try {
      const filters = useFilterStore.getState().globalFilters;
      if (!filters.academicYearId || !filters.sectionId || !filters.quarterId) {
        throw new Error("Missing certificate filter data");
      }

      const { data, status } = await axiosInstance.get("/teacher/certificate", {
        params: {
          academic_year_id: filters.academicYearId,
          section_id: filters.sectionId,
          quarter_id: filters.quarterId,
        },
        timeout: 10000,
      });

      if (status !== 200) {
        throw new Error(data?.message || "Invalid response from server");
      }

      set({
        attendanceCertificates: Array.isArray(data.perfect_attendance)
          ? data.perfect_attendance
          : [],
        honorCertificates: Array.isArray(data.honor_roll)
          ? data.honor_roll
          : [],
        quarterComplete:
          typeof data.quarter_complete === "boolean"
            ? data.quarter_complete
            : false,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch certificates", set);
    }
  },

  previewCertificate: async (type, studentId, quarterId = null) => {
    try {
      if (
        typeof type !== "string" ||
        !type.trim() ||
        typeof studentId !== "string" ||
        !studentId.trim()
      ) {
        throw new Error("Invalid certificate type or student ID");
      }

      const urlPath = `/teacher/certificate/preview/${type}/${studentId}/${
        quarterId || ""
      }`;
      const { data, status, headers } = await axiosInstance.get(urlPath, {
        responseType: "blob",
        timeout: 15000,
      });

      if (status !== 200 || headers["content-type"] !== "application/pdf") {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 1000); // Increased timeout for reliability
    } catch (err) {
      const message = handleError(err, "Failed to preview certificate", set);
      throw new Error(message);
    }
  },

  downloadCertificate: async (type, studentId, quarterId = null) => {
    try {
      if (
        typeof type !== "string" ||
        !type.trim() ||
        typeof studentId !== "string" ||
        !studentId.trim()
      ) {
        throw new Error("Invalid certificate type or student ID");
      }

      const urlPath = `/teacher/certificate/download/${type}/${studentId}/${
        quarterId || ""
      }`;
      const { data, status, headers } = await axiosInstance.get(urlPath, {
        responseType: "blob",
        timeout: 15000,
      });

      if (status !== 200 || headers["content-type"] !== "application/pdf") {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${type}-${studentId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 1000); // Increased timeout for reliability

      toast.success("Certificate downloaded successfully");
    } catch (err) {
      const message = handleError(err, "Failed to download certificate", set);
      throw new Error(message);
    }
  },

  printAllCertificates: async (type) => {
    try {
      if (typeof type !== "string" || !type.trim()) {
        throw new Error("Invalid certificate type");
      }

      const filters = useFilterStore.getState().globalFilters;
      if (!filters.academicYearId || !filters.sectionId || !filters.quarterId) {
        throw new Error("Missing required filters for printing certificates");
      }

      const { data, status, headers } = await axiosInstance.post(
        "/teacher/certificate/print-all",
        {
          academic_year_id: filters.academicYearId,
          section_id: filters.sectionId,
          quarter_id: filters.quarterId,
          type,
        },
        {
          responseType: "blob",
          timeout: 20000, // Increased timeout for bulk operation
        }
      );

      if (status !== 200 || headers["content-type"] !== "application/pdf") {
        throw new Error("Invalid PDF response from server");
      }

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `all_${type}_certificates.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 1000); // Increased timeout for reliability

      toast.success("All certificates downloaded successfully");
    } catch (err) {
      const message = handleError(err, "Failed to print all certificates", set);
      throw new Error(message);
    }
  },

  setCurrentPage: (page) => {
    try {
      if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
      }
      set({ currentPage: page });
    } catch (error) {
      console.error("Failed to set current page:", {
        error: error.message,
        page,
      });
      toast.error("Invalid page number");
    }
  },

  totalPages: (type) => {
    try {
      if (type !== "attendance" && type !== "honor") {
        throw new Error("Invalid certificate type");
      }
      const certificates =
        type === "attendance"
          ? get().attendanceCertificates
          : get().honorCertificates;
      return Math.ceil(certificates.length / RECORDS_PER_PAGE);
    } catch (error) {
      console.error("Failed to calculate total pages:", {
        error: error.message,
        type,
      });
      return 0;
    }
  },

  paginatedRecords: (type) => {
    try {
      if (type !== "attendance" && type !== "honor") {
        throw new Error("Invalid certificate type");
      }
      const certificates =
        type === "attendance"
          ? get().attendanceCertificates
          : get().honorCertificates;
      return paginate(certificates, get().currentPage, RECORDS_PER_PAGE);
    } catch (error) {
      console.error("Failed to get paginated records:", {
        error: error.message,
        type,
      });
      return [];
    }
  },

  resetCertificatesStore: () => {
    try {
      set({
        attendanceCertificates: [],
        honorCertificates: [],
        quarterComplete: false,
        currentPage: 1,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to reset certificates store:", {
        error: error.message,
      });
      toast.error("Failed to reset certificate data");
    }
  },
}));

// Centralized unauthorized event handler
const handleUnauthorized = () => {
  useCertificatesStore.getState().resetCertificatesStore();
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useCertificatesStore;
