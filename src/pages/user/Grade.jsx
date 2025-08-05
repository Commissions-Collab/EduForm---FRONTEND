// src/pages/Grades.jsx
import React, { useEffect } from "react";
import StudentGradesTable from "../../components/user/StudentGradesTable";
import { useStoreUser } from "../../stores/useStoreUser";

const Grades = () => {
    const {
        gradesData,
        fetchGrades,
        fetchQuarterOptions,
        quarterOptions,
        selectedQuarter,
        setSelectedQuarter,
        gradesLoading,
        gradesError,
        clearGradesError
    } = useStoreUser();

    useEffect(() => {
        fetchGrades();
        fetchQuarterOptions();
    }, [fetchGrades, fetchQuarterOptions]);

    const pageTitle = "Quarterly Grades (SF9)";

    if (gradesLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (gradesError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
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
                        <p className="mb-2">{gradesError}</p>
                        <p className="text-xs">This could be because:</p>
                        <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                            <li>No active quarter is currently set</li>
                            <li>Grades haven't been recorded yet</li>
                            <li>You're not enrolled in any subjects</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <button 
                            onClick={clearGradesError}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
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
                            value={selectedQuarter || gradesData.quarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                        >
                            {quarterOptions.map((quarter, index) => (
                                <option key={index} value={quarter.name}>
                                    {quarter.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grades Summary */}
                {gradesData.quarter && gradesData.quarter_average > 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-700">Current Quarter</h3>
                                <p className="text-2xl font-bold text-blue-600">{gradesData.quarter}</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-700">Quarter Average</h3>
                                <p className="text-2xl font-bold text-green-600">{gradesData.quarter_average}%</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-700">Honors Eligibility</h3>
                                <p className={`text-lg font-semibold ${
                                    gradesData.honors_eligibility ? 'text-purple-600' : 'text-gray-500'
                                }`}>
                                    {gradesData.honors_eligibility || 'Not eligible'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    No Active Quarter
                                </h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    There is currently no active quarter. Grades will be available once a quarter is active.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grades Table Component */}
                <StudentGradesTable />
            </div>
        </div>
    );
};

export default Grades;
