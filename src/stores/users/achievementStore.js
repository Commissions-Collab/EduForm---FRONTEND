import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const useAchievementsStore = create((set, get) => ({
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

  fetchCertificates: async () => {
    set((state) => ({
      certificates: {
        ...state.certificates,
        isLoading: true,
        error: null,
      },
    }));

    try {
      // Use correct API route
      const { data } = await axiosInstance.get("/student/certificates", {
        timeout: 10000,
      });

      console.log("fetchCertificates Response:", data);

      // Handle both success and direct data responses
      const responseData = data.success ? data.data : data;

      set((state) => ({
        certificates: {
          ...state.certificates,
          data: {
            certificate_count: responseData.certificate_count ?? 0,
            honor_roll_count: {
              with_honors: responseData.honor_roll_count?.with_honors ?? 0,
              with_high_honors:
                responseData.honor_roll_count?.with_high_honors ?? 0,
              with_highest_honors:
                responseData.honor_roll_count?.with_highest_honors ?? 0,
            },
            attendance_awards_count: responseData.attendance_awards_count ?? 0,
            academic_awards: Array.isArray(responseData.academic_awards)
              ? responseData.academic_awards
              : [],
            attendance_awards: Array.isArray(responseData.attendance_awards)
              ? responseData.attendance_awards
              : [],
          },
          isLoading: false,
        },
      }));
    } catch (error) {
      let message = "Failed to fetch certificates";

      if (error?.response?.status === 404) {
        message = "No active academic year found. Please contact support.";
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (
        error.response &&
        !error.response.headers["content-type"]?.includes("application/json")
      ) {
        message = "Server error occurred while fetching certificates";
      }

      console.error("fetchCertificates Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      set((state) => ({
        certificates: {
          ...state.certificates,
          error: message,
          isLoading: false,
        },
      }));

      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }

      toast.error(message);
    }
  },

  downloadCertificate: async (type, quarterId) => {
    const key = `${type}-${quarterId}`;

    set((state) => ({
      certificates: {
        ...state.certificates,
        isLoading: true,
      },
      downloaded: {
        ...state.downloaded,
        [key]: false,
      },
    }));

    try {
      // Use correct API route
      const response = await axiosInstance.get(
        "/student/certificate/download",
        {
          params: {
            type,
            quarter_id: quarterId,
          },
          responseType: "blob",
          timeout: 15000,
        }
      );

      // Check if response is JSON error (blob check)
      const contentType = response.headers["content-type"];
      if (!contentType.includes("application/pdf")) {
        // Try to parse as JSON error
        try {
          const text = await response.data.text();
          const errorData = JSON.parse(text);
          toast.error(errorData.message || "Failed to download certificate");
          set((state) => ({
            certificates: {
              ...state.certificates,
              isLoading: false,
            },
          }));
          return false;
        } catch (e) {
          toast.error("Failed to download certificate");
          set((state) => ({
            certificates: {
              ...state.certificates,
              isLoading: false,
            },
          }));
          return false;
        }
      }

      // Get certificate info for filename
      const allCerts = [
        ...get().certificates.data.academic_awards,
        ...get().certificates.data.attendance_awards,
      ];

      const cert = allCerts.find(
        (c) => c.type === type && c.quarter_id === quarterId
      );
      const quarterName =
        cert?.quarter?.toLowerCase().replace(/\s+/g, "-") || quarterId;

      // Create blob and download
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${type}-${quarterName}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      set((state) => ({
        certificates: {
          ...state.certificates,
          isLoading: false,
        },
        downloaded: {
          ...state.downloaded,
          [key]: true,
        },
      }));

      toast.success("Certificate downloaded successfully");
      return true;
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to download certificate";

      console.error("downloadCertificate Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 403) {
        message =
          "You are not qualified for this certificate for the selected quarter";
      } else if (error.response?.status === 404) {
        message = "Certificate or quarter not found";
      }

      set((state) => ({
        certificates: {
          ...state.certificates,
          isLoading: false,
        },
      }));

      if (error.response?.status === 401 || error.response?.status === 403) {
        window.dispatchEvent(new Event("unauthorized"));
      }

      toast.error(message);
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
