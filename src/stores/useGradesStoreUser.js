// src/store/useGradesStoreUser.js
import { create } from "zustand";

// --- Dummy Data (Ideally, this would come from an API or a larger constant file) ---
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
    // --- End Dummy Data ---


    export const useGradesStoreUser = create((set, get) => ({
    // State
    quarterOptions: ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"],
    selectedQuarter: "2nd Quarter", // Initial selected quarter
    gradesData: allGradesData["2nd Quarter"] || [], // Initial grades data based on default selectedQuarter
    quarterlyAverage: quarterlyAverages["2nd Quarter"] || 0, // Initial average
    honorsEligibility: honorsEligibilityStatus["2nd Quarter"] || false, // Initial honors status
    loading: false, // For potential future API calls
    error: null,    // For potential future API calls

    // Actions
    setSelectedQuarter: (quarter) => {
        // Update the selected quarter and derive associated data
        set({
        selectedQuarter: quarter,
        gradesData: allGradesData[quarter] || [], // Get grades for the new quarter
        quarterlyAverage: quarterlyAverages[quarter] || 0, // Get average for the new quarter
        honorsEligibility: honorsEligibilityStatus[quarter] || false, // Get honors status for the new quarter
        });
    },

  // Optional: If you plan to fetch data from an API
  // fetchGrades: async (quarter) => {
  //   set({ loading: true, error: null });
  //   try {
  //     // Simulate API call
  //     const response = await new Promise(resolve => setTimeout(() => {
  //       const data = {
  //         grades: allGradesData[quarter] || [],
  //         average: quarterlyAverages[quarter] || 0,
  //         honors: honorsEligibilityStatus[quarter] || false,
  //       };
  //       resolve({ json: () => data });
  //     }, 500)); // Simulate network delay
  //
  //     const data = await response.json();
  //     set({
  //       gradesData: data.grades,
  //       quarterlyAverage: data.average,
  //       honorsEligibility: data.honors,
  //       loading: false,
  //     });
  //   } catch (err) {
  //     set({ error: err.message, loading: false });
  //   }
  // },
}));