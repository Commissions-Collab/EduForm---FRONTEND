// src/components/UserComponents/AchievementsCertificates.jsx
import React from "react";
import { Award, Calendar, CircleUser, Download } from "lucide-react";
import useStoreUser from "../../stores/userStore";
const AchievementsCertificates = () => {
  const {
    achievementsData,
    downloadCertificate,
    achievementsLoading,
    achievementsError,
  } = useStoreUser();

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
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
    switch (category.toLowerCase()) {
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

  if (achievementsLoading) {
    return (
      <div className="mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading achievements...</span>
        </div>
      </div>
    );
  }

  if (achievementsError) {
    return (
      <div className="mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-700 font-medium">
            Error: {achievementsError}
          </div>
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
              {achievementsData.academic_awards.length}
            </span>
            <span className="text-sm text-gray-500">
              certificate
              {achievementsData.academic_awards.length !== 1 ? "s" : ""}
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
              {achievementsData.attendance_awards.length}
            </span>
            <span className="text-sm text-gray-500">
              certificate
              {achievementsData.attendance_awards.length !== 1 ? "s" : ""}
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
              {achievementsData.certificate_count}
            </span>
            <span className="text-sm text-gray-500">available</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            All certificates combined
          </div>
        </div>
      </div>

      {/* Academic Awards Section */}
      {achievementsData.academic_awards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            Academic Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.academic_awards.map((award, index) => (
              <div
                key={index}
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
                  {award.honor_type}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {award.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Quarter: {award.quarter}</span>
                  <span>Average: {award.average}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Issued: {award.issued_date}
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
      {achievementsData.attendance_awards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Attendance Awards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementsData.attendance_awards.map((award, index) => (
              <div
                key={index}
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
                  <span>Quarter: {award.quarter}</span>
                  <span>100% Attendance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Issued: {award.issued_date}
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
      {achievementsData.honor_roll_count && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Honor Roll Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {achievementsData.honor_roll_count.with_honors}
              </div>
              <div className="text-sm text-gray-600">With Honors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {achievementsData.honor_roll_count.with_high_honors}
              </div>
              <div className="text-sm text-gray-600">With High Honors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {achievementsData.honor_roll_count.with_highest_honors}
              </div>
              <div className="text-sm text-gray-600">With Highest Honors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsCertificates;
