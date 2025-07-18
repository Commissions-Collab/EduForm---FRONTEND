import { create } from "zustand";
import { devtools } from "zustand/middleware";
// Replace with real API calls if available
import {
  getAttendanceCertificates,
  getHonorCertificates,
} from "../api/certificates";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

export const useCertificateStore = create(
  devtools((set, get) => ({
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

        if (!Array.isArray(attendanceData) || !Array.isArray(honorData)) {
          throw new Error("Invalid certificate data format");
        }

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

      const indexOfLast = currentPage * RECORDS_PER_PAGE;
      const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
      return certificates.slice(indexOfFirst, indexOfLast);
    },
  }))
);
