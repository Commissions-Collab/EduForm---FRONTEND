import React, { useEffect, useState } from "react";

import {
  Search,
  BookOpen,
  Users,
  Clock,
  TriangleAlert,
  CircleCheck,
  FileSpreadsheet,
} from "lucide-react";
import TextbookTable from "../../../components/admin/TextbookTable";
import useTextbooksStore from "../../../stores/admin/textbookStore";

const Textbook = () => {
  const { fetchTextbooks, textbooks, loading, exportSF3Excel } = useTextbooksStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTextbooks();
  }, [fetchTextbooks]);

  // Calculate statistics
  const totalBooks = textbooks?.length || 0;
  const totalCopies =
    textbooks?.reduce((sum, book) => sum + (book.total_copies || 0), 0) || 0;
  const totalIssued =
    textbooks?.reduce(
      (sum, book) => sum + ((book.total_copies || 0) - (book.available || 0)),
      0
    ) || 0;
  const totalOverdue =
    textbooks?.reduce((sum, book) => sum + (book.overdue_count || 0), 0) || 0;
  const totalAvailable =
    textbooks?.reduce((sum, book) => sum + (book.available || 0), 0) || 0;

  const handleExportSF3Excel = async () => {
    try {
      await exportSF3Excel();
    } catch (err) {
      console.error("SF3 Export failed:", err);
    }
  };

  const statsCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: BookOpen,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
    },
    {
      title: "Total Copies",
      value: totalCopies,
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
    },
    {
      title: "Currently Issued",
      value: totalIssued,
      icon: Clock,
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
    },
    {
      title: "Available",
      value: totalAvailable,
      icon: CircleCheck,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-900",
    },
  ];

  return (
    <main className="bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="page-title text-base sm:text-lg lg:text-xl">
              Textbook
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
              <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                SF3
              </span>
            </div>
          </div>

          {/* Search Bar and Export Button */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <button
              onClick={handleExportSF3Excel}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              title="Export SF3 Textbook Inventory Excel"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={18} />
                  <span>Export SF3 Excel</span>
                </>
              )}
            </button>
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                placeholder="Search textbooks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                    {stat.title}
                  </p>
                  <p
                    className={`text-lg sm:text-2xl font-bold ${stat.textColor}`}
                  >
                    {loading ? "..." : stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}
                >
                  <stat.icon className={`w-4 h-4  ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Card */}
      {totalOverdue > 0 && (
        <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-3">
              <div className="flex-shrink-0 self-center sm:self-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TriangleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-1 sm:mb-2">
                  Missing Textbook Alert
                </h3>
                <p className="text-sm sm:text-base text-red-700 leading-relaxed">
                  <span className="font-semibold">{totalOverdue}</span> textbook
                  {totalOverdue !== 1 ? "s are" : " is"} currently overdue and
                  need{totalOverdue === 1 ? "s" : ""} to be returned.
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center px-2.5 sm:px-3 py-1.5 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    View Overdue List
                  </button>
                  <button className="inline-flex items-center px-2.5 sm:px-3 py-1.5 border border-red-300 text-red-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                    Send Reminders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Textbook Table */}
      <TextbookTable searchTerm={searchTerm} />
    </main>
  );
};

export default Textbook;
