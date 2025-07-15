import React from "react";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Present: "bg-green-100 text-green-800",
    Absent: "bg-red-100 text-red-800",
    Late: "bg-yellow-100 text-yellow-800",
    Promoted: "bg-green-100 text-green-800",
    Retained: "bg-red-100 text-red-800",
    Pass: "bg-green-100 text-green-800",
    Fail: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
