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
import { axiosInstance } from "../../lib/axios";

const Achievements = () => {
  const { certificates, fetchCertificates, loading, error } =
    useAchievementsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState({});
  const [downloaded, setDownloaded] = useState({});

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDownloadCertificate = async (type, quarterId) => {
    setDownloading((prev) => ({ ...prev, [`${type}-${quarterId}`]: true }));
    try {
      const response = await axiosInstance.get(
        "/student/certificate/download",
        {
          params: { type, quarter_id: quarterId },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${type}-${quarterId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloaded((prev) => ({ ...prev, [`${type}-${quarterId}`]: true }));
      setTimeout(() => {
        setDownloaded((prev) => ({ ...prev, [`${type}-${quarterId}`]: false }));
      }, 2000); // Reset success animation after 2 seconds
    } catch (err) {
      console.error("Download error:", err);
      // Optionally add toast.error here if integrated with toast notifications
    } finally {
      setDownloading((prev) => ({ ...prev, [`${type}-${quarterId}`]: false }));
    }
  };

  const filteredCertificates = [
    ...certificates.data.academic_awards,
    ...certificates.data.attendance_awards,
  ].filter(
    (cert) =>
      cert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.quarter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className=" p-4 lg:p-8 min-h-screen relative overflow-hidden">
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

      {/* Summary Banner */}
      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-lg animate-slide-up">
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-600 mb-1">
            Total Certificates
          </p>
          <p className="text-3xl font-bold text-blue-900 animate-count-up">
            {loading ? "..." : certificates.data.certificate_count || 0}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-600 mb-1">
            Academic Awards
          </p>
          <p className="text-3xl font-bold text-green-900 animate-count-up">
            {loading ? "..." : certificates.data.academic_awards.length || 0}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-purple-600 mb-1">
            Attendance Awards
          </p>
          <p className="text-3xl font-bold text-purple-900 animate-count-up">
            {loading ? "..." : certificates.data.attendance_awards_count || 0}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <LuAward className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Your Achievement Journey
          </h2>
          {!loading && (
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
          <div className="absolute left-4 lg:left-8 top-0 h-full w-1 bg-blue-300 rounded-full"></div>
          {loading ? (
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
          ) : error ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <LuAward className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-900 text-lg">
                    Failed to load achievements
                  </p>
                  <p className="text-sm text-red-600 mt-2">{error}</p>
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
            filteredCertificates.map((cert, index) => (
              <div
                key={index}
                className={`relative pl-12 lg:pl-16 transform transition-all duration-300 hover:scale-105 ${
                  index % 2 === 0 ? "" : ""
                } animate-slide-up`}
              >
                <div
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
                    cert.category === "Academic"
                      ? "bg-blue-500"
                      : "bg-purple-500"
                  } text-white`}
                >
                  {cert.category === "Academic" ? (
                    <LuStar className="w-5 h-5" />
                  ) : (
                    <LuCalendarCheck className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg border ${
                    cert.category === "Academic"
                      ? "border-blue-200 hover:shadow-blue-100/50"
                      : "border-purple-200 hover:shadow-purple-100/50"
                  }`}
                >
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
                    disabled={downloading[`${cert.type}-${cert.quarter_id}`]}
                    className={`flex items-center gap-2 w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      downloading[`${cert.type}-${cert.quarter_id}`]
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : downloaded[`${cert.type}-${cert.quarter_id}`]
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {downloaded[`${cert.type}-${cert.quarter_id}`] ? (
                      <>
                        <LuCircleCheck className="w-4 h-4 animate-pulse" />
                        Downloaded
                      </>
                    ) : downloading[`${cert.type}-${cert.quarter_id}`] ? (
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
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Achievements;
