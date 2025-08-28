// src/components/admin/AttendanceTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import { LuCircleCheck, LuCircleX, LuClock, LuLoader } from "react-icons/lu";
import { getStatusButtonStyle } from "./ButtonStatus";
import { reasons } from "../../constants";
import PaginationControls from "./Pagination";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../lib/utils";
import { useAdminStore } from "../../stores/useAdminStore";

const RECORDS_PER_PAGE = 5;

const AttendanceTable = ({ selectedDate }) => {
  const {
    scheduleAttendance,
    updateIndividualAttendance,
    fetchScheduleAttendance, // <-- make sure this exists in your store
    loading,
    error,
    selectedSection,
    selectedAcademicYear,
    selectedQuarter,
  } = useAdminStore();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [localAttendanceState, setLocalAttendanceState] = useState({});

  // 🔹 Refetch whenever global filters change
  useEffect(() => {
    const scheduleId = getItem("scheduleId", false);
    const attendanceDate =
      selectedDate ||
      getItem("attendanceDate", false) ||
      new Date().toISOString().split("T")[0];

    if (
      scheduleId &&
      selectedSection &&
      selectedAcademicYear &&
      selectedQuarter
    ) {
      fetchScheduleAttendance({
        scheduleId,
        sectionId: selectedSection,
        academicYearId: selectedAcademicYear,
        quarterId: selectedQuarter,
        date: attendanceDate,
      });
    }
  }, [
    selectedDate,
    selectedSection,
    selectedAcademicYear,
    selectedQuarter,
    fetchScheduleAttendance,
  ]);

  // Extract students into records
  const records = useMemo(() => {
    const students = scheduleAttendance?.students || [];
    return students.map((student) => ({
      student_id: student.id,
      name: student.name || `${student.first_name} ${student.last_name}`.trim(),
      status:
        localAttendanceState[student.id]?.status ||
        student.attendance_status ||
        "Present",
      reason:
        localAttendanceState[student.id]?.reason ||
        student.attendance_reason ||
        "",
    }));
  }, [scheduleAttendance, localAttendanceState]);

  const handleViewHistory = (studentId) => {
    const scheduleId = getItem("scheduleId", false);
    if (scheduleId) {
      navigate(`/teacher/attendance/history/${scheduleId}/${studentId}`);
    }
  };

  const setStatus = async (studentId, status) => {
    const scheduleId = getItem("scheduleId", false);
    const attendanceDate =
      selectedDate ||
      getItem("attendanceDate", false) ||
      new Date().toISOString().split("T")[0];

    if (!scheduleId) return;

    setLocalAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        reason: status === "Absent" ? prev[studentId]?.reason || "" : "",
      },
    }));

    try {
      await updateIndividualAttendance({
        student_id: studentId,
        schedule_id: scheduleId,
        status,
        date: attendanceDate,
        reason:
          status === "Absent"
            ? localAttendanceState[studentId]?.reason || ""
            : "",
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const setReason = async (studentId, reason) => {
    const scheduleId = getItem("scheduleId", false);
    const attendanceDate =
      selectedDate ||
      getItem("attendanceDate", false) ||
      new Date().toISOString().split("T")[0];

    if (!scheduleId) return;

    setLocalAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason,
      },
    }));

    try {
      const currentStatus =
        localAttendanceState[studentId]?.status ||
        records.find((r) => r.student_id === studentId)?.status ||
        "Present";

      await updateIndividualAttendance({
        student_id: studentId,
        schedule_id: scheduleId,
        status: currentStatus,
        date: attendanceDate,
        reason,
      });
    } catch (error) {
      console.error("Failed to update reason:", error);
    }
  };

  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const paginatedRecords = records.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const hasRecords = paginatedRecords.length > 0;

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64">
                    <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64 text-red-600 font-medium">
                    {error}
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64 text-gray-600 font-medium">
                    No attendance records available.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((student) => (
                <tr key={student.student_id}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 text-sm flex justify-center space-x-2">
                    {["Present", "Absent", "Late"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatus(student.student_id, status)}
                        className={`p-1 rounded-full ${getStatusButtonStyle(
                          student.status,
                          status
                        )}`}
                        title={status}
                      >
                        {status === "Present" && (
                          <LuCircleCheck className="w-9 h-9" />
                        )}
                        {status === "Absent" && (
                          <LuCircleX className="w-9 h-9" />
                        )}
                        {status === "Late" && <LuClock className="w-9 h-9" />}
                      </button>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    {student.status === "Absent" ? (
                      <select
                        value={student.reason || ""}
                        onChange={(e) =>
                          setReason(student.student_id, e.target.value)
                        }
                        className="w-36 p-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Reason</option>
                        {reasons.map((reason, idx) => (
                          <option key={idx} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-blue-600 hover:underline cursor-pointer">
                    <button
                      onClick={() => handleViewHistory(student.student_id)}
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && hasRecords && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          onNext={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        />
      )}
    </>
  );
};

export default AttendanceTable;
