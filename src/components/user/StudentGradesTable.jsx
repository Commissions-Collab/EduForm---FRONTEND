import React from "react";
import { LuGauge, LuAward, LuArrowUp, LuArrowDown } from "react-icons/lu";
import { useStoreUser } from "../../stores/useStoreUser";

const StudentGradesTable = ({ pageTitle = "Quarterly Grades (SF9)" }) => {
    const {
        gradesData,
        quarterlyAverage,
        honorsEligibility,
        quarterOptions,
        selectedQuarter,
        setSelectedQuarter,
        loading,
        error,
    } = useStoreUser();

    const getStatusColor = (status) => {
        switch (status) {
            case "above": return "bg-green-500";
            case "below": return "bg-red-500";
            default: return "bg-yellow-500";
        }
    };

    const getTrendColor = (trend) => {
        if (trend.includes("+")) return "text-green-600";
        if (trend.includes("-")) return "text-red-600";
        return "text-gray-600";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 ">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
                        {pageTitle}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">Quarter:</span>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                        >
                            {quarterOptions.map((quarter, index) => (
                                <option key={index} value={quarter}>
                                    {quarter}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

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
                                                {quarterlyAverage}%
                                            </span>
                                        </div>
                                    </div>
                                    {honorsEligibility && (
                                        <div className="flex items-center gap-3 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
                                            <LuAward className="w-5 h-5 text-yellow-600" />
                                            <span className="text-yellow-800 font-semibold text-sm sm:text-base">
                                                With High Honors Eligibility
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
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-gray-500">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                    Loading grades...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12">
                                                <div className="text-red-500 font-medium">
                                                    Error: {error}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : gradesData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12">
                                                <div className="text-gray-500 font-medium">
                                                    No grade data available for this quarter.
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        gradesData.map((data, index) => (
                                            <tr 
                                                key={index} 
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="py-3 sm:py-4 px-2">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getStatusColor(data.status)}`}></span>
                                                        <span className="font-medium text-gray-900 text-sm lg:text-base">
                                                            {data.subject}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 sm:py-4 px-2">
                                                    <span className="font-bold text-gray-900 text-sm lg:text-base">
                                                        {data.grade}%
                                                    </span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-2">
                                                    <span className="text-gray-600 text-sm lg:text-base">
                                                        {data.classAverage}%
                                                    </span>
                                                </td>
                                                <td className="py-3 sm:py-4 px-2">
                                                    <div className={`flex items-center gap-1 font-medium text-sm lg:text-base ${getTrendColor(data.trend)}`}>
                                                        {data.trend.includes("+") && (
                                                            <LuArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        )}
                                                        {data.trend.includes("-") && (
                                                            <LuArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        )}
                                                        <span>{data.trend}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 sm:py-4 px-2">
                                                    <span className="text-gray-600 text-sm lg:text-base">
                                                        {data.teacher}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden space-y-4">
                            {loading ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        Loading grades...
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <div className="text-red-500 font-medium">
                                        Error: {error}
                                    </div>
                                </div>
                            ) : gradesData.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 font-medium">
                                        No grade data available for this quarter.
                                    </div>
                                </div>
                            ) : (
                                gradesData.map((data, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`}></span>
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {data.subject}
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-1 font-medium text-sm ${getTrendColor(data.trend)}`}>
                                                {data.trend.includes("+") && (
                                                    <LuArrowUp className="h-3 w-3" />
                                                )}
                                                {data.trend.includes("-") && (
                                                    <LuArrowDown className="h-3 w-3" />
                                                )}
                                                <span>{data.trend}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600 block">Grade</span>
                                                <span className="font-bold text-gray-900">{data.grade}%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 block">Class Average</span>
                                                <span className="text-gray-900">{data.classAverage}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <span className="text-gray-600 text-xs">Teacher: </span>
                                            <span className="text-gray-900 text-sm font-medium">{data.teacher}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentGradesTable;