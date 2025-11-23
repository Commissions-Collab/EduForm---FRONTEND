import React, { useState, useMemo, useEffect } from "react";
import {
  CircleCheck,
  CircleX,
  Clock,
  Square,
  Eye,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";
import { getStatusButtonStyle } from "./ButtonStatus";
import { reasons } from "../../constants";
import PaginationControls from "./Pagination";
import { useNavigate } from "react-router-dom";
import useAttendanceStore from "../../stores/admin/attendanceStore";
import useFilterStore from "../../stores/admin/filterStore";
import toast from "react-hot-toast";

const RECORDS_PER_PAGE = 10;

const AttendanceTable = ({ selectedDate, selectedSchedule }) => {
  const navigate = useNavigate();
  const {
    scheduleAttendance,
    updateIndividualAttendance,
    updateBulkAttendance,
    fetchScheduleAttendance,
    fetchTardinessStats,
    loading,
    error,
  } = useAttendanceStore();

  const { globalFilters } = useFilterStore();

  const [localAttendanceState, setLocalAttendanceState] = useState({});
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("present");
  const [bulkReason, setBulkReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tardinessWarnings, setTardinessWarnings] = useState({});

  const records = useMemo(() => {
    return scheduleAttendance?.students || [];
  }, [scheduleAttendance]);

  const hasRecords = records.length > 0;

  // Initialize local state from server data
  useEffect(() => {
    if (records.length > 0) {
      const initialState = {};
      records.forEach((student) => {
        initialState[student.id] = {
          status: student.attendance?.status || "present",
          reason: student.attendance?.remarks || "",
        };
      });
      setLocalAttendanceState(initialState);
    }
  }, [records]);

  // Check for tardiness warnings when component mounts or schedule changes
  useEffect(() => {
    if (selectedSchedule?.id && records.length > 0) {
      records.forEach((student) => {
        if (student.attendance?.status === "late") {
          checkTardinessWarning(student.id);
        }
      });
    }
  }, [selectedSchedule, records]);

  // Check for tardiness warnings when marking late
  const checkTardinessWarning = async (studentId) => {
    if (!selectedSchedule?.id || !globalFilters.academicYearId) return;

    try {
      const data = await fetchTardinessStats(studentId, selectedSchedule.id);

      if (data?.tardiness_stats?.subjects) {
        const subjectStats = data.tardiness_stats.subjects.find(
          (s) => s.subject_id === selectedSchedule.subject?.id
        );

        if (subjectStats) {
          setTardinessWarnings((prev) => ({
            ...prev,
            [studentId]: {
              lateCount: subjectStats.late_count,
              atRisk: subjectStats.at_risk,
              remainingLates: subjectStats.remaining_lates,
              willConvert: subjectStats.late_count >= 4, // Next late will be converted
            },
          }));
        }
      }
    } catch (error) {
      console.error("Failed to check tardiness:", error);
    }
  };

  const setStatus = async (studentId, status) => {
    if (!selectedSchedule?.id) return;

    // Check tardiness before applying
    if (status === "late") {
      await checkTardinessWarning(studentId);
    }

    setLocalAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        reason: status === "absent" ? prev[studentId]?.reason || "" : "",
      },
    }));

    try {
      const response = await updateIndividualAttendance({
        student_id: studentId,
        schedule_id: selectedSchedule.id,
        status,
        date: selectedDate,
        reason:
          status === "absent"
            ? localAttendanceState[studentId]?.reason || ""
            : "",
      });

      // Check for tardiness conversion warning
      if (response?.tardiness_conversion) {
        // Warning already shown by store, update local state
        setLocalAttendanceState((prev) => ({
          ...prev,
          [studentId]: {
            ...prev[studentId],
            status: "absent", // Update to reflect conversion
          },
        }));
      }

      // Refresh attendance data
      if (
        globalFilters.sectionId &&
        globalFilters.academicYearId &&
        globalFilters.quarterId
      ) {
        await fetchScheduleAttendance({
          scheduleId: selectedSchedule.id,
          sectionId: globalFilters.sectionId,
          academicYearId: globalFilters.academicYearId,
          quarterId: globalFilters.quarterId,
          date: selectedDate,
        });
      }

      // Refresh tardiness warning after update
      if (status === "late" || status === "absent") {
        await checkTardinessWarning(studentId);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert local state on error
      setLocalAttendanceState((prev) => ({
        ...prev,
        [studentId]: {
          status:
            records.find((r) => r.id === studentId)?.attendance?.status ||
            "present",
          reason:
            records.find((r) => r.id === studentId)?.attendance?.remarks || "",
        },
      }));
    }
  };

  const setReason = (studentId, reason) => {
    setLocalAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason,
      },
    }));
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === records.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(records.map((s) => s.id)));
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

      const response = await updateBulkAttendance({
        schedule_id: selectedSchedule.id,
        attendance_date: selectedDate,
        attendances,
      });

      // Check for tardiness conversions
      if (
        response?.tardiness_conversions &&
        response.tardiness_conversions.length > 0
      ) {
        // Warning already shown by store
        // Refresh tardiness warnings for affected students
        response.tardiness_conversions.forEach((tc) => {
          checkTardinessWarning(tc.student_id);
        });
      }

      setSelectedStudents(new Set());
      setShowBulkActions(false);
      setBulkReason("");

      // Refresh attendance data
      if (
        globalFilters.sectionId &&
        globalFilters.academicYearId &&
        globalFilters.quarterId
      ) {
        await fetchScheduleAttendance({
          scheduleId: selectedSchedule.id,
          sectionId: globalFilters.sectionId,
          academicYearId: globalFilters.academicYearId,
          quarterId: globalFilters.quarterId,
          date: selectedDate,
        });
      }
    } catch (error) {
      console.error("Failed to update bulk attendance:", error);
    }
  };

  const handleViewHistory = (studentId) => {
    navigate(
      `/teacher/attendance/history?student=${studentId}&schedule=${selectedSchedule.id}`
    );
  };

  // Pagination
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    const end = start + RECORDS_PER_PAGE;
    return records.slice(start, end);
  }, [records, currentPage]);

  // Get current status from local state or fallback to server data
  const getStudentStatus = (student) => {
    return (
      localAttendanceState[student.id]?.status ||
      student.attendance?.status ||
      "present"
    );
  };

  const getStudentReason = (student) => {
    return (
      localAttendanceState[student.id]?.reason ||
      student.attendance?.remarks ||
      ""
    );
  };

  // Render tardiness indicator
  const renderTardinessIndicator = (studentId, status) => {
    if (status !== "late") return null;

    const warning = tardinessWarnings[studentId];
    if (!warning) return null;

    if (warning.willConvert) {
      return (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-1 font-medium">
          <AlertTriangle size={14} />
          <span>
            CRITICAL: {warning.lateCount} late(s) - Next late will be ABSENT!
          </span>
        </div>
      );
    }

    if (warning.atRisk) {
      return (
        <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
          <AlertTriangle size={12} />
          <span>
            {warning.lateCount} late(s) - {warning.remainingLates} more until
            absent
          </span>
        </div>
      );
    }

    return null;
  };

  const SkeletonRows = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td className="px-2 sm:px-4 py-3 sm:py-4">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-2 sm:px-4 py-3 sm:py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </td>
          <td className="px-2 sm:px-4 py-3 sm:py-4 hidden md:table-cell">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-2 sm:px-4 py-3 sm:py-4 hidden lg:table-cell">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      {/* Tardiness Policy Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle
            size={16}
            className="text-yellow-600 mt-0.5 flex-shrink-0"
          />
          <div className="text-xs sm:text-sm text-yellow-800">
            <strong>Tardiness Policy:</strong> Students who are late 5 times for
            the same subject will automatically be marked as{" "}
            <strong>ABSENT</strong> on their 5th late.
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedStudents.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedStudents.size} student(s) selected
              </span>
              <button
                onClick={() => setSelectedStudents(new Set())}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Clear
              </button>
            </div>

            {!showBulkActions ? (
              <button
                onClick={() => setShowBulkActions(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
              >
                Update Selected
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>

                {bulkStatus === "absent" && (
                  <select
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason, idx) => (
                      <option key={idx} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={handleBulkUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm transition-colors whitespace-nowrap"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowBulkActions(false);
                    setBulkReason("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-400 hover:text-blue-600"
                >
                  {selectedStudents.size === records.length &&
                  records.length > 0 ? (
                    <Check size={16} className="text-blue-600" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Reason
              </th>
              <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && records.length === 0 ? (
              <SkeletonRows />
            ) : error ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-red-600 font-medium text-sm px-4">
                    {error}
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-gray-600 font-medium text-sm">
                    No attendance records available.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((student) => {
                const currentStatus = getStudentStatus(student);
                const currentReason = getStudentReason(student);

                return (
                  <tr
                    key={student.id}
                    className={
                      selectedStudents.has(student.id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <button
                        onClick={() => handleSelectStudent(student.id)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        {selectedStudents.has(student.id) ? (
                          <Check size={16} className="text-blue-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 font-medium">
                      <div className="flex flex-col">
                        <span>{student.full_name || student.name}</span>

                        {/* Tardiness indicator */}
                        {renderTardinessIndicator(student.id, currentStatus)}

                        {/* Mobile: Show reason below name if absent */}
                        {currentStatus === "absent" && (
                          <select
                            value={currentReason}
                            onChange={(e) =>
                              setReason(student.id, e.target.value)
                            }
                            className="mt-2 w-full p-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 md:hidden"
                          >
                            <option value="">Select Reason</option>
                            {reasons.map((reason, idx) => (
                              <option key={idx} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        )}
                        {/* Mobile: Show history button */}
                        <button
                          onClick={() => handleViewHistory(student.id)}
                          className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-xs lg:hidden"
                          title="View attendance history"
                        >
                          <Eye size={12} />
                          <span className="ml-1">History</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatus(student.id, "present")}
                          disabled={loading}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${
                            currentStatus === "present"
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                          title="Present"
                        >
                          <CircleCheck size={18} />
                        </button>
                        <button
                          onClick={() => setStatus(student.id, "absent")}
                          disabled={loading}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${
                            currentStatus === "absent"
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                          title="Absent"
                        >
                          <CircleX size={18} />
                        </button>
                        <button
                          onClick={() => setStatus(student.id, "late")}
                          disabled={loading}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${
                            currentStatus === "late"
                              ? "bg-yellow-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                          title="Late"
                        >
                          <Clock size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 hidden md:table-cell text-center">
                      {currentStatus === "absent" ? (
                        <select
                          value={currentReason}
                          onChange={(e) =>
                            setReason(student.id, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Reason</option>
                          {reasons.map((reason, idx) => (
                            <option key={idx} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 hidden lg:table-cell text-center">
                      <button
                        onClick={() => handleViewHistory(student.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                        title="View attendance history"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                );
              })
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
        <div className="text-xs sm:text-sm text-gray-600 text-center">
          {selectedStudents.size} of {records.length} students selected
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
