import React, { useState } from "react";
import { adminCards, attendanceList } from "../../constants";
import { FaCircle } from "react-icons/fa";
import AttendanceTable from "../../components/admin/AttendanceTable";

const Attendance = () => {
  const statusColors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-400",
  };

  const attendanceData = adminCards[0].data;

  // full attendance records state here
  const [attendanceRecords, setAttendanceRecords] = useState(attendanceList);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const RECORDS_PER_PAGE = 10;
  const totalPages = Math.ceil(attendanceRecords.length / RECORDS_PER_PAGE);

  const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  const currentRecords = attendanceRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Status handler
  const handleStatusClick = (id, value) => {
    const updatedRecords = attendanceRecords.map((student) =>
      student.id === id
        ? {
            ...student,
            status: value,
            reason: value === "Present" ? "" : student.reason,
          }
        : student
    );
    setAttendanceRecords(updatedRecords);
  };

  // Reason handler
  const handleReasonChange = (id, value) => {
    const updatedRecords = attendanceRecords.map((student) =>
      student.id === id ? { ...student, reason: value } : student
    );
    setAttendanceRecords(updatedRecords);
  };

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Daily Attendance (SF2): Grade 10-A</div>
        <div className="flex items-center gap-2">
          <div className="items-center">Date:</div>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mt-10 shad-container p-5 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Attendance Summary</h2>
        </div>

        <div className="text-sm flex justify-between gap-4">
          {Object.entries(attendanceData).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusColors[key]}`} />
              <p className="capitalize">{key}</p>
              <span className="text-gray-800 font-medium">({value.count})</span>
              <span className="text-gray-600">({value.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AttendanceTable
          records={currentRecords}
          onStatusClick={handleStatusClick}
          onReasonChange={handleReasonChange}
        />
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Attendance;
