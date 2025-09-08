import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useAchievementsStore = create((set) => ({
  certificates: {
    data: {
      certificate_count: 0,
      honor_roll_count: {
        with_honors: 0,
        with_high_honors: 0,
        with_highest_honors: 0,
      },
      attendance_awards_count: 0,
      academic_awards: [],
      attendance_awards: [],
    },
    isLoading: false,
    error: null,
  },
  downloaded: {}, // Track downloaded certificates
  fetchCertificates: async () => {
    set((state) => ({
      certificates: { ...state.certificates, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/certificates");
      set((state) => ({
        certificates: { ...state.certificates, data, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch certificates";
      set((state) => ({
        certificates: {
          ...state.certificates,
          error: message,
          isLoading: false,
        },
      }));
      toast.error(message);
    }
  },
  downloadCertificate: async (type, quarterId) => {
    const key = `${type}-${quarterId}`;
    set((state) => ({
      certificates: { ...state.certificates, isLoading: true },
      downloaded: { ...state.downloaded, [key]: false },
    }));
    try {
      const response = await axiosInstance.get(
        "/student/certificate/download",
        {
          params: { type, quarter_id: quarterId },
          responseType: "blob",
        }
      );
      // Check if response is a PDF or an error
      const contentType = response.headers["content-type"];
      if (contentType.includes("application/json")) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        toast.error(errorData.message || "Failed to download certificate");
        set((state) => ({
          certificates: { ...state.certificates, isLoading: false },
        }));
        return false;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${type}-${quarterId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      set((state) => ({
        certificates: { ...state.certificates, isLoading: false },
        downloaded: { ...state.downloaded, [key]: true },
      }));
      toast.success("Certificate downloaded successfully");
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to download certificate";
      toast.error(message);
      set((state) => ({
        certificates: { ...state.certificates, isLoading: false },
      }));
      return false;
    }
  },
  resetAchievementsStore: () => {
    set({
      certificates: {
        data: {
          certificate_count: 0,
          honor_roll_count: {
            with_honors: 0,
            with_high_honors: 0,
            with_highest_honors: 0,
          },
          attendance_awards_count: 0,
          academic_awards: [],
          attendance_awards: [],
        },
        isLoading: false,
        error: null,
      },
      downloaded: {},
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useAchievementsStore.getState().resetAchievementsStore();
});

export default useAchievementsStore;
