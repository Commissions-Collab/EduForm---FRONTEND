import React from "react";
import { Search, User } from "lucide-react";

const ConferenceSidebar = ({
  loading,
  students,
  searchTerm,
  setSearchTerm,
  selectedStudentId,
  onSelectStudent,
}) => {
  const StudentCardSkeleton = () => (
    <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 p-2 sm:p-3 rounded animate-pulse">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded" />
          <div className="h-2 w-14 sm:w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-5 w-12 sm:w-16 bg-gray-200 rounded-full flex-shrink-0" />
    </div>
  );

  const StudentCard = ({ student, isSelected, onClick }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "Excellent":
          return "bg-green-100 text-green-700";
        case "Good Standing":
          return "bg-blue-100 text-blue-700";
        case "At Risk":
          return "bg-yellow-100 text-yellow-700";
        case "Critical":
          return "bg-red-100 text-red-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    return (
      <div
        className={`flex items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 p-2 sm:p-3 rounded cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
          isSelected ? "bg-blue-50 border-blue-200" : ""
        }`}
        onClick={() => onClick(student.id)}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
            {student.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {student.name}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {student.guardian}
            </span>
          </div>
        </div>
        <span
          className={`text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 ml-2 ${getStatusColor(
            student.status
          )}`}
        >
          {student.status}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-5 h-full">
      <div className="border-b border-gray-200 pb-3 sm:pb-4">
        <h2 className="text-base sm:text-xl font-semibold text-gray-900">
          Students ({students.length})
        </h2>
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400 w-4 h-4" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students list */}
      <div
        className="space-y-2 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <StudentCardSkeleton key={i} />
          ))
        ) : students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isSelected={selectedStudentId === student.id}
              onClick={onSelectStudent}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <User className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-xs sm:text-sm">
              {searchTerm
                ? "No students match your search"
                : "No students available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceSidebar;
