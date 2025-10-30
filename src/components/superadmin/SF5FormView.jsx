import React, { useMemo, useState } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  BarChart3,
  Search,
  SortAsc,
} from "lucide-react";
import useSF5SF6FormStore from "../../stores/superAdmin/sf5sf6FormStore";

const SF5FormView = ({ stats }) => {
  const { formStudents, currentPage, setCurrentPage } = useSF5SF6FormStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Summary Cards for SF5
  const summaryCards = [
    {
      title: "Total Students",
      value: stats?.total_students || 0,
      icon: Users,
      color: "blue",
      change: "Enrolled in this section",
    },
    {
      title: "Attendance Issues",
      value: stats?.attendance_issues || 0,
      icon: AlertCircle,
      color: "orange",
      change: "Below 75% attendance",
    },
    {
      title: "Passing Students",
      value: stats?.passing_students || 0,
      icon: CheckCircle,
      color: "green",
      change: `${
        Math.round((stats?.passing_students / stats?.total_students) * 100) || 0
      }% pass rate`,
    },
    {
      title: "Incomplete Records",
      value: stats?.incomplete_grades || 0,
      icon: Clock,
      color: "red",
      change: "Missing grade entries",
    },
  ];

  const filteredStudents = useMemo(() => {
    let data = [...formStudents];

    if (searchTerm) {
      data = data.filter(
        (s) =>
          s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.student_id.includes(searchTerm)
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.student_name.localeCompare(b.student_name));
    } else if (sortBy === "attendance") {
      data.sort((a, b) => b.attendance_percentage - a.attendance_percentage);
    }

    return data;
  }, [formStudents, searchTerm, sortBy]);

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        text: "text-blue-900",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        text: "text-green-900",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        text: "text-orange-900",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        text: "text-red-900",
      },
    };
    return colors[color];
  };

  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          SF5 Attendance Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, idx) => {
            const colors = getColorClasses(card.color);
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border}`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <span className={`text-2xl font-bold ${colors.text}`}>
                    {card.value}
                  </span>
                </div>
                <p className={`text-sm font-semibold ${colors.text}`}>
                  {card.title}
                </p>
                <p className={`text-xs ${colors.icon} mt-1`}>{card.change}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Status Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Attendance Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
            <p className="text-green-700 text-sm font-medium">Present Days</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats?.attendance_issues === undefined
                ? "—"
                : formStudents.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-6 border border-red-200">
            <p className="text-red-700 text-sm font-medium">Absent Days</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats?.attendance_issues || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
            <p className="text-yellow-700 text-sm font-medium">Half Days</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">—</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <p className="text-blue-700 text-sm font-medium">Total Classes</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {Math.ceil(formStudents.length / 2)}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Student Attendance Records
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredStudents.length} students · Page {currentPage}
              </p>
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="attendance">Sort by Attendance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Present Days
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Attendance %
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((student) => (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {student.student_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.student_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {student.total_days} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            student.attendance_percentage >= 90
                              ? "bg-green-600"
                              : student.attendance_percentage >= 75
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                          style={{
                            width: `${student.attendance_percentage}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`font-semibold text-sm ${
                          student.attendance_percentage >= 90
                            ? "text-green-600"
                            : student.attendance_percentage >= 75
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.attendance_percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.attendance_percentage >= 75
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.attendance_percentage >= 75
                        ? "✓ Compliant"
                        : "⚠ At Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(filteredStudents.length / 10) || 1}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredStudents.length / 10),
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage === Math.ceil(filteredStudents.length / 10)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SF5FormView;
