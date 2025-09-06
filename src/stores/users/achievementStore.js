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
  fetchCertificates: async () => {
    set((state) => ({
      certificates: { ...state.certificates, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/certificates");
      set((state) => ({
        certificates: { ...state.certificates, data: data, isLoading: false },
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
  // Note: downloadCertificate is typically handled in components as it returns a file stream
  // If needed, you can add a method here that calls the API and handles the response blob
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
    });
  },
}));
// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useAchievementsStore.getState().resetAchievementsStore();
});
export default useAchievementsStore;
