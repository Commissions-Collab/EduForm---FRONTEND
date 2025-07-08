import React from "react";
import { adminCards } from "../../constants";
import { FaCircle } from "react-icons/fa";

const Attendance = () => {
  const statusColors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-400",
  };

  const attendanceData = adminCards[0].data;

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Daily Attendance (SF2): Grade 10-A</div>
        <div className="items-center">Date:</div>
      </div>
      <div className="mt-10 shad-container p-5 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Attendance Summary</h2>
        </div>

        <div className="text-sm flex justify-between gap-4">
          {Object.entries(attendanceData).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${statusColors[key]}`}
              ></span>
              <p className="capitalize">{key}</p>
              <span className="text-gray-800 font-medium">({value.count})</span>
              <span className="text-gray-600">({value.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Attendance;
