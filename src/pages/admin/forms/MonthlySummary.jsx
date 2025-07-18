import React from "react";
import { LuDownload, LuPrinter } from "react-icons/lu";

const MonthlySummary = () => {
  const handlePrint = () => {
    alert("Print button clicked!");
  };

  const handleExportClick = () => {
    alert("Print button clicked!");
  };
  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">
          Monthly Attendance Summary (SF4): Grade 10-A
        </div>
        <div className="flex space-x-3">
          <button className="gray-button" onClick={handlePrint}>
            <LuPrinter size={15} />
            <span className="ml-2">Print</span>
          </button>

          <button className="gray-button" onClick={handleExportClick}>
            <LuDownload size={15} />
            <span className="ml-2">Export</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default MonthlySummary;
