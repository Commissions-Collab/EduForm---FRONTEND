// src/components/UserComponents/AttendanceCards.jsx
import React from "react";
import { LuTriangleAlert, LuCircleX } from "react-icons/lu";
import { useStoreUser } from "../../stores/useStoreUser";

const AttendanceCards = () => {
  // Destructure state and actions from the Zustand store
    const {
        monthOptions,
        selectedMonth,
        setSelectedMonth,
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
        <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4"> {/* Lessened mb and pb */}
            <h2 className="text-md sm:text-lg lg:text-1xl font-bold text-gray-800 mb-4 sm:mb-0">
            Attendance Records (SF2/SF4)
            </h2>
            <div className="flex items-center gap-2">
            <span className="text-gray-600">Month: </span>
            <select
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
            >
                {monthOptions.map((month, index) => (
                <option key={index} value={month}>
                    {month}
                </option>
                ))}
            </select>
            </div>
        </div>

        <div className="container mx-auto"> {/* Lessened padding here */}
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"> {/* Lessened gap and mt */}
            {/* Attendance Rate Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"> {/* Lessened p */}
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
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"> {/* Lessened p */}
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
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"> {/* Lessened p */}
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Absences
            </h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
                {currentMonthData.absences}
            </p>
            {currentMonthData.absencesNote && (
                <p className={`flex items-center text-sm mb-1 ${currentMonthData.absencesNote.includes('Not excused') ? 'text-red-600' : 'text-gray-600'}`}>
                {currentMonthData.absencesNote.includes('Not excused') && <LuCircleX className="w-4 h-4 mr-1" />}
                {currentMonthData.absencesNote}
                </p>
            )}
            {currentMonthData.absencesNote.includes('Not excused') && (
                <p className="text-sm text-gray-500">
                Submit excuse within 3 days
                </p>
            )}
            </div>
        </div>
        </div>
        </>
    );
};

export default AttendanceCards;