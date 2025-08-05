import React from "react";
import { useStoreUser } from "../../stores/useStoreUser";
import { LuBookOpen, LuClock, LuCircleAlert } from "react-icons/lu";

const TextBooks = () => {
  const {
    dashboardData,
    fetchDashboard,
    dashboardLoading,
    dashboardError,
    clearDashboardError
  } = useStoreUser();

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (dashboardLoading) {
    return (
      <main className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  if (dashboardError) {
    return (
      <main className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{dashboardError}</p>
          <button 
            onClick={clearDashboardError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Textbooks (SF3)</div>
        <div className="inline-flex items-center px-2 py-1 text-sm rounded-lg bg-[#E0E7FF] text-[#3730A3]">
          <span className="ml-2">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Books Borrowed
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData.borrow_book}
              </p>
            </div>
            <LuBookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Due This Week
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {dashboardData.book_due_this_week}
              </p>
            </div>
            <LuClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Status
              </h3>
              <p className="text-lg font-semibold text-green-600 mt-2">
                {dashboardData.book_due_this_week > 0 ? 'Action Required' : 'All Good'}
              </p>
            </div>
            <LuCircleAlert className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Textbook Information</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            • You have borrowed <strong>{dashboardData.borrow_book}</strong> textbook(s) from the school library.
          </p>
          {dashboardData.book_due_this_week > 0 && (
            <p className="text-yellow-700 bg-yellow-50 p-3 rounded-lg">
              ⚠️ <strong>{dashboardData.book_due_this_week}</strong> book(s) are due this week. Please return them on time to avoid fines.
            </p>
          )}
          <p>
            • Textbooks must be returned in good condition at the end of the school year.
          </p>
          <p>
            • Late returns may result in fines or replacement charges.
          </p>
          <p>
            • Contact the library staff if you have any questions about textbook returns.
          </p>
        </div>
      </div>

      {/* Placeholder for future textbook details */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Textbook Details</h3>
        <p className="text-gray-600">
          Detailed textbook information and return schedules will be displayed here once the backend API is fully implemented.
        </p>
      </div>
    </main>
  );
};

export default TextBooks;