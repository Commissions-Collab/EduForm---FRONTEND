import React, { useState, useMemo, useEffect } from "react";
import {
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuLoader,
  LuSquare,
  LuUsers,
  LuEye,
  LuCheck,
} from "react-icons/lu";
import { getStatusButtonStyle } from "./ButtonStatus";
import { reasons } from "../../constants";
import PaginationControls from "./Pagination";
import { useNavigate } from "react-router-dom";
import { getItem } from "../../lib/utils";
import { useAdminStore } from "../../stores/admin";
const RECORDS_PER_PAGE = 10;

const AttendanceTable = ({ selectedDate, selectedSchedule }) => {
  const {
    scheduleAttendance,
    updateIndividualAttendance,
    updateBulkAttendance,
    fetchScheduleAttendance,
    loading,
    error,
    globalFilters,
  } = useAdminStore();

  const filters = globalFilters || {};
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [localAttendanceState, setLocalAttendanceState] = useState({});
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState("present");
  const [bulkReason, setBulkReason] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Extract students into records
  const records = useMemo(() => {
    const students = scheduleAttendance?.students || [];
    return students.map((student) => ({
      student_id: student.id,
      name: student.name || `${student.first_name} ${student.last_name}`.trim(),
      first_name: student.first_name,
      last_name: student.last_name,
      status:
        localAttendanceState[student.id]?.status ||
        student.attendance_status ||
        "present",
      reason:
        localAttendanceState[student.id]?.reason ||
        student.attendance_reason ||
        "",
    }));
  }, [scheduleAttendance, localAttendanceState]);

  // Pagination
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const paginatedRecords = records.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const handleViewHistory = (studentId) => {
    if (selectedSchedule?.id) {
      navigate(
        `/teacher/student/${studentId}/schedule/${scheduleId}/attendance-history`
      );
    }
  };

  const setStatus = async (studentId, status) => {
    if (!selectedSchedule?.id) return;

    setLocalAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        reason: status === "absent" ? prev[studentId]?.reason || "" : "",
      },
    }));

    try {
      await updateIndividualAttendance({
        student_id: studentId,
        schedule_id: selectedSchedule.id,
        status,
        date: selectedDate,
        reason:
          status === "absent"
            ? localAttendanceState[studentId]?.reason || ""
            : "",
      });

      // Refresh data
      if (filters.sectionId && filters.academicYearId && filters.quarterId) {
        fetchScheduleAttendance({
          scheduleId: selectedSchedule.id,
          sectionId: filters.sectionId,
          academicYearId: filters.academicYearId,
          quarterId: filters.quarterId,
          date: selectedDate,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const setReason = async (studentId, reason) => {
    if (!selectedSchedule?.id) return;

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
        "present";

      await updateIndividualAttendance({
        student_id: studentId,
        schedule_id: selectedSchedule.id,
        status: currentStatus,
        date: selectedDate,
        reason,
      });
    } catch (error) {
      console.error("Failed to update reason:", error);
    }
  };

  // Bulk selection handlers
  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === paginatedRecords.length) {
      setSelectedStudents(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(paginatedRecords.map((r) => r.student_id));
      setSelectedStudents(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedStudents.size === 0 || !selectedSchedule?.id) return;

    try {
      const attendances = Array.from(selectedStudents).map((studentId) => ({
        student_id: studentId,
        status: bulkStatus,
        reason: bulkStatus === "absent" ? bulkReason : "",
      }));

      await updateBulkAttendance({
        schedule_id: selectedSchedule.id,
        attendance_date: selectedDate,
        attendances,
      });

      // Clear selection and refresh
      setSelectedStudents(new Set());
      setShowBulkActions(false);
      setBulkReason("");

      // Refresh data
      if (filters.sectionId && filters.academicYearId && filters.quarterId) {
        fetchScheduleAttendance({
          scheduleId: selectedSchedule.id,
          sectionId: filters.sectionId,
          academicYearId: filters.academicYearId,
          quarterId: filters.quarterId,
          date: selectedDate,
        });
      }
    } catch (error) {
      console.error("Failed to update bulk attendance:", error);
    }
  };

  const hasRecords = paginatedRecords.length > 0;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedStudents.size} student
                {selectedStudents.size !== 1 ? "s" : ""} selected
              </span>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-blue-700">Status:</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="text-sm border border-blue-300 rounded px-2 py-1"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>

              {bulkStatus === "absent" && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-blue-700">Reason:</label>
                  <select
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="text-sm border border-blue-300 rounded px-2 py-1"
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason, idx) => (
                      <option key={idx} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Update Selected
              </button>
              <button
                onClick={() => {
                  setSelectedStudents(new Set());
                  setShowBulkActions(false);
                }}
                className="px-3 py-2 text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                >
                  {selectedStudents.size === paginatedRecords.length &&
                  paginatedRecords.length > 0 ? (
                    <LuCheckCheck size={16} />
                  ) : (
                    <LuSquare size={16} />
                  )}
                  <span>Select All</span>
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64">
                    <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-red-600 font-medium">
                    {error}
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-gray-600 font-medium">
                    No attendance records available.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((student) => (
                <tr
                  key={student.student_id}
                  className={
                    selectedStudents.has(student.student_id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleSelectStudent(student.student_id)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      {selectedStudents.has(student.student_id) ? (
                        <LuCheck size={18} className="text-blue-600" />
                      ) : (
                        <LuSquare size={18} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex justify-center space-x-2">
                      {["present", "absent", "late"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatus(student.student_id, status)}
                          className={`p-1 rounded-full transition-all ${getStatusButtonStyle(
                            student.status,
                            status
                          )}`}
                          title={
                            status.charAt(0).toUpperCase() + status.slice(1)
                          }
                        >
                          {status === "present" && (
                            <LuCircleCheck className="w-8 h-8" />
                          )}
                          {status === "absent" && (
                            <LuCircleX className="w-8 h-8" />
                          )}
                          {status === "late" && <LuClock className="w-8 h-8" />}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    {student.status === "absent" ? (
                      <select
                        value={student.reason || ""}
                        onChange={(e) =>
                          setReason(student.student_id, e.target.value)
                        }
                        className="w-36 p-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Reason</option>
                        {reasons.map((reason, idx) => (
                          <option key={idx} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    <button
                      onClick={() => handleViewHistory(student.student_id)}
                      className="inline-flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="View attendance history"
                    >
                      <LuEye size={14} />
                      <span className="ml-1">History</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && hasRecords && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          onNext={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        />
      )}

      {/* Selection Summary */}
      {selectedStudents.size > 0 && (
        <div className="text-sm text-gray-600 text-center">
          {selectedStudents.size} of {records.length} students selected
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
