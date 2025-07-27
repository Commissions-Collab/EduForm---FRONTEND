// src/stores/useStoreUser.js
import { create } from "zustand";

// --- GRADES DATA ---
const allGradesData = {
    "1st Quarter": [
        { subject: "Mathematics", grade: 88, classAverage: 80, trend: "+2%", teacher: "Ms. Reyes", status: "above" },
        { subject: "Science", grade: 75, classAverage: 78, trend: "-1%", teacher: "Mr. Santos", status: "below" },
        { subject: "English", grade: 85, classAverage: 82, trend: "+1%", teacher: "Mrs. Lopez", status: "above" },
    ],
    "2nd Quarter": [
        { subject: "Mathematics", grade: 92, classAverage: 84, trend: "+4%", teacher: "Ms. Reyes", status: "above" },
        { subject: "Science", grade: 78, classAverage: 82, trend: "-3%", teacher: "Mr. Santos", status: "below" },
        { subject: "English", grade: 90, classAverage: 85, trend: "+3%", teacher: "Mrs. Lopez", status: "above" },
        { subject: "History", grade: 88, classAverage: 80, trend: "+3%", teacher: "Mr. Gonzales", status: "above" },
        { subject: "Physical Education", grade: 95, classAverage: 88, trend: "+2%", teacher: "Ms. Torres", status: "above" },
    ],
    "3rd Quarter": [
        { subject: "Mathematics", grade: 90, classAverage: 83, trend: "0%", teacher: "Ms. Reyes", status: "above" },
        { subject: "Science", grade: 80, classAverage: 81, trend: "+2%", teacher: "Mr. Santos", status: "above" },
        { subject: "English", grade: 87, classAverage: 84, trend: "-1%", teacher: "Mrs. Lopez", status: "above" },
        { subject: "Art", grade: 93, classAverage: 89, trend: "+5%", teacher: "Mr. Dela Cruz", status: "above" },
    ],
    "4th Quarter": [], // Example of an empty quarter
};

const quarterlyAverages = {
    "1st Quarter": 84.3,
    "2nd Quarter": 89.4,
    "3rd Quarter": 87.5,
    "4th Quarter": 0, // Or null/undefined if no data
};

const honorsEligibilityStatus = {
    "1st Quarter": false,
    "2nd Quarter": true,
    "3rd Quarter": true,
    "4th Quarter": false,
};

// --- ACHIEVEMENTS DATA ---
const achievementsData = {
    academicAwards: [
        {
            id: 1,
            title: "Honor Roll",
            quarter: "Q3",
            description: "For maintaining an average of 90% or above for the 3rd Quarter",
            issuedDate: "March 15, 2023",
            issuedBy: "Principal",
            category: "Academic"
        }
    ],
    attendanceAwards: [
        {
            id: 2,
            title: "Perfect Attendance",
            quarter: "Q2",
            description: "For 100% attendance during the 2nd Quarter",
            issuedDate: "December 20, 2022",
            issuedBy: "Principal",
            category: "Attendance"
        }
    ],
    competitionAwards: [
        {
            id: 3,
            title: "Science Fair Winner",
            quarter: "Q2",
            description: "1st Place in School Science Fair Competition",
            issuedDate: "November 10, 2022",
            issuedBy: "Science Department",
            category: "Competition"
        }
    ]
};

const availableCertificates = [
    {
        id: 1,
        title: "Honor Roll Certificate",
        description: "For maintaining an average of 90% or above for the 3rd Quarter",
        issuedDate: "March 15, 2023",
        issuedBy: "Principal",
        category: "Academic",
        canDownload: true,
        canShare: true
    },
    {
        id: 2,
        title: "Perfect Attendance Certificate",
        description: "For 100% attendance during the 2nd Quarter",
        issuedDate: "December 20, 2022",
        issuedBy: "Principal",
        category: "Attendance",
        canDownload: true,
        canShare: true
    }
];

