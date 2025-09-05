import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useHealthProfileStore = create((set) => ({
  bmiData: {
    data: [],
    isLoading: false,
    error: null,
  },
  fetchBmiData: async () => {
    set((state) => ({
      bmiData: { ...state.bmiData, isLoading: true, error: null },
    }));
    try {
      const { data } = await axiosInstance.get("/student/health-profile");
      set((state) => ({
        bmiData: { ...state.bmiData, data: data.data, isLoading: false },
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to fetch BMI data";
      set((state) => ({
        bmiData: { ...state.bmiData, error: message, isLoading: false },
      }));
      toast.error(message);
    }
  },
  resetHealthProfileStore: () => {
    set({
      bmiData: { data: [], isLoading: false, error: null },
    });
  },
}));
// Reset store on unauthorized event
window.addEventListener("unauthorized", () => {
  useHealthProfileStore.getState().resetHealthProfileStore();
});
export default useHealthProfileStore;
