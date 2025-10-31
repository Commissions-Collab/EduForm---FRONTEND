import React, { useMemo, useState } from "react";
import {
  Trophy,
  TrendingUp,
  BookOpen,
  Star,
  Target,
  GraduationCap,
  Search,
  Award,
} from "lucide-react";
import useSF5SF6FormStore from "../../stores/superAdmin/sf5sf6FormStore";

const SF6FormView = ({ stats }) => {
  const { formStudents, currentPage, setCurrentPage } = useSF5SF6FormStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHonor, setFilterHonor] = useState("all");

  // Summary Cards for SF6
  const summaryCards = [
    {
      title: "Highest Honors",
      value: stats?.highest_honors || 0,
      icon: Trophy,
      color: "purple",
      threshold: "98% and above",
    },
    {
      title: "High Honors",
      value: stats?.high_honors || 0,
      icon: Award,
      color: "blue",
      threshold: "95% and above",
    },
    {
      title: "With Honors",
      value: stats?.with_honors || 0,
      icon: Star,
      color: "yellow",
      threshold: "90% and above",
    },
    {
      title: "Failing Students",
      value: stats?.failing_students || 0,
      icon: Target,
      color: "red",
      threshold: "Below 75%",
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

    if (filterHonor !== "all") {
      data = data.filter((s) => {
        if (filterHonor === "honors") {
          return s.honor_classification !== "None";
        }
        if (filterHonor === "passing") {
          return s.promotion_status === "Pass";
        }
        if (filterHonor === "failing") {
          return s.promotion_status === "Fail";
        }
        return true;
      });
    }

    data.sort((a, b) => b.final_average - a.final_average);

    return data;
  }, [formStudents, searchTerm, filterHonor]);

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        text: "text-purple-900",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        text: "text-blue-900",
      },
      yellow: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: "text-yellow-600",
        text: "text-yellow-900",
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

  const getGradeColor = (grade) => {
    if (grade >= 98) return "from-purple-600 to-purple-800";
    if (grade >= 95) return "from-blue-600 to-blue-800";
    if (grade >= 90) return "from-yellow-500 to-yellow-700";
    if (grade >= 75) return "from-green-600 to-green-800";
    return "from-red-600 to-red-800";
  };

  const getHonorLabel = (honor) => {
    switch (honor) {
      case "Highest Honors":
        return { label: "⭐⭐⭐ Highest", color: "purple" };
      case "High Honors":
        return { label: "⭐⭐ High", color: "blue" };
      case "With Honors":
        return { label: "⭐ With", color: "yellow" };
      default:
        return { label: "—", color: "gray" };
    }
  };

  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const totalPages = Math.ceil(filteredStudents.length / 10);

  return (
    <div className="space-y-8">
      {/* Honor Statistics Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          SF6 Academic Performance
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
                <p className={`text-xs ${colors.icon} mt-1`}>
                  {card.threshold}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Grade Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  98-100 (Highest)
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {stats?.highest_honors || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.highest_honors / stats?.total_students) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  95-97 (High)
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {stats?.high_honors || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.high_honors / stats?.total_students) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  90-94 (With)
                </span>
                <span className="text-sm font-bold text-yellow-600">
                  {stats?.with_honors || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.with_honors / stats?.total_students) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  75-89 (Passing)
                </span>
                <span className="text-sm font-bold text-green-600">
                  {(stats?.passing_students || 0) -
                    (stats?.with_honors || 0) -
                    (stats?.high_honors || 0) -
                    (stats?.highest_honors || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (((stats?.passing_students || 0) -
                            (stats?.with_honors || 0) -
                            (stats?.high_honors || 0) -
                            (stats?.highest_honors || 0)) /
                            stats?.total_students) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Below 75 (Failing)
                </span>
                <span className="text-sm font-bold text-red-600">
                  {stats?.failing_students || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.failing_students / stats?.total_students) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Overall Summary
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {stats?.total_students || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {Math.round(
                  (stats?.passing_students / stats?.total_students) * 100
                ) || 0}
                %
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <p className="text-sm text-gray-600">With Issues</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {stats?.with_discrepancies || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Pass/Fail Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Promotion Status
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-900">Promoted</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.passing_students || 0}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.passing_students / stats?.total_students) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-red-900">Not Promoted</span>
                <span className="text-2xl font-bold text-red-600">
                  {stats?.failing_students || 0}
                </span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.total_students > 0
                        ? (stats?.failing_students / stats?.total_students) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Student Performance Report
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredStudents.length} students · Ranked by grade
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All Students" },
              { value: "honors", label: "🌟 With Honors" },
              { value: "passing", label: "✓ Passing" },
              { value: "failing", label: "⚠ Failing" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setFilterHonor(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterHonor === filter.value
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-emerald-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                  Rank & Student
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Final Grade
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Attendance
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Honor Classification
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((student, idx) => {
                const honorInfo = getHonorLabel(student.honor_classification);
                const rank = filteredStudents.indexOf(student) + 1;

                return (
                  <tr key={student.student_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br ${getGradeColor(
                            student.final_average
                          )}`}
                        >
                          {rank}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.student_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.student_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-bold text-lg bg-gradient-to-br ${getGradeColor(
                          student.final_average
                        )}`}
                      >
                        {student.final_average}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
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
                        <span className="text-sm font-semibold text-gray-700">
                          {student.attendance_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {honorInfo.label !== "—" ? (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            honorInfo.color === "purple"
                              ? "bg-purple-100 text-purple-800"
                              : honorInfo.color === "blue"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {honorInfo.label}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          student.promotion_status === "Pass"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.promotion_status === "Pass"
                          ? "✓ Promoted"
                          : "✗ Not Promoted"}
                      </span>
                    </td>
                  </tr>
                );
              })}
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
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

export default SF6FormView;
