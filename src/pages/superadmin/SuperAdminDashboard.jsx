import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Activity,
  AlertTriangle,
  Clock,
  BarChart3,
  GraduationCap,
  Building,
  CalendarDays,
} from "lucide-react";
import useSuperAdminDashboardStore from "../../stores/superAdmin/superAdminDashboardStore";

const SuperAdminDashboard = () => {
  const {
    dashboardStats,
    loading,
    error,
    lastUpdated,
    fetchDashboardData,
    getDashboardCards,
    getSystemOverview,
    getDistributionData,
    clearError,
  } = useSuperAdminDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardCards = getDashboardCards();
  const systemOverview = getSystemOverview();
  const distributionData = getDistributionData();

  // Icon mapping for dashboard cards
  const getIcon = (iconName) => {
    const icons = {
      Users,
      UserCheck,
      BookOpen,
      Calendar,
      Activity,
    };
    return icons[iconName] || Activity;
  };

  // Color mapping for cards
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        iconBg: "bg-blue-100",
        text: "text-blue-800",
        value: "text-blue-900",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        iconBg: "bg-green-100",
        text: "text-green-800",
        value: "text-green-900",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        iconBg: "bg-purple-100",
        text: "text-purple-800",
        value: "text-purple-900",
      },
      indigo: {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        icon: "text-indigo-600",
        iconBg: "bg-indigo-100",
        text: "text-indigo-800",
        value: "text-indigo-900",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  // Dashboard Card Component
  const DashboardCard = ({ title, type, data, icon, color }) => {
    const IconComponent = getIcon(icon);
    const colors = getColorClasses(color);

    const renderCardContent = () => {
      switch (type) {
        case "students":
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 ${colors.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.value}`}>
                    {data?.totalStudents?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Students</div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Enrollments
                  </span>
                  <span className="font-semibold text-gray-900">
                    {data?.totalEnrollments || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Recent Enrollments
                  </span>
                  <span className="font-semibold text-blue-600">
                    {data?.recentEnrollments || 0}
                  </span>
                </div>
                {data?.enrollmentsByStatus &&
                  Object.keys(data.enrollmentsByStatus).length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs text-gray-500 mb-2">
                        Enrollment Status
                      </div>
                      <div className="space-y-1">
                        {Object.entries(data.enrollmentsByStatus).map(
                          ([status, count]) => (
                            <div
                              key={status}
                              className="flex justify-between text-xs"
                            >
                              <span className="capitalize text-gray-600">
                                {status}
                              </span>
                              <span className="font-medium">{count}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );

        case "teachers":
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 ${colors.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.value}`}>
                    {data?.totalTeachers?.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Teachers</div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Teachers</span>
                  <span className="font-semibold text-green-600">
                    {data?.recentTeachers || 0}
                  </span>
                </div>
                {data?.teachersBySubject &&
                  Object.keys(data.teachersBySubject).length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs text-gray-500 mb-2">
                        By Subject/Specialization
                      </div>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {Object.entries(data.teachersBySubject)
                          .slice(0, 4)
                          .map(([subject, count]) => (
                            <div
                              key={subject}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-gray-600 truncate">
                                {subject}
                              </span>
                              <span className="font-medium ml-2">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );

        case "academic":
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 ${colors.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.value}`}>
                    {data?.totalSections || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Sections</div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Academic Years</span>
                  <span className="font-semibold text-gray-900">
                    {data?.totalAcademicYears || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Year Levels</span>
                  <span className="font-semibold text-gray-900">
                    {data?.totalYearLevels || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Sections</span>
                  <span className="font-semibold text-purple-600">
                    {data?.recentSections || 0}
                  </span>
                </div>
                {data?.currentAcademicYear && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Current Academic Year
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {data.currentAcademicYear.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

        case "calendar":
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 ${colors.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${colors.value}`}>
                    {data?.totalEvents || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold text-indigo-600">
                    {data?.eventsThisMonth || 0}
                  </span>
                </div>
                <div className="text-center pt-2">
                  <div className="text-xs text-gray-500">Academic Calendar</div>
                  <div className="text-sm font-medium text-gray-700 mt-1">
                    Events & Schedule
                  </div>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8">
              <div className="text-gray-500">No data available</div>
            </div>
          );
      }
    };

    return (
      <div
        className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
      >
        <div className="mb-4">
          <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
        </div>
        {renderCardContent()}
      </div>
    );
  };

  // Skeleton Loading Component
  const DashboardSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse"
            >
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && !dashboardStats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Super Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  System overview and management center for your school
                  administration.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error loading dashboard data
                </p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* System Overview */}
          {systemOverview && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">
                      Total System Entities:
                    </span>
                    <span className="font-semibold text-indigo-600">
                      {systemOverview.totalEntities.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">
                      Current Academic Year:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {systemOverview.currentAcademicYear}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-500">New Teachers:</span>
                    <span className="font-semibold text-green-600">
                      {systemOverview.recentActivity.newTeachers}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-500">New Enrollments:</span>
                    <span className="font-semibold text-blue-600">
                      {systemOverview.recentActivity.newEnrollments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Dashboard Cards */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>System Overview</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {dashboardCards.map((card) => (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  type={card.type}
                  data={card.data}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </div>
          </section>

          {/* Distribution Charts Section */}
          {distributionData && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Distribution Analytics</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sections by Level */}
                {distributionData.sectionsByLevel &&
                  Object.keys(distributionData.sectionsByLevel).length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Building className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Sections by Grade Level
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(distributionData.sectionsByLevel)
                          .sort(([, a], [, b]) => b - a)
                          .map(([level, count]) => (
                            <div
                              key={level}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">
                                  {level}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{
                                      width: `${
                                        (count /
                                          Math.max(
                                            ...Object.values(
                                              distributionData.sectionsByLevel
                                            )
                                          )) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Teachers by Subject */}
                {distributionData.teachersBySubject &&
                  Object.keys(distributionData.teachersBySubject).length >
                    0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Teachers by Subject
                        </h3>
                      </div>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {Object.entries(distributionData.teachersBySubject)
                          .sort(([, a], [, b]) => b - a)
                          .map(([subject, count]) => (
                            <div
                              key={subject}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span
                                  className="text-sm font-medium text-gray-700 truncate"
                                  title={subject}
                                >
                                  {subject.length > 20
                                    ? `${subject.substring(0, 20)}...`
                                    : subject}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{
                                      width: `${
                                        (count /
                                          Math.max(
                                            ...Object.values(
                                              distributionData.teachersBySubject
                                            )
                                          )) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Enrollment Status */}
                {distributionData.enrollmentsByStatus &&
                  Object.keys(distributionData.enrollmentsByStatus).length >
                    0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Users className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Enrollment Status
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(distributionData.enrollmentsByStatus)
                          .sort(([, a], [, b]) => b - a)
                          .map(([status, count]) => (
                            <div
                              key={status}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    status.toLowerCase() === "active"
                                      ? "bg-green-500"
                                      : status.toLowerCase() === "pending"
                                      ? "bg-yellow-500"
                                      : status.toLowerCase() === "inactive"
                                      ? "bg-red-500"
                                      : "bg-purple-500"
                                  }`}
                                ></div>
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {status}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      status.toLowerCase() === "active"
                                        ? "bg-green-500"
                                        : status.toLowerCase() === "pending"
                                        ? "bg-yellow-500"
                                        : status.toLowerCase() === "inactive"
                                        ? "bg-red-500"
                                        : "bg-purple-500"
                                    }`}
                                    style={{
                                      width: `${
                                        (count /
                                          Math.max(
                                            ...Object.values(
                                              distributionData.enrollmentsByStatus
                                            )
                                          )) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Quick Actions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Manage Students
                    </div>
                    <div className="text-sm text-gray-500">
                      View enrollments
                    </div>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Manage Teachers
                    </div>
                    <div className="text-sm text-gray-500">
                      Add or edit teachers
                    </div>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Class Management
                    </div>
                    <div className="text-sm text-gray-500">
                      Sections & years
                    </div>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Academic Calendar
                    </div>
                    <div className="text-sm text-gray-500">
                      Events & schedules
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
