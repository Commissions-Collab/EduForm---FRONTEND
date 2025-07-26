import { create } from "zustand";
import toast from "react-hot-toast";
import {
  getAttendanceCertificates,
  getHonorCertificates,
} from "../api/certificates";
import { paginate } from "../utils/pagination";

const RECORDS_PER_PAGE = 5;

export const useCertificateStore = create((set, get) => ({
  attendanceCertificates: [],
  honorCertificates: [],
  currentPage: 1,
  loading: false,
  error: null,

  fetchCertificateData: async () => {
    set({ loading: true, error: null });

    try {
      const [attendanceData, honorData] = await Promise.all([
        getAttendanceCertificates(),
        getHonorCertificates(),
      ]);

      set({
        attendanceCertificates: attendanceData,
        honorCertificates: honorData,
        loading: false,
      });

      toast.success("Certificates loaded");
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "Failed to fetch certificates", loading: false });
      toast.error("Failed to fetch certificates");
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
    const { currentPage } = get();
    const certificates =
      type === "attendance"
        ? get().attendanceCertificates
        : get().honorCertificates;

    return paginate(certificates, currentPage, RECORDS_PER_PAGE);
  },
}));
