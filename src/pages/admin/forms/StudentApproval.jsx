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
    <>
      <main className="p-4">
        <div className="between">
          <div className="page-title">Student Approval</div>
          <div className="items-center"></div>
        </div>
        <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  LRN
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Birthday
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parent's Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loadingStudentRequests ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <ClipLoader size={30} color="#4F46E5" />
                  </td>
                </tr>
              ) : studentRequestError ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-red-600">
                    {studentRequestError}
                  </td>
                </tr>
              ) : currentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-gray-500">
                    No pending student requests found.
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.LRN}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.first_name} {request.middle_name}{" "}
                      {request.last_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.birthday}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.gender}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {request.parents_fullname || "N/A"}
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <button
                        onClick={() => approveStudentRequest(request.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectStudentRequest(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loadingStudentRequests && currentRequests.length > 0 && (
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
        )}
      </main>
    </>
  );
};

export default StudentApproval;
