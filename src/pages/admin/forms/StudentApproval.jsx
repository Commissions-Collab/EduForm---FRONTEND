import React, { useEffect } from "react";
import {
  LuUserPlus,
  LuUsers,
  LuCalendar,
  LuUser,
  LuFileText,
  LuCheck,
  LuX,
  LuClock,
  LuTriangleAlert,
  LuMenu,
  LuIdCard,
} from "react-icons/lu";
import Pagination from "../../../components/admin/Pagination";
import { useAdminStore } from "../../../stores/admin";

const StudentApproval = () => {
  const {
    fetchStudentRequests,
    approveStudentRequest,
    rejectStudentRequest,
    loadingStudentRequests,
    studentRequestError,
    paginatedStudentRequests,
    studentRequestCurrentPage,
    totalStudentRequestPages,
    setStudentRequestCurrentPage,
    studentRequests,
  } = useAdminStore();

  useEffect(() => {
    fetchStudentRequests();
  }, []);

  const currentRequests = paginatedStudentRequests();
  const totalRequests = studentRequests?.length || 0;

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
    "?";

  const indexOfLast = studentRequestCurrentPage * 10;
  const indexOfFirst = indexOfLast - 10;

  return (
    <main className=" bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Student Approval</h1>
            <p className="text-sm text-gray-600">
              Review and process pending student registration requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <LuClock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {totalRequests} Pending Request{totalRequests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Pending Registration Requests
              </h2>
              <p className="text-sm text-gray-600">
                Review student information and approve or reject applications
              </p>
            </div>
            {!loadingStudentRequests && currentRequests.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, totalRequests)} of {totalRequests}{" "}
                requests
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <LuUser className="w-4 h-4" />
                    Student Information
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <LuFileText className="w-4 h-4" />
                    LRN
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    <LuIdCard className="w-4 h-4" />
                    Gender
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingStudentRequests ? (
                // Skeleton Rows
                [...Array(5)].map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-20 h-2 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-12 h-4 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <div className="w-16 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <LuUsers className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          No pending requests
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          All student registration requests have been processed
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {getInitials(request.first_name, request.last_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {request.first_name} {request.middle_name}{" "}
                            {request.last_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Student Registration
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded">
                        {request.LRN}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            request.gender?.toLowerCase() === "male"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {request.gender}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.parents_fullname || (
                          <span className="text-gray-400 italic">
                            Not provided
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveStudentRequest(request.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <LuCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectStudentRequest(request.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <LuX className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <LuMenu className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Error Display */}
        {studentRequestError && (
          <div className="px-6 py-4 border-t border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <LuTriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Processing Error
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {studentRequestError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loadingStudentRequests && currentRequests.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Pagination
              currentPage={studentRequestCurrentPage}
              totalPages={totalStudentRequestPages()}
              onPrevious={() =>
                setStudentRequestCurrentPage(
                  Math.max(studentRequestCurrentPage - 1, 1)
                )
              }
              onNext={() =>
                setStudentRequestCurrentPage(
                  Math.min(
                    studentRequestCurrentPage + 1,
                    totalStudentRequestPages()
                  )
                )
              }
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentApproval;
