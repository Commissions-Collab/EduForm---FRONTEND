import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useHealthProfileStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchBmiData: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/student/health-profile");
      console.log("fetchBmiData Response:", data);
      set({
        data: data.data || [],
        loading: false,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message || "Failed to fetch BMI data";
      if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching BMI data";
      }
      console.error("fetchBmiData Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      set({
        error: message,
        loading: false,
        data: [],
      });
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }
      toast.error(message);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  resetHealthProfileStore: () => {
    set({
      data: [],
      loading: false,
      error: null,
    });
  },
}));

window.addEventListener("unauthorized", () => {
  useHealthProfileStore.getState().resetHealthProfileStore();
});

export default useHealthProfileStore;
