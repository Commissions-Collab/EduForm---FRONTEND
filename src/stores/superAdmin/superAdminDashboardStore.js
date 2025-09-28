import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const handleError = (err, defaultMessage) => {
  const message = err?.response?.data?.message || defaultMessage;
  if (err.response?.status === 401 || err.response?.status === 403) {
    window.dispatchEvent(new Event("unauthorized"));
  }
  return message;
};

const useSuperAdminDashboardStore = create((set, get) => ({
  // Raw data from APIs
  academicYears: [],
  yearLevels: [],
  sections: [],
  enrollments: [],
  teachers: [],
  calendars: [],
  students: [],

  // Loading states
  loading: false,
  error: null,
  lastUpdated: null,

  // Fetch all dashboard data using existing API endpoints
  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      const requests = [
        axiosInstance.get("/admin/academic-years"),
        axiosInstance.get("/admin/year-level"),
        axiosInstance.get("/admin/section"),
        axiosInstance.get("/admin/enrollments?per_page=100"),
        axiosInstance.get("/admin/teacher?per_page=100"),
        axiosInstance.get("/admin/academic-calendar"),
        axiosInstance.get("/admin/students?per_page=100"),
      ];

      const [
        academicYearsRes,
        yearLevelsRes,
        sectionsRes,
        enrollmentsRes,
        teachersRes,
        calendarsRes,
        studentsRes,
      ] = await Promise.allSettled(requests);

      // Extract data using the actual response structures from your stores
      const academicYears =
        academicYearsRes.status === "fulfilled"
          ? academicYearsRes.value.data.data?.data ||
            academicYearsRes.value.data.data ||
            []
          : [];

      const yearLevels =
        yearLevelsRes.status === "fulfilled"
          ? yearLevelsRes.value.data.yearLevel?.data || []
          : [];

      const sections =
        sectionsRes.status === "fulfilled"
          ? sectionsRes.value.data.sections?.data || []
          : [];

      const enrollments =
        enrollmentsRes.status === "fulfilled"
          ? enrollmentsRes.value.data.data?.data ||
            enrollmentsRes.value.data.data ||
            []
          : [];

      const teachers =
        teachersRes.status === "fulfilled"
          ? teachersRes.value.data.data?.data ||
            teachersRes.value.data.data ||
            []
          : [];

      const calendars =
        calendarsRes.status === "fulfilled"
          ? calendarsRes.value.data.data || []
          : [];

      const students =
        studentsRes.status === "fulfilled"
          ? studentsRes.value.data.data?.data ||
            studentsRes.value.data.data ||
            []
          : [];

      set({
        academicYears: Array.isArray(academicYears) ? academicYears : [],
        yearLevels: Array.isArray(yearLevels) ? yearLevels : [],
        sections: Array.isArray(sections) ? sections : [],
        enrollments: Array.isArray(enrollments) ? enrollments : [],
        teachers: Array.isArray(teachers) ? teachers : [],
        calendars: Array.isArray(calendars) ? calendars : [],
        students: Array.isArray(students) ? students : [],
        lastUpdated: new Date().toISOString(),
        loading: false,
      });
    } catch (err) {
      const message = handleError(err, "Failed to fetch dashboard data");
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  // Get computed dashboard statistics
  getDashboardStats: () => {
    const state = get();
    const {
      academicYears,
      yearLevels,
      sections,
      enrollments,
      teachers,
      calendars,
      students,
    } = state;

    return {
      totalAcademicYears: academicYears.length,
      totalYearLevels: yearLevels.length,
      totalSections: sections.length,
      totalEnrollments: enrollments.length,
      totalTeachers: teachers.length,
      totalStudents: students.length,
      totalCalendarEvents: calendars.length,

      // Current academic year
      currentAcademicYear:
        academicYears.find((year) => year.is_current) || null,

      // Distribution data
      sectionsByLevel: sections.reduce((acc, section) => {
        const levelName =
          section.year_level?.name || section.year_level_name || "Unknown";
        acc[levelName] = (acc[levelName] || 0) + 1;
        return acc;
      }, {}),

      teachersByStatus: teachers.reduce((acc, teacher) => {
        const status = teacher.status || "Active";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),

      enrollmentsByStatus: enrollments.reduce((acc, enrollment) => {
        const status = enrollment.status || "Active";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),

      // Events this month
      eventsThisMonth: calendars.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        const now = new Date();
        return (
          eventDate.getMonth() === now.getMonth() &&
          eventDate.getFullYear() === now.getFullYear()
        );
      }).length,

      // Recent activity (last 30 days)
      recentActivity: {
        newTeachers: teachers.filter((teacher) => {
          if (!teacher.created_at) return false;
          const createdDate = new Date(teacher.created_at);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate >= thirtyDaysAgo;
        }).length,

        newEnrollments: enrollments.filter((enrollment) => {
          if (!enrollment.created_at) return false;
          const createdDate = new Date(enrollment.created_at);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate >= thirtyDaysAgo;
        }).length,

        newSections: sections.filter((section) => {
          if (!section.created_at) return false;
          const createdDate = new Date(section.created_at);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate >= thirtyDaysAgo;
        }).length,
      },
    };
  },

  // Get dashboard cards data
  getDashboardCards: () => {
    const stats = get().getDashboardStats();

    return [
      {
        id: "students",
        title: "Students & Enrollments",
        type: "students",
        data: {
          totalStudents: stats.totalStudents,
          totalEnrollments: stats.totalEnrollments,
          recentEnrollments: stats.recentActivity.newEnrollments,
          enrollmentsByStatus: stats.enrollmentsByStatus,
        },
        icon: "Users",
        color: "blue",
      },
      {
        id: "teachers",
        title: "Teachers Management",
        type: "teachers",
        data: {
          totalTeachers: stats.totalTeachers,
          recentTeachers: stats.recentActivity.newTeachers,
          teachersByStatus: stats.teachersByStatus,
        },
        icon: "UserCheck",
        color: "green",
      },
      {
        id: "academic",
        title: "Academic Structure",
        type: "academic",
        data: {
          totalAcademicYears: stats.totalAcademicYears,
          totalYearLevels: stats.totalYearLevels,
          totalSections: stats.totalSections,
          currentAcademicYear: stats.currentAcademicYear,
          sectionsByLevel: stats.sectionsByLevel,
          recentSections: stats.recentActivity.newSections,
        },
        icon: "BookOpen",
        color: "purple",
      },
      {
        id: "calendar",
        title: "Calendar & Events",
        type: "calendar",
        data: {
          totalEvents: stats.totalCalendarEvents,
          eventsThisMonth: stats.eventsThisMonth,
        },
        icon: "Calendar",
        color: "indigo",
      },
    ];
  },

  // Get system overview
  getSystemOverview: () => {
    const stats = get().getDashboardStats();
    const { lastUpdated } = get();

    return {
      totalEntities:
        stats.totalStudents +
        stats.totalTeachers +
        stats.totalSections +
        stats.totalAcademicYears,
      currentAcademicYear: stats.currentAcademicYear?.name || "Not Set",
      lastUpdated,
      recentActivity: stats.recentActivity,
    };
  },

  // Get distribution data for charts
  getDistributionData: () => {
    const stats = get().getDashboardStats();
    return {
      sectionsByLevel: stats.sectionsByLevel,
      teachersByStatus: stats.teachersByStatus,
      enrollmentsByStatus: stats.enrollmentsByStatus,
    };
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  resetDashboardStore: () =>
    set({
      academicYears: [],
      yearLevels: [],
      sections: [],
      enrollments: [],
      teachers: [],
      calendars: [],
      students: [],
      loading: false,
      error: null,
      lastUpdated: null,
    }),
}));

// Event handlers
const handleUnauthorized = () => {
  useSuperAdminDashboardStore.getState().resetDashboardStore();
};

if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", handleUnauthorized);

  window.addEventListener("unload", () => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useSuperAdminDashboardStore;
