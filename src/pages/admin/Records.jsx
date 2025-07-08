import React, { useState } from "react";
import { LuCalendar, LuDownload, LuFile } from "react-icons/lu";

const Records = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("All Quarters");

  const handleQuarterChange = (e) => {
    setSelectedQuarter(e.target.value);
  };

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">
          Quarterly Grade Encoding (SF9): Grade 10-A
        </div>

        <div className="flex space-x-3">
          <select
            value={selectedQuarter}
            onChange={handleQuarterChange}
            className="dropdown"
          >
            <option value="All Quarters">All Quarters</option>
            <option value="1st Quarter">1st Quarter</option>
            <option value="2nd Quarter">2nd Quarter</option>
            <option value="3rd Quarter">3rd Quarter</option>
            <option value="4th Quarter">4th Quarter</option>
          </select>

          <div className="inline-flex items-center px-2 py-1 text-sm rounded-lg bg-yellow-50 text-yellow-600">
            <LuDownload size={14} />
            <span className="ml-2">Locks in : 5 days</span>
          </div>
        </div>
      </div>
      <div className="mt-10 shad-container bg-[#EEF2FF] border border-[#E0E7FF] p-7 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <LuCalendar className="w-10 h-10 text-[#3730A3] pb-4" />

          <div className="flex flex-col">
            <span className="text-md text-[#3730A3] font-semibold">
              Honor Roll Eligibility
            </span>
            <span className="text-sm text-[#3730A3]/80 ">
              3 students qualify for "With High Honors" based on current grades
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Records;