// --- ATTENDANCE DATA ---
const allAttendanceData = {
    "January 2023": {
        attendanceRate: 95,
        lateArrivals: 1,
        lateArrivalsNote: "No specific pattern",
        lateArrivalsDelay: "5 minutes average delay",
        absences: 0,
        absencesNote: "",
    },
    "February 2023": {
        attendanceRate: 90,
        lateArrivals: 2,
        lateArrivalsNote: "Occasional delays",
        lateArrivalsDelay: "8 minutes average delay",
        absences: 1,
        absencesNote: "Excused",
    },
    "March 2023": {
        attendanceRate: 98,
        lateArrivals: 0,
        lateArrivalsNote: "",
        lateArrivalsDelay: "0 minutes average delay",
        absences: 0,
        absencesNote: "",
    },
    "April 2023": {
        attendanceRate: 88,
        lateArrivals: 5,
        lateArrivalsNote: "Pattern on Fridays",
        lateArrivalsDelay: "15 minutes average delay",
        absences: 2,
        absencesNote: "1 Not excused",
    },
    "May 2023": {
        attendanceRate: 93,
        lateArrivals: 2,
        lateArrivalsNote: "No specific pattern",
        lateArrivalsDelay: "7 minutes average delay",
        absences: 0,
        absencesNote: "",
    },
    "June 2023": {
        attendanceRate: 92,
        lateArrivals: 3,
        lateArrivalsNote: "Pattern on Mondays",
        lateArrivalsDelay: "10 minutes average delay",
        absences: 1,
        absencesNote: "Not excused",
    },
    "July 2023": {
        attendanceRate: 85,
        lateArrivals: 4,
        lateArrivalsNote: "Frequent delays",
        lateArrivalsDelay: "12 minutes average delay",
        absences: 3,
        absencesNote: "2 Not excused",
    },
};

const schoolYearOptions = [
    "2022-2023",
    "2021-2022",
    "2020-2021"
];

// --- End Dummy Data ---

