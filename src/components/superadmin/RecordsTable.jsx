import React from "react";
import { LuFileText, LuChevronRight } from "react-icons/lu";

const RecordsTable = ({ students, loading }) => {
    return (
        <div className="mt-8">
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
            {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : students.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No records found.</div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                {students.map((student) => (
                    <tr key={student.id}>
                    <td className="px-4 py-4">
                        <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            {student.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">
                            ID: {student.id} | LRN: {student.lrn}
                            </p>
                        </div>
                        </div>
                    </td>
                    <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{student.grade}</p>
                        <p className="text-sm text-gray-500">{student.section}</p>
                    </td>
                    <td className="px-4 py-4">
                        <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === "Enrolled"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                        >
                        {student.status}
                        </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                        <div>GWA: {student.gwa}</div>
                        <div className="text-gray-500">Attendance: {student.attendance}</div>
                    </td>
                    <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                        {student.records.map((rec) => (
                            <span
                            key={rec}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded"
                            >
                            {rec}
                            </span>
                        ))}
                        </div>
                    </td>
                    <td className="px-4 py-4 text-center space-x-2">
                        <button className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <LuFileText className="w-5 h-5" />
                        </button>
                        <button className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600">
                        {/* Inline SVG for edit */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-4-11l5 5m-5-5v5h5"
                            />
                        </svg>
                        </button>
                        <button className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <LuChevronRight className="w-5 h-5" />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </div>
    );
};

export default RecordsTable;
