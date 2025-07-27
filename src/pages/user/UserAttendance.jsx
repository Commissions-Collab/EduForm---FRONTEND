import React from "react";
import AttendanceCards from "../../components/user/AttendanceCards";
import { useStoreUser } from "../../stores/useStoreUser"; // Import useStoreUser

const UserAttendance = () => {
  const { monthOptions, selectedMonth, setSelectedMonth } = useStoreUser(); // Destructure from the store

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
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

      {/* You can add other components or content specific to the User Attendance page here */}
      <AttendanceCards />
    </div>
  );
};

export default UserAttendance;