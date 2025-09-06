import React, { useEffect } from "react";
import { LuUser, LuCircleAlert } from "react-icons/lu";

import toast from "react-hot-toast";
import AttendanceMonthFilter from "../../components/user/AttendanceMonthFilter";
import AttendanceSummary from "../../components/user/AttendanceSummary";
import AttendanceDailyStatus from "../../components/user/AttendanceDailyStatus";
import AttendanceQuarterlySummary from "../../components/user/AttendanceQuarterlySummary";
import useStudentAttendanceStore from "../../stores/users/studentAttendanceStore";

const UserAttendance = () => {
  const {
    data,
    months,
    selectedMonth,
    loading,
    error,
    monthsLoading,
    monthsError,
    fetchAttendance,
    fetchMonthFilter,
    setSelectedMonth,
    clearError,
  } = useStudentAttendanceStore();

  useEffect(() => {
    fetchMonthFilter();
    fetchAttendance(selectedMonth || new Date().toISOString().slice(0, 7)); // Default to current month
  }, [fetchMonthFilter, fetchAttendance, selectedMonth]);

  useEffect(() => {
    if (error || monthsError) {
      toast.error(error || monthsError);
      clearError();
    }
  }, [error, monthsError, clearError]);

  if (error && monthsError) {
    return (
      <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LuCircleAlert className="w-12 h-12 text-red-600" />
          <p className="text-red-600 font-medium">Error loading attendance</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Attendance
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Student Panel
              </span>
            </div>
          </div>
          <AttendanceMonthFilter
            months={months}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            loading={monthsLoading}
            error={monthsError}
          />
        </div>

        <AttendanceSummary
          attendanceRate={data.attendance_rate}
          lateArrivals={data.late_arrivals}
          absences={data.absences}
          loading={loading}
        />
      </div>

      <section className="mb-8">
        <AttendanceDailyStatus
          dailyStatus={data.daily_status}
          loading={loading}
          error={error}
        />
      </section>

      <section>
        <AttendanceQuarterlySummary
          quarterlySummary={data.quarterly_summary}
          loading={loading}
          error={error}
        />
      </section>
    </main>
  );
};

export default UserAttendance;
