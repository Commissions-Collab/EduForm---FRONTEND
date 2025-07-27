import React from "react";
import { LuTriangleAlert, LuCircleX } from "react-icons/lu";
import { useStoreUser } from "../../stores/useStoreUser";

const AttendanceCards = () => {
    // Destructure state and actions from the Zustand store
    const {
        getCurrentMonthData, // Use the getter for current month's data
        // loading, // If you implement loading in the store
        // error,   // If you implement error in the store
        // fetchAttendanceData, // If you implement fetching
    } = useStoreUser(); // Ensure this matches your store filename

    const currentMonthData = getCurrentMonthData(); // Get the data for the selected month

    // Uncomment this if you want to fetch items from an API on component mount
    // useEffect(() => {
    //   fetchAttendanceData(selectedMonth);
    // }, [fetchAttendanceData, selectedMonth]);

    return (
        <div className="container mx-auto">
        {" "}
        {/* Lessened padding here */}
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {" "}
            {/* Lessened gap and mt */}
            {/* Attendance Rate Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            {" "}
            {/* Lessened p */}
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Attendance Rate
            </h3>
            <p className="text-4xl font-bold text-gray-900 mb-4">
                {currentMonthData.attendanceRate}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${currentMonthData.attendanceRate}%` }}
                ></div>
            </div>
            </div>
            {/* Late Arrivals Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            {" "}
            {/* Lessened p */}
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Late Arrivals
            </h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
                {currentMonthData.lateArrivals}
            </p>
            {currentMonthData.lateArrivalsNote && (
                <p className="flex items-center text-sm text-yellow-600 mb-1">
                <LuTriangleAlert className="w-4 h-4 mr-1" />
                {currentMonthData.lateArrivalsNote}
                </p>
            )}
            {currentMonthData.lateArrivalsDelay && (
                <p className="text-sm text-gray-500">
                {currentMonthData.lateArrivalsDelay}
                </p>
            )}
            </div>
            {/* Absences Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            {" "}
            {/* Lessened p */}
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Absences
            </h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
                {currentMonthData.absences}
            </p>
            {currentMonthData.absencesNote && (
                <p
                className={`flex items-center text-sm mb-1 ${
                    currentMonthData.absencesNote.includes("Not excused")
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
                >
                {currentMonthData.absencesNote.includes("Not excused") && (
                    <LuCircleX className="w-4 h-4 mr-1" />
                )}
                {currentMonthData.absencesNote}
                </p>
            )}
            {currentMonthData.absencesNote.includes("Not excused") && (
                <p className="text-sm text-gray-500">
                Submit excuse within 3 days
                </p>
            )}
            </div>
        </div>
        </div>
    );
};

export default AttendanceCards;