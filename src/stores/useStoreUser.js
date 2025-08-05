// src/stores/useStoreUser.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getItem, setItem, removeItem } from "../lib/utils";
import toast from "react-hot-toast";

export const useStoreUser = create((set, get) => ({
    // =============
    // AUTH STATE
    // =============
    user: getItem("user") || null,
    token: getItem("token", false) || null,

    // =============
    // DASHBOARD STATE
    // =============
    dashboardData: {
        grades: 0,
        grade_change_percent: 0,
        attendance_rate: {
            present_percent: 0,
            recent_absents: []
        },
        borrow_book: 0,
        book_due_this_week: 0,
        notifications: []
    },
    dashboardLoading: false,
    dashboardError: null,

    // =============
    // GRADES STATE
    // =============
    gradesData: {
        quarter: "",
        quarter_average: 0,
        honors_eligibility: null,
        grades: []
    },
    quarterOptions: [],
    selectedQuarter: null,
    gradesLoading: false,
    gradesError: null,

    // =============
    // ATTENDANCE STATE
    // =============
    attendanceData: {
        attendance_rate: 0,
        late_arrivals: {
            count: 0,
            pattern: null
        },
        absences: {
            count: 0
        },
        daily_status: [],
        quarterly_summary: []
    },
    monthOptions: [],
    selectedMonth: null,
    attendanceLoading: false,
    attendanceError: null,

    // =============
    // HEALTH PROFILE STATE
    // =============
    healthProfileData: {
        data: []
    },
    healthProfileLoading: false,
    healthProfileError: null,

    // =============
    // ACHIEVEMENTS STATE
    // =============
    achievementsData: {
        certificate_count: 0,
        honor_roll_count: {
            with_honors: 0,
            with_high_honors: 0,
            with_highest_honors: 0
        },
        attendance_awards_count: 0,
        academic_awards: [],
        attendance_awards: []
    },
    achievementsLoading: false,
    achievementsError: null,

    // =============
    // DASHBOARD ACTIONS
    // =============
    fetchDashboard: async () => {
        set({ dashboardLoading: true, dashboardError: null });
        try {
            const { data } = await axiosInstance.get('/student/dashboard');
            set({ 
                dashboardData: data,
                dashboardLoading: false 
            });
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch dashboard data";
            set({ dashboardError: message, dashboardLoading: false });
            toast.error(message);
        }
    },

    clearDashboardError: () => set({ dashboardError: null }),

    // =============
    // GRADES ACTIONS
    // =============
    fetchGrades: async () => {
        set({ gradesLoading: true, gradesError: null });
        try {
            const { data } = await axiosInstance.get('/student/student-grade');
            set({ 
                gradesData: data,
                gradesLoading: false 
            });
        } catch (error) {
            let message = "Failed to fetch grades";
            
            if (error?.response?.status === 404) {
                message = "No active quarter found. Please contact your administrator.";
            } else if (error?.response?.data?.message) {
                message = error.response.data.message;
            } else if (error?.response?.data?.error) {
                message = error.response.data.error;
            }
            
            set({ gradesError: message, gradesLoading: false });
            toast.error(message);
        }
    },

    fetchQuarterOptions: async () => {
        try {
            const { data } = await axiosInstance.get('/student/student-grade/filter');
            set({ quarterOptions: data.quarters });
        } catch (error) {
            console.error("Failed to fetch quarter options:", error);
        }
    },

    setSelectedQuarter: (quarter) => {
        set({ selectedQuarter: quarter });
    },

    clearGradesError: () => set({ gradesError: null }),

    // =============
    // ATTENDANCE ACTIONS
    // =============
    fetchAttendance: async (month = null) => {
        set({ attendanceLoading: true, attendanceError: null });
        try {
            // If no month is provided, use current month as default
            const monthParam = month || new Date().toISOString().slice(0, 7); // Format: YYYY-MM
            const { data } = await axiosInstance.get('/student/student-attendance', { 
                params: { month: monthParam } 
            });
            set({ 
                attendanceData: data,
                attendanceLoading: false 
            });
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch attendance data";
            set({ attendanceError: message, attendanceLoading: false });
            toast.error(message);
        }
    },

    fetchMonthOptions: async () => {
        try {
            const { data } = await axiosInstance.get('/student/student-attendance/filter');
            set({ monthOptions: data.months });
        } catch {
            console.error("Failed to fetch month options");
        }
    },

    setSelectedMonth: (month) => {
        set({ selectedMonth: month });
    },

    clearAttendanceError: () => set({ attendanceError: null }),

    // =============
    // HEALTH PROFILE ACTIONS
    // =============
    fetchHealthProfile: async () => {
        set({ healthProfileLoading: true, healthProfileError: null });
        try {
            const { data } = await axiosInstance.get('/student/health-profile');
            set({ 
                healthProfileData: data,
                healthProfileLoading: false 
            });
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch health profile";
            set({ healthProfileError: message, healthProfileLoading: false });
            toast.error(message);
        }
    },

    clearHealthProfileError: () => set({ healthProfileError: null }),

    // =============
    // ACHIEVEMENTS ACTIONS
    // =============
    fetchAchievements: async () => {
        set({ achievementsLoading: true, achievementsError: null });
        try {
            const { data } = await axiosInstance.get('/student/certificates');
            set({ 
                achievementsData: data,
                achievementsLoading: false 
            });
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch achievements";
            set({ achievementsError: message, achievementsLoading: false });
            toast.error(message);
        }
    },

    downloadCertificate: async (type, quarterId) => {
        try {
            const response = await axiosInstance.get('/student/certificate/download', {
                params: { type, quarter_id: quarterId },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate-${type}-${quarterId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to download certificate";
            toast.error(message);
        }
    },

    clearAchievementsError: () => set({ achievementsError: null }),

    // =============
    // AUTH ACTIONS
    // =============
    login: async ({ email, password }) => {
        try {
            const { data } = await axiosInstance.post("/login", { email, password });
            const { user, token } = data;

            setItem("user", user);
            setItem("token", token);
            set({ user, token });

            toast.success("Logged in successfully!");
            return { success: true, user };
        } catch (error) {
            const message = error?.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, message };
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/logout");
            toast.success("Logged out successfully!");
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message || "Logout failed";
            if (status !== 401) toast.error(message);
        } finally {
            removeItem("user");
            removeItem("token");
            set({ user: null, token: null });
        }
    },

    checkAuth: async () => {
        const token = getItem("token", false);

        if (!token) {
            set({ user: null });
            return;
        }

        try {
            const { data: user } = await axiosInstance.get("/auth/check");
            setItem("user", user);
            set({ user });
        } catch {
            removeItem("user");
            removeItem("token");
            set({ user: null, token: null });
        }
    },

    // =================
    // UTILITY METHODS
    // =================
    
    // Reset all data (useful for logout or user switching)
    resetUserData: () => {
        set({
            // Reset dashboard
            dashboardData: {
                grades: 0,
                grade_change_percent: 0,
                attendance_rate: {
                    present_percent: 0,
                    recent_absents: []
                },
                borrow_book: 0,
                book_due_this_week: 0,
                notifications: []
            },
            dashboardLoading: false,
            dashboardError: null,

            // Reset grades
            gradesData: {
                quarter: "",
                quarter_average: 0,
                honors_eligibility: null,
                grades: []
            },
            quarterOptions: [],
            selectedQuarter: null,
            gradesLoading: false,
            gradesError: null,

            // Reset attendance
            attendanceData: {
                attendance_rate: 0,
                late_arrivals: {
                    count: 0,
                    pattern: null
                },
                absences: {
                    count: 0
                },
                daily_status: [],
                quarterly_summary: []
            },
            monthOptions: [],
            selectedMonth: null,
            attendanceLoading: false,
            attendanceError: null,

            // Reset health profile
            healthProfileData: {
                data: []
            },
            healthProfileLoading: false,
            healthProfileError: null,

            // Reset achievements
            achievementsData: {
                certificate_count: 0,
                honor_roll_count: {
                    with_honors: 0,
                    with_high_honors: 0,
                    with_highest_honors: 0
                },
                attendance_awards_count: 0,
                academic_awards: [],
                attendance_awards: []
            },
            achievementsLoading: false,
            achievementsError: null,
        });
    },

    // Initialize user data (useful for login or app start)
    initializeUserData: async () => {
        set({ 
            dashboardLoading: true, 
            gradesLoading: true, 
            attendanceLoading: true,
            healthProfileLoading: true,
            achievementsLoading: true
        });

        try {
            // Get current month for attendance
            const currentMonth = new Date().toISOString().slice(0, 7);
            
            // Fetch all data in parallel
            await Promise.all([
                get().fetchDashboard(),
                get().fetchGrades(),
                get().fetchAttendance(currentMonth),
                get().fetchHealthProfile(),
                get().fetchAchievements(),
                get().fetchQuarterOptions(),
                get().fetchMonthOptions()
            ]);
        } catch (error) {
            console.error("Failed to initialize user data:", error);
        } finally {
            set({
                dashboardLoading: false,
                gradesLoading: false,
                attendanceLoading: false,
                healthProfileLoading: false,
                achievementsLoading: false,
            });
        }
    },

    // Getters for computed values
    getUserRole: () => get().user?.role || null,
    
    get totalAcademicAwards() {
        return get().achievementsData.academic_awards.length;
    },
    
    get totalAttendanceAwards() {
        return get().achievementsData.attendance_awards.length;
    },
    
    get totalCertificates() {
        return get().achievementsData.certificate_count;
    },

    get currentMonthData() {
        const { attendanceData } = get();
        return attendanceData;
    },
}));