// src/pages/Achievements.jsx
import React, { useEffect } from "react";
import AchievementsCertificates from "../../components/user/AchievementsCertificates";
import { useStoreUser } from "../../stores/student";

const Achievements = () => {
  const {
    achievementsData,
    fetchAchievements,
    achievementsLoading,
    achievementsError,
    clearAchievementsError,
  } = useStoreUser();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const pageTitle = "Achievements & Certificates";

  if (achievementsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (achievementsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{achievementsError}</p>
          <button
            onClick={clearAchievementsError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            {pageTitle}
          </h1>
        </div>

        {/* Achievements Summary */}
        {achievementsData.certificate_count > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Certificates
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {achievementsData.certificate_count}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  With Honors
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {achievementsData.honor_roll_count.with_honors}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  With High Honors
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {achievementsData.honor_roll_count.with_high_honors}
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  Perfect Attendance
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  {achievementsData.attendance_awards_count}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The AchievementsCertificates component will get all its necessary state and actions
                    directly from the useStoreUser Zustand store. */}
        <AchievementsCertificates />
      </div>
    </div>
  );
};

export default Achievements;
