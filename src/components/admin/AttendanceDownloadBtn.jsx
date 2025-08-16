import React from "react";
import { LuDownload } from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";

const AttendanceDownloadBtn = () => {
  const downloadAttendancePDF = useAdminStore(
    (state) => state.downloadAttendancePDF
  );

  return (
    <button className="gray-button" onClick={downloadAttendancePDF}>
      <LuDownload size={15} />
      <span className="ml-2">Export PDF by Quarter</span>
    </button>
  );
};

export default AttendanceDownloadBtn;
