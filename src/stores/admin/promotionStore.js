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

const usePromotionStore = create((set, get) => ({
  promotionStudents: [],
  currentPage: 1,
  overallPromotionStats: null,
  isPromotionAccessible: false,
  promotionMessage: null,
  loading: false,
  error: null,

  fetchPromotionData: async () => {
    set({ loading: true, error: null });
    const filters = useFilterStore.getState().globalFilters;

    if (!filters.academicYearId || !filters.sectionId) {
      const message = "Please select Academic Year and Section";
      set({
        error: message,
        promotionMessage: {
          title: "Missing Filters",
          content: message,
        },
        loading: false,
      });
      toast.error(message);
      return;
    }

    try {
      const { data } = await axiosInstance.get(
        "/teacher/promotion-reports/statistics",
        {
          params: {
            academic_year_id: filters.academicYearId,
            section_id: filters.sectionId,
          },
        }
      );

      const transformedStudents = (
        Array.isArray(data?.students) ? data.students : []
      ).map((student) => ({
        student_id: student.studentId || student.id || "",
        student_name: student.student_name || student.name || "Unknown",
        final_average: student.final_average || student.average_grade || 0,
        attendance_percentage:
          student.attendance_percentage || student.attendance || 0,
        honor_classification:
          student.honor_classification || student.honor || "No Honor",
        promotion_status:
          student.promotion_status || student.status || "Pending",
      }));

      const transformedStats = data.overall_statistics
        ? {
            total:
              data.overall_statistics.total_students ||
              data.overall_statistics.total ||
              0,
            promoted:
              data.overall_statistics.promoted_students ||
              data.overall_statistics.promoted ||
              0,
            promotedPercentage:
              data.overall_statistics.promoted_percentage ||
              data.overall_statistics.promotion_rate ||
              0,
            withHonors:
              data.overall_statistics.honors_students ||
              data.overall_statistics.with_honors ||
              0,
            honorsPercentage:
              data.overall_statistics.honors_percentage ||
              data.overall_statistics.honors_rate ||
              0,
            retained:
              data.overall_statistics.retained_students ||
              data.overall_statistics.retained ||
              0,
            retainedPercentage:
              data.overall_statistics.retained_percentage ||
              data.overall_statistics.retention_rate ||
              0,
          }
        : null;

      set({
        promotionStudents: transformedStudents,
        overallPromotionStats: transformedStats,
        isPromotionAccessible: data.accessible ?? false,
        promotionMessage: null,
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch promotion data", set);
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),

  totalPages: () =>
    Math.ceil(get().promotionStudents.length / RECORDS_PER_PAGE),

  paginatedRecords: () =>
    paginate(get().promotionStudents, get().currentPage, RECORDS_PER_PAGE),

  resetPromotionStore: () => {
    set({
      promotionStudents: [],
      currentPage: 1,
      overallPromotionStats: null,
      isPromotionAccessible: false,
      promotionMessage: null,
      loading: false,
      error: null,
    });
  },
}));

// Listen for unauthorized event to reset store
window.addEventListener("unauthorized", () => {
  usePromotionStore.getState().resetPromotionStore();
});

export default usePromotionStore;
