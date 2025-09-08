import React, { useEffect, useState } from "react";
import {
  LuAward,
  LuStar,
  LuCalendarCheck,
  LuSearch,
  LuDownload,
  LuCircleCheck,
} from "react-icons/lu";
import useAchievementsStore from "../../stores/users/achievementStore";

const Achievements = () => {
  const { certificates, fetchCertificates, downloadCertificate, downloaded } =
    useAchievementsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDownloadCertificate = async (type, quarterId) => {
    const key = `${type}-${quarterId}`;
    setDownloading((prev) => ({ ...prev, [key]: true }));
    const success = await downloadCertificate(type, quarterId);
    setDownloading((prev) => ({ ...prev, [key]: false }));
  };

  const filteredCertificates = [
    ...certificates.data.academic_awards,
    ...certificates.data.attendance_awards,
  ].filter(
    (cert) =>
      cert.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      cert.quarter?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-4 lg:p-8 min-h-screen relative overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10 mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Achievements
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Celebrate your academic and attendance milestones
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative z-10 mb-6 animate-slide-in">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search achievements..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 animate-focus-glow"
          />
        </div>
      </div>

      {/* Summary Banner */}
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-lg animate-slide-up">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-600 mb-1">
            Total Certificates
          </p>
          <p className="text-3xl font-bold text-blue-900 animate-count-up">
            {certificates.isLoading
              ? "..."
              : certificates.data.certificate_count || 0}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-600 mb-1">
            Academic Awards
          </p>
          <p className="text-3xl font-bold text-green-900 animate-count-up">
            {certificates.isLoading
              ? "..."
              : certificates.data.academic_awards.length || 0}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-purple-600 mb-1">
            Attendance Awards
          </p>
          <p className="text-3xl font-bold text-purple-900 animate-count-up">
            {certificates.isLoading
              ? "..."
              : certificates.data.attendance_awards_count || 0}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <LuAward className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Your Achievement Journey
          </h2>
          {!certificates.isLoading && (
            <div className="text-sm text-gray-500">
              {filteredCertificates.length}{" "}
              {filteredCertificates.length === 1
                ? "achievement"
                : "achievements"}{" "}
              found
              {searchTerm && (
                <span className="ml-1">
                  for "
                  <span className="font-medium text-gray-700">
                    {searchTerm}
                  </span>
                  "
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative space-y-8 lg:space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-4 lg:left-8 top-0 h-full w-1 bg-blue-300 rounded-full animate-grow-line"></div>
          {certificates.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative pl-12 lg:pl-16 animate-pulse">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-full h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : certificates.error ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <LuAward className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-900 text-lg">
                    Failed to load achievements
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    {certificates.error}
                  </p>
                </div>
              </div>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <LuAward className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-lg">
                    No achievements yet
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Keep shining to earn your first certificate!"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filteredCertificates.map((cert, index) => {
              const key = `${cert.type}-${cert.quarter_id}`;
              const isNew = !downloaded[key];
              return (
                <div
                  key={key}
                  className={`relative pl-12 lg:pl-16 transform transition-all duration-300 hover:scale-105 animate-pop-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
                      cert.category === "Academic"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    } text-white animate-pulse`}
                  >
                    {cert.category === "Academic" ? (
                      <LuStar className="w-5 h-5" />
                    ) : (
                      <LuCalendarCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`relative bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg border ${
                      cert.category === "Academic"
                        ? "border-blue-200 hover:shadow-blue-100/50"
                        : "border-purple-200 hover:shadow-purple-100/50"
                    } ${isNew ? "animate-sparkle" : ""}`}
                  >
                    {isNew && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cert.description}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {cert.category} • {cert.quarter}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Issued: {cert.issued_date}
                    </p>
                    {cert.average && (
                      <p className="text-sm text-gray-500 mt-1">
                        Average: {cert.average}
                      </p>
                    )}
                    <button
                      onClick={() =>
                        handleDownloadCertificate(cert.type, cert.quarter_id)
                      }
                      disabled={downloading[key]}
                      className={`flex items-center gap-2 w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        downloading[key]
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : downloaded[key]
                          ? "bg-green-600 text-white animate-success-pulse"
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      {downloaded[key] ? (
                        <>
                          <LuCircleCheck className="w-4 h-4 animate-pulse" />
                          Downloaded
                        </>
                      ) : downloading[key] ? (
                        <>
                          <LuDownload className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <LuDownload className="w-4 h-4" />
                          Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default Achievements;
