import React, { useEffect } from "react";
import {
  Users,
  User,
  FileText,
  Check,
  X,
  Clock,
  TriangleAlert,
  Menu,
  IdCard,
} from "lucide-react";
import Pagination from "../../../components/admin/Pagination";
import useStudentRequestsStore from "../../../stores/admin/studentRequest";

const StudentApproval = () => {
  const {
    fetchStudentRequests,
    approveStudentRequest,
    rejectStudentRequest,
    loading,
    error,
    paginatedRecords,
    currentPage,
    totalPages,
    setCurrentPage,
    studentRequests,
  } = useStudentRequestsStore();

  useEffect(() => {
    fetchStudentRequests();
  }, [fetchStudentRequests]);

  const currentRequests = paginatedRecords();
  const totalRequests = studentRequests?.length || 0;

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
    "?";

  const indexOfLast = currentPage * 10;
  const indexOfFirst = indexOfLast - 10;

  // Mobile Card Component
  const MobileRequestCard = ({ request }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {getInitials(request.first_name, request.last_name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {request.first_name} {request.middle_name} {request.last_name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Student Registration</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            request.gender?.toLowerCase() === "male"
              ? "bg-blue-100 text-blue-800"
              : "bg-pink-100 text-pink-800"
          }`}
        >
          {request.gender}
        </span>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">LRN</p>
            <p className="text-sm font-mono font-medium text-gray-900 bg-gray-50 px-2 py-0.5 rounded inline-block">
              {request.LRN}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Parent/Guardian</p>
            <p className="text-sm text-gray-900 truncate">
              {request.parents_fullname || (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => approveStudentRequest(request.id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => rejectStudentRequest(request.id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
        <button className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Skeleton Card for Mobile
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-20 h-3 bg-gray-100 rounded"></div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-10 bg-gray-100 rounded"></div>
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Student Approval
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Review and process pending student registration requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {totalRequests} Pending Request{totalRequests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                Pending Registration Requests
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Review student information and approve or reject applications
              </p>
            </div>
            {!loading && currentRequests.length > 0 && (
              <div className="text-xs sm:text-sm text-gray-500">
                Showing {indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, totalRequests)} of {totalRequests}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <>
            {/* Mobile Loading */}
            <div className="block lg:hidden p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            {/* Desktop Loading */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        LRN
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <IdCard className="w-4 h-4" />
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
                  {[...Array(5)].map((_, idx) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : currentRequests.length === 0 ? (
          <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  No pending requests
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  All student registration requests have been processed
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden p-4 space-y-4">
              {currentRequests.map((request) => (
                <MobileRequestCard key={request.id} request={request} />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student Information
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        LRN
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <IdCard className="w-4 h-4" />
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
                  {currentRequests.map((request) => (
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
                        <div className="text-sm font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded inline-block">
                          {request.LRN}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            request.gender?.toLowerCase() === "male"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {request.gender}
                        </span>
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
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectStudentRequest(request.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Menu className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="px-4 sm:px-6 py-4 border-t border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <TriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Processing Error
                </p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && currentRequests.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages()}
              onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              onNext={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages()))
              }
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentApproval;
