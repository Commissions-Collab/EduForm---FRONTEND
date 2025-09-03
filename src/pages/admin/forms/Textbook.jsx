import React, { useEffect, useState } from "react";
import {
  LuBadgeAlert,
  LuSearch,
  LuBookOpen,
  LuUsers,
  LuClock,
  LuTriangleAlert,
  LuCircleCheck,
} from "react-icons/lu";
import TextbookTable from "../../../components/admin/TextbookTable";
import useTextbooksStore from "../../../stores/admin/textbookStore";

const Textbook = () => {
  const { fetchTextbooks, textbooks, loading } = useTextbooksStore();
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

  const statsCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: LuBookOpen,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
    },
    {
      title: "Total Copies",
      value: totalCopies,
      icon: LuUsers,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
    },
    {
      title: "Currently Issued",
      value: totalIssued,
      icon: LuClock,
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
    },
    {
      title: "Available",
      value: totalAvailable,
      icon: LuCircleCheck,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-900",
    },
  ];

  return (
    <main className=" bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Textbook</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                SF3
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              placeholder="Search textbooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {loading ? "..." : stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Card */}
      {totalOverdue > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-sm">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <LuTriangleAlert className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Missing Textbook Alert
                </h3>
                <p className="text-sm text-red-700 leading-relaxed">
                  <span className="font-semibold">{totalOverdue}</span> textbook
                  {totalOverdue !== 1 ? "s are" : " is"} currently overdue and
                  need{totalOverdue === 1 ? "s" : ""} to be returned.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    <LuUsers className="w-4 h-4 mr-1.5" />
                    View Overdue List
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
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
