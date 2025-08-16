// src/components/UserComponents/StudentGradesTable.jsx
import React from "react";
import { LuGauge, LuAward, LuArrowUp, LuArrowDown } from "react-icons/lu";
import { useStoreUser } from "../../stores/useStoreUser";

const StudentGradesTable = () => {
    const {
        gradesData,
        gradesLoading,
        gradesError,
    } = useStoreUser();

    const getStatusColor = (grade, classAverage) => {
        if (!classAverage) return "bg-gray-500";
        if (grade > classAverage) return "bg-green-500";
        if (grade < classAverage) return "bg-red-500";
        return "bg-yellow-500";
    };

    const getTrendColor = (trend) => {
        if (trend > 0) return "text-green-600";
        if (trend < 0) return "text-red-600";
        return "text-gray-600";
    };

    if (gradesLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (gradesError) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                            No Grades Available
                        </h3>
                    </div>
                </div>
                <div className="text-sm text-yellow-700">
                    <p>{gradesError}</p>
                </div>
            </div>
        );
    }

    // Check if grades data is empty
    if (!gradesData.grades || gradesData.grades.length === 0) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            No Grades Recorded Yet
                        </h3>
                    </div>
                </div>
                <div className="text-sm text-blue-700">
                    <p>Your grades will appear here once they are recorded by your teachers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            {/* Main Content Container */}
            <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-10">
                    {/* Grade Summary */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Grade Summary
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm font-medium">
                                <div className="flex items-center gap-2 text-green-700">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span>Above Average</span>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-700">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    <span>Average</span>
                                </div>
                                <div className="flex items-center gap-2 text-red-700">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span>Below Average</span>
                                </div>
                            </div>
                        </div>

                        {/* Average and Honors Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-md border border-blue-100">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <LuGauge className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <div>
                                        <span className="text-blue-800 font-semibold text-sm sm:text-base block">
                                            Quarterly Average
                                        </span>
                                        <span className="text-2xl sm:text-3xl font-bold text-blue-900">
                                            {gradesData.quarter_average}%
                                        </span>
                                    </div>
                                </div>
                                {gradesData.honors_eligibility && (
                                    <div className="flex items-center gap-3 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
                                        <LuAward className="w-5 h-5 text-yellow-600" />
                                        <span className="text-yellow-800 font-semibold text-sm sm:text-base">
                                            {gradesData.honors_eligibility} Eligibility
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm lg:text-base">
                                        Subject
                                    </th>
                                    <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm lg:text-base">
                                        Grade
                                    </th>
                                    <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm lg:text-base">
                                        Class Average
                                    </th>
                                    <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm lg:text-base">
                                        Trend
                                    </th>
                                    <th className="text-left py-3 sm:py-4 px-2 font-semibold text-gray-700 text-sm lg:text-base">
                                        Teacher
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradesData.grades.map((grade, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 sm:py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${getStatusColor(grade.grade, grade.class_average)}`}></span>
                                                <span className="font-medium text-gray-900 text-sm lg:text-base">
                                                    {grade.subject}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-2">
                                            <span className="font-semibold text-gray-900 text-sm lg:text-base">
                                                {grade.grade}%
                                            </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-2">
                                            <span className="text-gray-600 text-sm lg:text-base">
                                                {grade.class_average ? `${grade.class_average}%` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-2">
                                            <div className="flex items-center gap-1">
                                                {grade.trend > 0 ? (
                                                    <LuArrowUp className="w-4 h-4 text-green-600" />
                                                ) : grade.trend < 0 ? (
                                                    <LuArrowDown className="w-4 h-4 text-red-600" />
                                                ) : null}
                                                <span className={`font-medium text-sm lg:text-base ${getTrendColor(grade.trend)}`}>
                                                    {grade.trend > 0 ? `+${grade.trend}%` : grade.trend < 0 ? `${grade.trend}%` : '0%'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-2">
                                            <span className="text-gray-600 text-sm lg:text-base">
                                                {grade.teacher}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {gradesData.grades.map((grade, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${getStatusColor(grade.grade, grade.class_average)}`}></span>
                                        <h4 className="font-semibold text-gray-900">{grade.subject}</h4>
                                    </div>
                                    <span className="font-bold text-lg text-gray-900">{grade.grade}%</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Class Average:</span>
                                        <span className="ml-2 text-gray-700">{grade.class_average ? `${grade.class_average}%` : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Trend:</span>
                                        <div className="flex items-center gap-1 ml-2">
                                            {grade.trend > 0 ? (
                                                <LuArrowUp className="w-3 h-3 text-green-600" />
                                            ) : grade.trend < 0 ? (
                                                <LuArrowDown className="w-3 h-3 text-red-600" />
                                            ) : null}
                                            <span className={`font-medium ${getTrendColor(grade.trend)}`}>
                                                {grade.trend > 0 ? `+${grade.trend}%` : grade.trend < 0 ? `${grade.trend}%` : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <span className="text-gray-500 text-sm">Teacher: </span>
                                    <span className="text-gray-700 text-sm">{grade.teacher}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentGradesTable;