export const useStoreUser = create((set, get) => ({
    // =============
    // GRADES STATE
    // =============
    quarterOptions: ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"],
    selectedQuarter: "2nd Quarter", // Initial selected quarter
    gradesData: allGradesData["2nd Quarter"] || [], // Initial grades data based on default selectedQuarter
    quarterlyAverage: quarterlyAverages["2nd Quarter"] || 0, // Initial average
    honorsEligibility: honorsEligibilityStatus["2nd Quarter"] || false, // Initial honors status
    gradesLoading: false, // For potential future API calls
    gradesError: null, // For potential future API calls

    // ===================
    // ACHIEVEMENTS STATE
    // ===================
    schoolYearOptions,
    selectedSchoolYear: "2022-2023",
    academicAwards: achievementsData.academicAwards,
    attendanceAwards: achievementsData.attendanceAwards,
    competitionAwards: achievementsData.competitionAwards,
    availableCertificates,
    achievementsLoading: false,
    achievementsError: null,

    // ==================
    // ATTENDANCE STATE
    // ==================
    monthOptions: Object.keys(allAttendanceData), // Derived from dummy data keys
    selectedMonth: "June 2023", // Initial selected month, matching the image
    attendanceLoading: false,
    attendanceError: null,

    // =============
    // GRADES ACTIONS
    // =============
    setSelectedQuarter: (quarter) => {
        // Update the selected quarter and derive associated data
        set({
            selectedQuarter: quarter,
            gradesData: allGradesData[quarter] || [], // Get grades for the new quarter
            quarterlyAverage: quarterlyAverages[quarter] || 0, // Get average for the new quarter
            honorsEligibility: honorsEligibilityStatus[quarter] || false, // Get honors status for the new quarter
        });
    },

    fetchGrades: async (quarter) => {
        set({ gradesLoading: true, gradesError: null });
        try {
            // This would be your API call
            // const response = await api.getGrades(quarter);
            // set({ 
            //     gradesData: response.grades,
            //     quarterlyAverage: response.average,
            //     honorsEligibility: response.honorsEligibility,
            //     gradesLoading: false 
            // });
            
            // For now, simulate API delay
            setTimeout(() => {
                set({ gradesLoading: false });
            }, 1000);
        } catch (error) {
            set({ gradesError: error.message, gradesLoading: false });
        }
    },

    clearGradesError: () => set({ gradesError: null }),

    // ===================
    // ACHIEVEMENTS ACTIONS
    // ===================

    // Computed values for achievements
    get totalAcademicAwards() {
        return get().academicAwards.length;
    },
    get totalAttendanceAwards() {
        return get().attendanceAwards.length;
    },
    get totalCompetitionAwards() {
        return get().competitionAwards.length;
    },

    setSelectedSchoolYear: (year) => {
        set({ selectedSchoolYear: year });
        // In a real app, this would trigger an API call to fetch data for the selected year
        // For now, we'll just use the same dummy data
    },

    downloadCertificate: (certificateId) => {
        // In a real app, this would trigger a download
        console.log(`Downloading certificate with ID: ${certificateId}`);
        // You could implement actual download logic here
    },

    shareCertificate: (certificateId) => {
        // In a real app, this would open share options
        console.log(`Sharing certificate with ID: ${certificateId}`);
        // You could implement social sharing or copy link functionality here
    },

    fetchAchievements: async (schoolYear) => {
        set({ achievementsLoading: true, achievementsError: null });
        try {
            // This would be your API call
            // const response = await api.getAchievements(schoolYear);
            // set({ 
            //     academicAwards: response.academicAwards,
            //     attendanceAwards: response.attendanceAwards,
            //     competitionAwards: response.competitionAwards,
            //     availableCertificates: response.certificates,
            //     achievementsLoading: false 
            // });
            
            // For now, simulate API delay
            setTimeout(() => {
                set({ achievementsLoading: false });
            }, 1000);
        } catch (error) {
            set({ achievementsError: error.message, achievementsLoading: false });
        }
    },

    clearAchievementsError: () => set({ achievementsError: null }),

    // ==================
    // ATTENDANCE ACTIONS
    // ==================
    
    // Derived state (getter function) for current month's data
    getCurrentMonthData: () => {
        const { selectedMonth } = get();
        return (
            allAttendanceData[selectedMonth] || {
                attendanceRate: 0,
                lateArrivals: 0,
                lateArrivalsNote: "",
                lateArrivalsDelay: "",
                absences: 0,
                absencesNote: "",
            }
        );
    },

    setSelectedMonth: (month) => {
        set({ selectedMonth: month });
    },

    fetchAttendanceData: async (month) => {
        set({ attendanceLoading: true, attendanceError: null });
        try {
            // This would be your API call
            // const response = await api.getAttendanceData(month);
            // set({ 
            //     selectedMonth: month,
            //     attendanceLoading: false 
            // });
            
            // For now, simulate API delay
            setTimeout(() => {
                set({ attendanceLoading: false });
            }, 500);
        } catch (error) {
            set({ attendanceError: error.message, attendanceLoading: false });
        }
    },

    clearAttendanceError: () => set({ attendanceError: null }),

    // =================
    // UTILITY METHODS
    // =================
    
    // Reset all data (useful for logout or user switching)
    resetUserData: () => {
        set({
            // Reset grades
            selectedQuarter: "2nd Quarter",
            gradesData: allGradesData["2nd Quarter"] || [],
            quarterlyAverage: quarterlyAverages["2nd Quarter"] || 0,
            honorsEligibility: honorsEligibilityStatus["2nd Quarter"] || false,
            gradesLoading: false,
            gradesError: null,

            // Reset achievements
            selectedSchoolYear: "2022-2023",
            academicAwards: achievementsData.academicAwards,
            attendanceAwards: achievementsData.attendanceAwards,
            competitionAwards: achievementsData.competitionAwards,
            availableCertificates,
            achievementsLoading: false,
            achievementsError: null,

            // Reset attendance
            selectedMonth: "June 2023",
            attendanceLoading: false,
            attendanceError: null,
        });
    },

    // Initialize user data (useful for login or app start)
    initializeUserData: async (userId) => {
        set({ 
            gradesLoading: true, 
            achievementsLoading: true, 
            attendanceLoading: true 
        });
        try {
            // This would be your API calls
            // const [gradesResponse, achievementsResponse, attendanceResponse] = await Promise.all([
            //     api.getGrades(userId),
            //     api.getAchievements(userId),
            //     api.getAttendanceData(userId)
            // ]);

            // For now, just simulate loading
            setTimeout(() => {
                set({
                    gradesLoading: false,
                    achievementsLoading: false,
                    attendanceLoading: false,
                });
            }, 1500);
        } catch (error) {
            set({
                gradesError: error.message,
                achievementsError: error.message,
                attendanceError: error.message,
                gradesLoading: false,
                achievementsLoading: false,
                attendanceLoading: false,
            });
        }
    },
}));