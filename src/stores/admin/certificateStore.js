import { create } from "zustand";
import useFilterStore from "./filterStore";
import { axiosInstance } from "../../lib/axios";
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

const useCertificatesStore = create((set, get) => ({
  attendanceCertificates: [],
  honorCertificates: [],
  quarterComplete: false,
  currentPage: 1,
  loading: false,
  error: null,

  fetchCertificateData: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.academicYearId || !filters.sectionId || !filters.quarterId) {
      const message = "Missing certificate filter data";
      set({ error: message, loading: false });
      toast.error(message);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/teacher/certificate", {
        params: {
          academic_year_id: filters.academicYearId,
          section_id: filters.sectionId,
          quarter_id: filters.quarterId,
        },
      });

      set({
        attendanceCertificates: data.perfect_attendance || [],
        honorCertificates: data.honor_roll || [],
        quarterComplete: data.quarter_complete || false,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch certificates", set);
    }
  },

  previewCertificate: async (type, studentId, quarterId = null) => {
    try {
      const response = await axiosInstance.get(`/teacher/certificate/preview/${type}/${studentId}/${quarterId || ''}`, {
        responseType: 'blob'
      });
      
      // Create blob URL and open in new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to preview certificate";
      toast.error(message);
    }
  },

  downloadCertificate: async (type, studentId, quarterId = null) => {
    try {
      const response = await axiosInstance.get(`/teacher/certificate/download/${type}/${studentId}/${quarterId || ''}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${type}-${studentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("Certificate downloaded successfully");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to download certificate";
      toast.error(message);
    }
  },

  printAllCertificates: async (type) => {
    const filters = useFilterStore.getState().globalFilters;
    
    try {
      const response = await axiosInstance.post('/teacher/certificate/print-all', {
        academic_year_id: filters.academicYearId,
        section_id: filters.sectionId,
        quarter_id: filters.quarterId,
        type: type
      }, {
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `all_${type}_certificates.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success("All certificates downloaded successfully");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to print all certificates";
      toast.error(message);
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: (type) => {
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return Math.ceil(certificates.length / RECORDS_PER_PAGE);
  },

  paginatedRecords: (type) => {
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;
    return paginate(certificates, get().currentPage, RECORDS_PER_PAGE);
  },

  resetCertificatesStore: () => {
    set({
      attendanceCertificates: [],
      honorCertificates: [],
      quarterComplete: false,
      currentPage: 1,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  useCertificatesStore.getState().resetCertificatesStore();
});

export default useCertificatesStore;