import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  getAttendanceCertificates,
  getHonorCertificates,
} from "../api/certificates";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 5;

// 🟦 Mock data: Attendance Certificates
const mockAttendanceCertificates = [
  {
    id: 1,
    studentName: "Juan Dela Cruz",
    certificateType: "Perfect Attendance",
    quarter: "Quarter 1",
  },
  {
    id: 2,
    studentName: "Maria Santos",
    certificateType: "Perfect Attendance",
    quarter: "Quarter 2",
  },
  {
    id: 3,
    studentName: "Jose Rizal",
    certificateType: "Perfect Attendance",
    quarter: "Quarter 3",
  },
];

// 🟨 Mock data: Honor Certificates
const mockHonorCertificates = [
  {
    id: 1,
    studentName: "Andres Bonifacio",
    honorType: "With Honors",
    gradeAverage: "91.25",
  },
  {
    id: 2,
    studentName: "Gabriela Silang",
    honorType: "With High Honors",
    gradeAverage: "94.50",
  },
];

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
        // 🧪 Use mock data (replace with real API calls if needed)
        // const [attendanceData, honorData] = await Promise.all([
        //   getAttendanceCertificates(),
        //   getHonorCertificates(),
        // ]);

        const attendanceData = mockAttendanceCertificates;
        const honorData = mockHonorCertificates;

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
