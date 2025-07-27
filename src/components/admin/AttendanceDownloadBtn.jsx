import React from "react";
import { LuDownload } from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";

const AttendanceDownloadBtn = () => {
  const downloadAttendancePDF = useAdminStore(
    (state) => state.downloadAttendancePDF
  );

  const handleDownload = () => {
    downloadAttendancePDF();
  };

  return (
    <button className="gray-button" onClick={handleDownload}>
      <LuDownload size={15} />
      <span className="ml-2">Export PDF by Quarter</span>
    </button>
  );
};

export default AttendanceDownloadBtn;
