// src/components/UserComponents/StudentGradesTable.jsx
import React from "react";
import { useGradesStoreUser } from "../../stores/useGradesStoreUser";

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
    } = useGradesStoreUser();

    return (
        <div className="bg-white rounded-lg shadow-md container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {pageTitle}
                </h2>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                    <span className="text-gray-600">Quarter:</span>
                    <select
                        className="select select-bordered select-sm sm:select-md rounded-lg border"
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

            {/* Grade Summary */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Grade Summary
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm font-medium">
                        <span className="flex items-center gap-1 text-green-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                            Above Average
                        </span>
                        <span className="flex items-center gap-1 text-yellow-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                            Average
                        </span>
                        <span className="flex items-center gap-1 text-red-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            Below Average
                        </span>
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm sm:text-base">
                        {/* Gauge Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M12 12l6 4"></path>
                            <path d="M12 12v6"></path>
                            <path d="M12 12l-6 4"></path>
                        </svg>
                        <span className="text-blue-800 font-semibold">Quarterly Average</span>
                        <span className="text-2xl sm:text-3xl font-bold text-blue-800">
                            {quarterlyAverage}%
                        </span>
                    </div>
                    {honorsEligibility && (
                        <div className="flex items-center gap-2 text-yellow-700 font-semibold text-sm sm:text-base">
                            {/* Shield Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" className="w-5 h-5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                <path d="M9 12l2 2l4-4"></path>
                            </svg>
                            <span>With High Honors Eligibility</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-[600px] table w-full text-sm sm:text-base">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-5">Subject</th>
                            <th className="pb-5">Grade</th>
                            <th className="pb-5">Class Average</th>
                            <th className="pb-5">Trend</th>
                            <th className="pb-5">Teacher</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Loading grades...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-red-500">Error: {error}</td>
                            </tr>
                        ) : gradesData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No grade data available for this quarter.</td>
                            </tr>
                        ) : (
                            gradesData.map((data, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className={`w-2.5 h-2.5 rounded-full ${
                                                data.status === "above"
                                                    ? "bg-green-500"
                                                    : data.status === "below"
                                                    ? "bg-red-500"
                                                    : "bg-yellow-500"
                                            }`}></span>
                                            <span className="text-sm sm:text-base">{data.subject}</span>
                                        </div>
                                    </td>
                                    <td className="font-bold whitespace-nowrap">{data.grade}%</td>
                                    <td className="whitespace-nowrap">{data.classAverage}%</td>
                                    <td>
                                        <span className={`flex items-center gap-1 ${
                                            data.trend.includes("+") ? "text-green-600" : "text-red-600"
                                        }`}>
                                            {data.trend.includes("+") && (
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                            )}
                                            {data.trend.includes("-") && (
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            )}
                                            {data.trend}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap">{data.teacher}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentGradesTable;
