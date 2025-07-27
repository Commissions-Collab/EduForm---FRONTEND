import React from 'react';
import { LuDownload, LuShare2, LuAward, LuCalendar, LuCircleUser } from "react-icons/lu";

import { useStoreUser } from '../../stores/useStoreUser';

const AchievementsCertificates = () => {
    // Use Zustand store
    const {
        selectedSchoolYear,
        schoolYearOptions,
        setSelectedSchoolYear,
        totalAcademicAwards,
        totalAttendanceAwards,
        totalCompetitionAwards,
        availableCertificates,
        downloadCertificate,
        shareCertificate,
        achievementsLoading: loading,
        achievementsError: error
    } = useStoreUser();

    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'academic':
                return <LuAward className="w-5 h-5 text-blue-600" />;
            case 'attendance':
                return <LuCalendar className="w-5 h-5 text-green-600" />;
            case 'competition': // Added competition category
                return <LuAward className="w-5 h-5 text-purple-600" />;
            default:
                return <LuAward className="w-5 h-5 text-gray-600" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category.toLowerCase()) {
            case 'academic':
                return 'bg-blue-100 text-blue-800';
            case 'attendance':
                return 'bg-green-100 text-green-800';
            case 'competition': // Added competition category
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="mx-auto">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading achievements...</span>
                    </div>
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
                        Achievements & Certificates
                    </h1>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedSchoolYear}
                            onChange={(e) => setSelectedSchoolYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            {schoolYearOptions.map((year) => (
                                <option key={year} value={year}>
                                    School Year {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="text-red-700 font-medium">Error: {error}</div>
                    </div>
                )}

                {/* Achievement Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {/* Academic Awards */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                Academic Awards
                            </h3>
                            <LuAward className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{totalAcademicAwards}</span>
                            <span className="text-sm text-gray-500">certificate{totalAcademicAwards !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Honor Roll (Q3)
                        </div>
                    </div>

                    {/* Attendance Awards */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                Attendance Awards
                            </h3>
                            <LuCalendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{totalAttendanceAwards}</span>
                            <span className="text-sm text-gray-500">certificate{totalAttendanceAwards !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Perfect Attendance (Q2)
                        </div>
                    </div>

                    {/* Competition Awards */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                Competition Awards
                            </h3>
                            <LuAward className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">{totalCompetitionAwards}</span>
                            <span className="text-sm text-gray-500">certificate{totalCompetitionAwards !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Science Fair Winner
                        </div>
                    </div>
                </div>

                {/* Available Certificates Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Available Certificates</h2>
                    </div>

                    <div className="p-6">
                        {availableCertificates.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No certificates available for this school year.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availableCertificates.map((certificate) => (
                                    <div
                                        key={certificate.id}
                                        className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                                                    {getCategoryIcon(certificate.category)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {certificate.title}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(certificate.category)}`}>
                                                            {certificate.category}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-600 mb-3 text-sm">
                                                        {certificate.description}
                                                    </p>

                                                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <LuCalendar className="w-4 h-4" />
                                                            <span>Issued: {certificate.issuedDate}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <LuCircleUser className="w-4 h-4" />
                                                            <span>by {certificate.issuedBy}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {certificate.canDownload && (
                                                    <button
                                                        onClick={() => downloadCertificate(certificate.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                    >
                                                        <LuDownload className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Download</span>
                                                    </button>
                                                )}
                                                {certificate.canShare && (
                                                    <button
                                                        onClick={() => shareCertificate(certificate.id)}
                                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                                    >
                                                        <LuShare2 className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Share</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementsCertificates;