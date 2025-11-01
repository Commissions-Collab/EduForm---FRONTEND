import React from "react";
import { Award, Calendar, CircleUser, Download } from "lucide-react";
import useAchievementsStore from "../../stores/users/achievementStore";

const AchievementsCertificates = () => {
  const { certificates, downloadCertificate } = useAchievementsStore();

  // Safe data access
  const certificateData = certificates?.data || {
    certificate_count: 0,
    honor_roll_count: {
      with_honors: 0,
      with_high_honors: 0,
      with_highest_honors: 0,
    },
    attendance_awards_count: 0,
    academic_awards: [],
    attendance_awards: [],
  };

  const isLoading = certificates?.isLoading ?? false;
  const error = certificates?.error ?? null;

  const academicAwards = Array.isArray(certificateData.academic_awards)
    ? certificateData.academic_awards
    : [];
  const attendanceAwards = Array.isArray(certificateData.attendance_awards)
    ? certificateData.attendance_awards
    : [];

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "academic":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "attendance":
        return <Calendar className="w-5 h-5 text-green-600" />;
      case "competition":
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "academic":
        return "bg-blue-100 text-blue-800";
      case "attendance":
        return "bg-green-100 text-green-800";
      case "competition":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading achievements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-700 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Achievement Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Academic Awards */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Academic Awards
            </h3>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {academicAwards.length}
            </span>
            <span className="text-sm text-gray-500">
              certificate
              {academicAwards.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Honor Roll Certificates
          </div>
        </div>

        {/* Attendance Awards */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Attendance Awards
            </h3>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {attendanceAwards.length}
            </span>
            <span className="text-sm text-gray-500">
              certificate
              {attendanceAwards.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Perfect Attendance Certificates
          </div>
        </div>

        {/* Total Certificates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              Total Certificates
            </h3>
            <CircleUser className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {certificateData.certificate_count || 0}
            </span>
            <span className="text-sm text-gray-500">available</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            All certificates combined
          </div>
        </div>
      </div>

      {/* Academic Awards Section */}
      {academicAwards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Academic Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicAwards.map((award) => (
              <div
                key={`${award.type}-${award.quarter_id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  {getCategoryIcon(award.category)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                      award.category
                    )}`}
                  >
                    {award.category}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {award.honor_type || "Honor Roll"}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {award.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Quarter: {award.quarter || "N/A"}</span>
                  <span>Average: {award.average || "N/A"}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Issued: {award.issued_date || "N/A"}
                  </span>
                  <button
                    onClick={() =>
                      downloadCertificate("honor_roll", award.quarter_id)
                    }
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Awards Section */}
      {attendanceAwards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Attendance Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceAwards.map((award) => (
              <div
                key={`${award.type}-${award.quarter_id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  {getCategoryIcon(award.category)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                      award.category
                    )}`}
                  >
                    {award.category}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfect Attendance
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {award.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Quarter: {award.quarter || "N/A"}</span>
                  <span>100% Attendance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Issued: {award.issued_date || "N/A"}
                  </span>
                  <button
                    onClick={() =>
                      downloadCertificate(
                        "perfect_attendance",
                        award.quarter_id
                      )
                    }
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honor Roll Statistics */}
      {certificateData.honor_roll_count && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Honor Roll Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {certificateData.honor_roll_count.with_honors || 0}
              </div>
              <div className="text-sm text-gray-600">With Honors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {certificateData.honor_roll_count.with_high_honors || 0}
              </div>
              <div className="text-sm text-gray-600">With High Honors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {certificateData.honor_roll_count.with_highest_honors || 0}
              </div>
              <div className="text-sm text-gray-600">With Highest Honors</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {academicAwards.length === 0 && attendanceAwards.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No certificates yet. Keep working hard to earn your achievements!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsCertificates;
