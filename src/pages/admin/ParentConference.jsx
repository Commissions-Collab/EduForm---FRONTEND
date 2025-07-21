import React from "react";
import {
  LuCalendar,
  LuMail,
  LuPrinter,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import { parentStudents } from "../../constants";

const ParentConference = ({
  placeholder = "Search students...",
  onSearch = () => {},
}) => {
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
          Parent-Teacher Conference Prep: Grade 10-A
        </div>
        <div className="items-center">
          <div className="flex space-x-3">
            <button className="gray-button" onClick={handleExportClick}>
              <LuCalendar size={15} />
              <span className="ml-2">Schedule Conferences</span>
            </button>
            <button className="brand-button" onClick={handlePrint}>
              <LuPrinter size={15} />
              <span className="ml-2">Print Report Cards</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-12 gap-4 max-h-screen">
          <div className="col-span-4 shad-container p-8 space-y-5 ">
            <div className=" border-b-1 border-gray-200">
              <h2 className="text-xl font-semibold">Students</h2>
            </div>
            <div>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuSearch />
                </div>

                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder={placeholder}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full max-w-md mx-auto space-y-4">
              {parentStudents.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <LuUser className="w-5 h-5 text-gray-500" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {student.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {student.guardian}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${student.color}`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-8 shad-container space-y-5">
            <div className="flex justify-between p-8 border-b-1 border-gray-200">
              <div>
                <h2 className="text-xl font-semibold">Student 360° Profile</h2>
              </div>
              <div className="items-center">
                <div className="flex space-x-3">
                  <button className="gray-button">
                    <LuMail size={15} />
                    <span className="ml-2">Contact Parent</span>
                  </button>
                  <button className="flex text-[12.5px] bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                    <LuPrinter size={15} />
                    <span className="ml-2">Print Report Cards</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentConference;
