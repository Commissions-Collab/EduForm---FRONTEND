// src/stores/useAttendanceStore.js
import { create } from "zustand";

// --- Dummy Data (Ideally, this would come from an API or a larger constant file) ---
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
  "June 2023": { // Data matching the image
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
// --- End Dummy Data ---


export const useAttendanceStoreUser = create((set, get) => ({
  // State
  monthOptions: Object.keys(allAttendanceData), // Derived from dummy data keys
  selectedMonth: "June 2023", // Initial selected month, matching the image

  // Derived state (getter function) for current month's data
  getCurrentMonthData: () => {
    const { selectedMonth } = get();
    return allAttendanceData[selectedMonth] || {
      attendanceRate: 0,
      lateArrivals: 0,
      lateArrivalsNote: "",
      lateArrivalsDelay: "",
      absences: 0,
      absencesNote: "",
    };
  },

  // Actions
  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
  },

  // Optional: If you plan to fetch data from an API
  // fetchAttendanceData: async (month) => {
  //   set({ loading: true, error: null });
  //   try {
  //     // Simulate API call
  //     const response = await new Promise(resolve => setTimeout(() => {
  //       const data = allAttendanceData[month] || {};
  //       resolve({ json: () => data });
  //     }, 500)); // Simulate network delay
  //
  //     const data = await response.json();
  //     // You might need to update other parts of the state if the API returns more
  //     // For simplicity, directly updating the selectedMonth will trigger getCurrentMonthData
  //     set({ loading: false });
  //   } catch (err) {
  //     set({ error: err.message, loading: false });
  //   }
  // },
}));