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
      // Use correct API route
      const { data } = await axiosInstance.get("/student/health-profile", {
        timeout: 10000,
      });

      console.log("fetchBmiData Response:", data);

      // Handle both success and direct data responses
      const responseData = data.success ? data.data : data.data || data;

      // Normalize field names to match frontend expectations
      const normalizedData = Array.isArray(responseData)
        ? responseData.map((record) => ({
            id: record.id,
            recorded_at: record.recorded_at,
            height: record.height_cm,
            weight: record.weight_kg,
            bmi: record.bmi,
            category: record.bmi_category,
            quarter_id: record.quarter_id,
            quarter_name: record.quarter_name || "Unknown",
            remarks: record.remarks,
          }))
        : [];

      set({
        data: normalizedData,
        loading: false,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to fetch BMI data";

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
