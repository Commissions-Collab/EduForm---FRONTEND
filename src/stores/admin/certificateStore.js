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
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch certificates", set);
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
