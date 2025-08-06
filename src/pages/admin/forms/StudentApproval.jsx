import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useAdminStore } from "../../../stores/useAdminStore";
import Pagination from "../../../components/admin/Pagination";

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
  } = useAdminStore();

  useEffect(() => {
    fetchStudentRequests();
  }, []);

  const currentRequests = paginatedStudentRequests();

  return (
    <div className="bg-gray-50">
      <main className="p-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-title">Student Approval</h1>
              <p className="mt-2 text-sm text-gray-600 hidden sm:block">
                Review and approve pending student registration requests
              </p>
            </div>
            <div className="flex items-center justify-start sm:justify-end">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentRequests.length} pending
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 hidden sm:block">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Requests
            </h3>
          </div>

          {/* Loading State */}
          {loadingStudentRequests ? (
            <div className="py-16 sm:py-20">
              <div className="flex flex-col items-center space-y-3">
                <ClipLoader size={35} color="#4F46E5" />
                <p className="text-gray-500 text-sm">
                  Loading student requests...
                </p>
              </div>
            </div>
          ) : currentRequests.length === 0 ? (
            /* Empty State */
            <div className="py-16 sm:py-20">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-gray-900 font-medium">
                    No pending requests
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    All student requests have been processed.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        LRN
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Birthday
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Parent's Name
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRequests.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-gray-900">
                            {request.LRN}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-gray-900">
                            {request.first_name} {request.middle_name}{" "}
                            {request.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700">
                            {request.birthday}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full uppercase ${
                              request.gender === "male"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {request.gender}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700">
                            {request.parents_fullname || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => approveStudentRequest(request.id)}
                              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => rejectStudentRequest(request.id)}
                              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Reject
                            </button>
                          </div>
                          {/* Display error */}
                          {studentRequestError && (
                            <div className="mt-2 text-center">
                              <div className="inline-flex items-center px-2 py-1 bg-red-50 border border-red-200 rounded-md">
                                <svg
                                  className="w-4 h-4 text-red-500 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                                <span className="text-xs text-red-700">
                                  {studentRequestError}
                                </span>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (shown on mobile and tablet) */}
              <div className="lg:hidden divide-y divide-gray-200">
                {currentRequests.map((request, index) => (
                  <div key={request.id} className="p-4 sm:p-6 space-y-4">
                    {/* Student Info Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {request.first_name} {request.middle_name}{" "}
                          {request.last_name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          LRN: {request.LRN}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          request.gender === "Male"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {request.gender}
                      </span>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Birthday
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {request.birthday}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parent's Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {request.parents_fullname || "N/A"}
                        </dd>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                      <button
                        onClick={() => approveStudentRequest(request.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => rejectStudentRequest(request.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Reject
                      </button>
                    </div>

                    {/* Error Message for Mobile */}
                    {studentRequestError && (
                      <div className="mt-3">
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <span className="text-sm text-red-700">
                            {studentRequestError}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
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
    </div>
  );
};

export default StudentApproval;
