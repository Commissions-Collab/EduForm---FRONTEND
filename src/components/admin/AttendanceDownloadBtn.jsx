import React from "react";
import { Download } from "lucide-react";
import { useAdminStore } from "../../stores/useAdminStore";

const AttendanceDownloadBtn = () => {
  const downloadAttendancePDF = useAdminStore(
    (state) => state.downloadAttendancePDF
  );

  return (
    <button className="gray-button" onClick={downloadAttendancePDF}>
      <Download size={15} />
      <span className="ml-2">Export PDF by Quarter</span>
    </button>
  );
};

export default AttendanceDownloadBtn;
