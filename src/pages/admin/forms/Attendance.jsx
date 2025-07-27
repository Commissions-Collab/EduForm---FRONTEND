import React, { useEffect } from "react";
import AttendanceTable from "../../../components/admin/AttendanceTable";
import { useAdminStore } from "../../../stores/useAdminStore";

const Attendance = () => {
  const { fetchAttendanceData, attendanceSummary } = useAdminStore();
  const summary = attendanceSummary();

  const statusColors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-400",
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Daily Attendance (SF2): Grade 10-A</div>
        <div className="flex items-center gap-2">
          <label className="items-center">Date:</label>
          <input
            type="date"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="mt-8 shad-container p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-lg font-medium">Attendance Summary</h2>
        </div>
        <div className="text-sm flex flex-wrap gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusColors[key]}`} />
              <p className="capitalize">{key}</p>
              <span className="text-gray-800 font-medium">({value.count})</span>
              <span className="text-gray-600">({value.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      <AttendanceTable />
    </main>
  );
};

export default Attendance;
