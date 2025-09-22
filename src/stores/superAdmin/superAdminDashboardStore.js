import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const handleError = (err, defaultMessage, set) => {
  let errorMessage = defaultMessage;

  if (err.response) {
    errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      `Server Error: ${err.response.status}`;
  } else if (err.request) {
    errorMessage = "Network error - please check your connection";
  } else {
    errorMessage = err.message || defaultMessage;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(defaultMessage, {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
  }

  set({ error: errorMessage, loading: false });
  return errorMessage;
};

const useSuperAdminDashboardStore = create((set, get) => ({
  // Data from existing stores
  academicYears: [],
  yearLevels: [],
  sections: [],
  enrollments: [],
  teachers: [],
  calendars: [],
  students: [],

  // Computed stats
  dashboardStats: null,

  // Meta
  loading: false,
  error: null,
  lastUpdated: null,

  // Fetch all dashboard data using existing endpoints
  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      // Use existing endpoints from the stores
      const [
        academicYearsRes,
        yearLevelsRes,
        sectionsRes,
        enrollmentsRes,
        teachersRes,
        calendarsRes,
        studentsRes,
      ] = await Promise.allSettled([
        axiosInstance.get("/admin/academic-years"),
        axiosInstance.get("/admin/year-level"),
        axiosInstance.get("/admin/section"),
        axiosInstance.get("/admin/enrollments?page=1&per_page=100"),
        axiosInstance.get("/admin/teacher?page=1&per_page=100"),
        axiosInstance.get("/admin/academic-calendar"),
        axiosInstance.get("/admin/students?page=1&per_page=100"),
      ]);

      // Extract data with fallbacks
      const academicYears =
        academicYearsRes.status === "fulfilled"
          ? academicYearsRes.value.data.data?.data ||
            academicYearsRes.value.data.years ||
            academicYearsRes.value.data.result ||
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
          ? Array.isArray(enrollmentsRes.value.data.data?.data)
            ? enrollmentsRes.value.data.data.data
            : Array.isArray(enrollmentsRes.value.data.data)
            ? enrollmentsRes.value.data.data
            : []
          : [];

      const teachers =
        teachersRes.status === "fulfilled"
          ? Array.isArray(teachersRes.value.data.data?.data)
            ? teachersRes.value.data.data.data
            : Array.isArray(teachersRes.value.data.data)
            ? teachersRes.value.data.data
            : []
          : [];

      const calendars =
        calendarsRes.status === "fulfilled"
          ? calendarsRes.value.data.data || []
          : [];

      const students =
        studentsRes.status === "fulfilled"
          ? Array.isArray(studentsRes.value.data.data?.data)
            ? studentsRes.value.data.data.data
            : Array.isArray(studentsRes.value.data.data)
            ? studentsRes.value.data.data
            : Array.isArray(studentsRes.value.data.students?.data)
            ? studentsRes.value.data.students.data
            : []
          : [];

      // Compute dashboard statistics
      const stats = {
        totalAcademicYears: academicYears.length,
        totalYearLevels: yearLevels.length,
        totalSections: sections.length,
        totalEnrollments: enrollments.length,
        totalTeachers: teachers.length,
        totalStudents: students.length,
        totalCalendarEvents: calendars.length,

        // Current academic year info
        currentAcademicYear:
          academicYears.find((year) => year.is_current) || null,

        // Section distribution by year level
        sectionsByLevel: sections.reduce((acc, section) => {
          const levelName =
            section.year_level_name || section.grade_level || "Unknown";
          acc[levelName] = (acc[levelName] || 0) + 1;
          return acc;
        }, {}),

        // Teacher distribution by subject (if available)
        teachersBySubject: teachers.reduce((acc, teacher) => {
          const subject =
            teacher.subject || teacher.specialization || "General";
          acc[subject] = (acc[subject] || 0) + 1;
          return acc;
        }, {}),

        // Enrollment status distribution
        enrollmentsByStatus: enrollments.reduce((acc, enrollment) => {
          const status = enrollment.status || "Active";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {}),

        // Calendar events this month
        eventsThisMonth: calendars.filter((event) => {
          if (!event.date) return false;
          const eventDate = new Date(event.date);
          const now = new Date();
          return (
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear()
          );
        }).length,

        // Recently added items (this month)
        recentlyAdded: {
          teachers: teachers.filter((teacher) => {
            if (!teacher.created_at) return false;
            const createdDate = new Date(teacher.created_at);
            const now = new Date();
            const lastMonth = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return createdDate >= lastMonth;
          }).length,
          enrollments: enrollments.filter((enrollment) => {
            if (!enrollment.created_at) return false;
            const createdDate = new Date(enrollment.created_at);
            const now = new Date();
            const lastMonth = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return createdDate >= lastMonth;
          }).length,
          sections: sections.filter((section) => {
            if (!section.created_at) return false;
            const createdDate = new Date(section.created_at);
            const now = new Date();
            const lastMonth = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return createdDate >= lastMonth;
          }).length,
        },
      };

      set({
        academicYears: Array.isArray(academicYears) ? academicYears : [],
        yearLevels: Array.isArray(yearLevels) ? yearLevels : [],
        sections: Array.isArray(sections) ? sections : [],
        enrollments: Array.isArray(enrollments) ? enrollments : [],
        teachers: Array.isArray(teachers) ? teachers : [],
        calendars: Array.isArray(calendars) ? calendars : [],
        students: Array.isArray(students) ? students : [],
        dashboardStats: stats,
        lastUpdated: new Date().toISOString(),
        loading: false,
      });
    } catch (err) {
      handleError(err, "Failed to fetch dashboard data", set);
    }
  },

  // Get dashboard summary for cards
  getDashboardCards: () => {
    const { dashboardStats } = get();

    if (!dashboardStats) return [];

    return [
      {
        id: "students",
        title: "Students & Enrollments",
        type: "students",
        data: {
          totalStudents: dashboardStats.totalStudents,
          totalEnrollments: dashboardStats.totalEnrollments,
          recentEnrollments: dashboardStats.recentlyAdded.enrollments,
          enrollmentsByStatus: dashboardStats.enrollmentsByStatus,
        },
        icon: "Users",
        color: "blue",
      },
      {
        id: "teachers",
        title: "Teachers Management",
        type: "teachers",
        data: {
          totalTeachers: dashboardStats.totalTeachers,
          recentTeachers: dashboardStats.recentlyAdded.teachers,
          teachersBySubject: dashboardStats.teachersBySubject,
        },
        icon: "UserCheck",
        color: "green",
      },
      {
        id: "academic",
        title: "Academic Structure",
        type: "academic",
        data: {
          totalAcademicYears: dashboardStats.totalAcademicYears,
          totalYearLevels: dashboardStats.totalYearLevels,
          totalSections: dashboardStats.totalSections,
          currentAcademicYear: dashboardStats.currentAcademicYear,
          sectionsByLevel: dashboardStats.sectionsByLevel,
          recentSections: dashboardStats.recentlyAdded.sections,
        },
        icon: "BookOpen",
        color: "purple",
      },
      {
        id: "calendar",
        title: "Calendar & Events",
        type: "calendar",
        data: {
          totalEvents: dashboardStats.totalCalendarEvents,
          eventsThisMonth: dashboardStats.eventsThisMonth,
        },
        icon: "Calendar",
        color: "indigo",
      },
    ];
  },

  // Get system overview
  getSystemOverview: () => {
    const { dashboardStats, lastUpdated } = get();

    if (!dashboardStats) return null;

    return {
      totalEntities:
        dashboardStats.totalStudents +
        dashboardStats.totalTeachers +
        dashboardStats.totalSections +
        dashboardStats.totalAcademicYears,
      currentAcademicYear:
        dashboardStats.currentAcademicYear?.name || "Not Set",
      lastUpdated,
      recentActivity: {
        newTeachers: dashboardStats.recentlyAdded.teachers,
        newEnrollments: dashboardStats.recentlyAdded.enrollments,
        newSections: dashboardStats.recentlyAdded.sections,
      },
    };
  },

  // Get distribution data for charts
  getDistributionData: () => {
    const { dashboardStats } = get();

    if (!dashboardStats) return null;

    return {
      sectionsByLevel: dashboardStats.sectionsByLevel,
      teachersBySubject: dashboardStats.teachersBySubject,
      enrollmentsByStatus: dashboardStats.enrollmentsByStatus,
    };
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  resetDashboardStore: () => {
    set({
      academicYears: [],
      yearLevels: [],
      sections: [],
      enrollments: [],
      teachers: [],
      calendars: [],
      students: [],
      dashboardStats: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  },
}));

// Event handlers
const handleUnauthorized = () => {
  useSuperAdminDashboardStore.getState().resetDashboardStore();
};

// Event listeners
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export default useSuperAdminDashboardStore;
