import React from "react";
import { useAttendanceStore } from "../../stores/useAttendanceStore";
import { LuDownload } from "react-icons/lu";

const AttendanceDownloadBtn = () => {
  const downloadAttendancePDF = useAttendanceStore(
    (state) => state.downloadAttendancePDF
  );

  const handleDownload = () => {
    downloadAttendancePDF({
      sectionId: 3,
      quarterId: 1,
      academicYearId: 3,
      token: localStorage.getItem("token"), // or however you store your auth token
    });
  };

  return (
    <button className="gray-button" onClick={handleDownload}>
      <LuDownload size={15} />
      <span className="ml-2">Export PDF by Quarter</span>
    </button>
  );
};

export default AttendanceDownloadBtn;
