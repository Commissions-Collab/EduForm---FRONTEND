import React, { useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Eye,
} from "lucide-react";
import useSF5SF6FormStore from "../../stores/superAdmin/sf5sf6FormStore";

const SF5SF6Table = () => {
  const {
    formStudents,
    currentPage,
    setCurrentPage,
    getPaginatedRecords,
    getTotalPages,
  } = useSF5SF6FormStore();

  const [sortConfig, setSortConfig] = React.useState({
    key: "student_name",
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const sortedAndFiltered = useMemo(() => {
    let data = [...formStudents];

    if (searchTerm) {
      data = data.filter(
        (student) =>
          student.student_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.student_id.includes(searchTerm)
      );
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        return sortConfig.direction === "asc" ? 1 : -1;
      });
    }

    return data;
  }, [formStudents, sortConfig, searchTerm]);

  const totalPages = Math.ceil(sortedAndFiltered.length / 10);
  const paginatedData = sortedAndFiltered.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <ChevronsUpDown className="w-4 h-4" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pass: "bg-green-100 text-green-800",
      Fail: "bg-red-100 text-red-800",
      Incomplete: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getHonorBadge = (honor) => {
    if (honor === "None") return null;

    const colors = {
      "Highest Honors": "bg-purple-100 text-purple-800",
      "High Honors": "bg-blue-100 text-blue-800",
      "With Honors": "bg-indigo-100 text-indigo-800",
    };
    return colors[honor] || "bg-gray-100 text-gray-800";
  };

  if (formStudents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600 font-medium">No student data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Search */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Student Records
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {paginatedData.length} of {sortedAndFiltered.length}{" "}
              students
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("student_name")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                >
                  Student Name <SortIcon column="student_name" />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort("final_average")}
                  className="flex items-center justify-center gap-2 font-semibold text-gray-700 hover:text-gray-900 w-full"
                >
                  Final Grade <SortIcon column="final_average" />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort("attendance_percentage")}
                  className="flex items-center justify-center gap-2 font-semibold text-gray-700 hover:text-gray-900 w-full"
                >
                  Attendance <SortIcon column="attendance_percentage" />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort("promotion_status")}
                  className="flex items-center justify-center gap-2 font-semibold text-gray-700 hover:text-gray-900 w-full"
                >
                  Status <SortIcon column="promotion_status" />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <button
                  onClick={() => handleSort("honor_classification")}
                  className="flex items-center justify-center gap-2 font-semibold text-gray-700 hover:text-gray-900 w-full"
                >
                  Honors <SortIcon column="honor_classification" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {student.student_name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {student.student_id}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      student.final_average >= 90
                        ? "bg-green-100 text-green-800"
                        : student.final_average >= 75
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.final_average}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      student.attendance_percentage >= 90
                        ? "bg-green-100 text-green-800"
                        : student.attendance_percentage >= 75
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.attendance_percentage}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                      student.promotion_status
                    )}`}
                  >
                    {student.promotion_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {getHonorBadge(student.honor_classification) ? (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getHonorBadge(
                        student.honor_classification
                      )}`}
                    >
                      {student.honor_classification}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SF5SF6Table;
