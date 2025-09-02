import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useSuperAdminStore = create((set, get) => ({
  // Loading states
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // Data states
  academicYears: [],
  academicCalendars: [],
  enrollments: [],
  sections: [],
  yearLevels: [],
  teachers: [],
  studentRecords: [],
  schedules: [],

  // Current selections
  currentAcademicYear: null,

  // Error states
  error: null,

  // Helper function to handle API errors
  handleError: (error, defaultMessage) => {
    const message = error?.response?.data?.message || defaultMessage;
    set({ error: message });
    toast.error(message);
    return { success: false, message };
  },

  // Helper function to handle loading states
  setLoadingState: (loadingType, isLoading) => {
    set({ [loadingType]: isLoading, error: null });
  },

  // ===== ACADEMIC YEARS =====
  fetchAcademicYears: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/academic-years");
      set({ academicYears: data.data || data, isLoading: false });
      return { success: true, data: data.data || data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch academic years");
    }
  },

  createAcademicYear: async (academicYearData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post(
        "/admin/academic-years",
        academicYearData
      );
      const newAcademicYear = data.data;

      set((state) => ({
        academicYears: [...state.academicYears, newAcademicYear],
        isCreating: false,
      }));

      toast.success("Academic year created successfully!");
      return { success: true, data: newAcademicYear };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create academic year");
    }
  },

  updateAcademicYear: async (id, academicYearData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/academic-years/${id}`,
        academicYearData
      );
      const updatedAcademicYear = data.data;

      set((state) => ({
        academicYears: state.academicYears.map((year) =>
          year.id === id ? updatedAcademicYear : year
        ),
        isUpdating: false,
      }));

      toast.success("Academic year updated successfully!");
      return { success: true, data: updatedAcademicYear };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update academic year");
    }
  },

  deleteAcademicYear: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/academic-years/${id}`);

      set((state) => ({
        academicYears: state.academicYears.filter((year) => year.id !== id),
        isDeleting: false,
      }));

      toast.success("Academic year deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete academic year");
    }
  },

  getCurrentAcademicYear: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/academic-years-current");
      set({ currentAcademicYear: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch current academic year");
    }
  },

  // ===== ACADEMIC CALENDAR =====
  fetchAcademicCalendar: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/academic-calendar");
      set({ academicCalendars: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch academic calendar");
    }
  },

  createAcademicCalendarEvent: async (eventData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post(
        "/admin/academic-calendar",
        eventData
      );
      const newEvent = data.data;

      set((state) => ({
        academicCalendars: [...state.academicCalendars, newEvent],
        isCreating: false,
      }));

      toast.success("Calendar event created successfully!");
      return { success: true, data: newEvent };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create calendar event");
    }
  },

  updateAcademicCalendarEvent: async (id, eventData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/academic-calendar/${id}`,
        eventData
      );
      const updatedEvent = data.data;

      set((state) => ({
        academicCalendars: state.academicCalendars.map((event) =>
          event.id === id ? updatedEvent : event
        ),
        isUpdating: false,
      }));

      toast.success("Calendar event updated successfully!");
      return { success: true, data: updatedEvent };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update calendar event");
    }
  },

  deleteAcademicCalendarEvent: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/academic-calendar/${id}`);

      set((state) => ({
        academicCalendars: state.academicCalendars.filter(
          (event) => event.id !== id
        ),
        isDeleting: false,
      }));

      toast.success("Calendar event deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete calendar event");
    }
  },

  fetchAcademicCalendarByYear: async (academicYearId) => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get(
        `/admin/academic-calendar/year/${academicYearId}`
      );
      set({ academicCalendars: data, isLoading: false });
      return { success: true, data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(
        error,
        "Failed to fetch calendar events for year"
      );
    }
  },

  // ===== ENROLLMENTS =====
  fetchEnrollments: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/enrollments");
      set({ enrollments: data.data || data, isLoading: false });
      return { success: true, data: data.data || data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch enrollments");
    }
  },

  createEnrollment: async (enrollmentData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post(
        "/admin/enrollments",
        enrollmentData
      );
      const newEnrollment = data.data;

      set((state) => ({
        enrollments: [...state.enrollments, newEnrollment],
        isCreating: false,
      }));

      toast.success("Enrollment created successfully!");
      return { success: true, data: newEnrollment };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create enrollment");
    }
  },

  updateEnrollment: async (id, enrollmentData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/enrollments/${id}`,
        enrollmentData
      );
      const updatedEnrollment = data.data;

      set((state) => ({
        enrollments: state.enrollments.map((enrollment) =>
          enrollment.id === id ? updatedEnrollment : enrollment
        ),
        isUpdating: false,
      }));

      toast.success("Enrollment updated successfully!");
      return { success: true, data: updatedEnrollment };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update enrollment");
    }
  },

  deleteEnrollment: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/enrollments/${id}`);

      set((state) => ({
        enrollments: state.enrollments.filter(
          (enrollment) => enrollment.id !== id
        ),
        isDeleting: false,
      }));

      toast.success("Enrollment deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete enrollment");
    }
  },

  // ===== SECTIONS =====
  createSection: async (sectionData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post("/admin/section", sectionData);
      const newSection = data.section;

      set((state) => ({
        sections: [...state.sections, newSection],
        isCreating: false,
      }));

      toast.success("Section created successfully!");
      return { success: true, data: newSection };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create section");
    }
  },

  updateSection: async (id, sectionData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/section/${id}`,
        sectionData
      );
      const updatedSection = data.section;

      set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? updatedSection : section
        ),
        isUpdating: false,
      }));

      toast.success("Section updated successfully!");
      return { success: true, data: updatedSection };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update section");
    }
  },

  deleteSection: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/section/${id}`);

      set((state) => ({
        sections: state.sections.filter((section) => section.id !== id),
        isDeleting: false,
      }));

      toast.success("Section deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete section");
    }
  },

  // ===== YEAR LEVELS =====
  createYearLevel: async (yearLevelData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post(
        "/admin/year_level",
        yearLevelData
      );
      const newYearLevel = data.year_level;

      set((state) => ({
        yearLevels: [...state.yearLevels, newYearLevel],
        isCreating: false,
      }));

      toast.success("Year level created successfully!");
      return { success: true, data: newYearLevel };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create year level");
    }
  },

  deleteYearLevel: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/year_level/${id}`);

      set((state) => ({
        yearLevels: state.yearLevels.filter((yearLevel) => yearLevel.id !== id),
        isDeleting: false,
      }));

      toast.success("Year level deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete year level");
    }
  },

  // ===== TEACHERS =====
  fetchTeachers: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/teacher/all");
      set({ teachers: data.data || data, isLoading: false });
      return { success: true, data: data.data || data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch teachers");
    }
  },

  createTeacher: async (teacherData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post("/admin/teacher", teacherData);
      const newTeacher = data.teacher;

      set((state) => ({
        teachers: [...state.teachers, newTeacher],
        isCreating: false,
      }));

      toast.success("Teacher created successfully!");
      return { success: true, data: newTeacher };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create teacher");
    }
  },

  updateTeacher: async (id, teacherData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/teacher/${id}/record`,
        teacherData
      );
      const updatedTeacher = data.teacher;

      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher.id === id ? updatedTeacher : teacher
        ),
        isUpdating: false,
      }));

      toast.success("Teacher updated successfully!");
      return { success: true, data: updatedTeacher };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update teacher");
    }
  },

  deleteTeacher: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/teacher/${id}`);

      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        isDeleting: false,
      }));

      toast.success("Teacher deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete teacher");
    }
  },

  createTeacherSchedule: async (scheduleData) => {
    get().setLoadingState("isCreating", true);

    try {
      const { data } = await axiosInstance.post(
        "/admin/schedule",
        scheduleData
      );
      const newSchedule = data.schedule;

      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        isCreating: false,
      }));

      toast.success("Teacher schedule created successfully!");
      return { success: true, data: newSchedule };
    } catch (error) {
      set({ isCreating: false });
      return get().handleError(error, "Failed to create teacher schedule");
    }
  },

  // ===== STUDENT RECORDS =====
  fetchStudentRecords: async () => {
    get().setLoadingState("isLoading", true);

    try {
      const { data } = await axiosInstance.get("/admin/records");
      set({ studentRecords: data.students || data, isLoading: false });
      return { success: true, data: data.students || data };
    } catch (error) {
      set({ isLoading: false });
      return get().handleError(error, "Failed to fetch student records");
    }
  },

  updateStudentRecord: async (id, studentData) => {
    get().setLoadingState("isUpdating", true);

    try {
      const { data } = await axiosInstance.put(
        `/admin/student/${id}`,
        studentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedStudent = data.student;

      set((state) => ({
        studentRecords: state.studentRecords.map((student) =>
          student.id === id ? updatedStudent : student
        ),
        isUpdating: false,
      }));

      toast.success("Student record updated successfully!");
      return { success: true, data: updatedStudent };
    } catch (error) {
      set({ isUpdating: false });
      return get().handleError(error, "Failed to update student record");
    }
  },

  deleteStudentRecord: async (id) => {
    get().setLoadingState("isDeleting", true);

    try {
      await axiosInstance.delete(`/admin/student/${id}`);

      set((state) => ({
        studentRecords: state.studentRecords.filter(
          (student) => student.id !== id
        ),
        isDeleting: false,
      }));

      toast.success("Student record deleted successfully!");
      return { success: true };
    } catch (error) {
      set({ isDeleting: false });
      return get().handleError(error, "Failed to delete student record");
    }
  },

  // ===== UTILITY FUNCTIONS =====
  clearError: () => {
    set({ error: null });
  },

  resetStore: () => {
    set({
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      academicYears: [],
      academicCalendars: [],
      enrollments: [],
      sections: [],
      yearLevels: [],
      teachers: [],
      studentRecords: [],
      schedules: [],
      currentAcademicYear: null,
      error: null,
    });
  },

  // Memoized getters for better performance
  getAcademicYearById: (id) => {
    const { academicYears } = get();
    return academicYears.find((year) => year.id === id) || null;
  },

  getTeacherById: (id) => {
    const { teachers } = get();
    return teachers.find((teacher) => teacher.id === id) || null;
  },

  getStudentById: (id) => {
    const { studentRecords } = get();
    return studentRecords.find((student) => student.id === id) || null;
  },

  getSectionById: (id) => {
    const { sections } = get();
    return sections.find((section) => section.id === id) || null;
  },
}));
