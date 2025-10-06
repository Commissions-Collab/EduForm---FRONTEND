import React, { useEffect, useState } from "react";
import { Search, Users, Clock, UserCheck, BookOpen } from "lucide-react";
import WorkloadTable from "../../../components/admin/WorkloadTable";
import useWorkloadsStore from "../../../stores/admin/workloadStore";

const Workload = () => {
  const { fetchWorkloads, workloadSummary, loading } = useWorkloadsStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkloads();
  }, [fetchWorkloads]);

  // Calculate total hours from workloads if needed
  const totalHours = workloadSummary?.total_hours || 0;

  return (
    <div className="bg-gray-50">
      <main className="p-3 sm:p-4 lg:p-6">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 page-title">
                Workload
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF7
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Class Sections Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1 truncate">
                    Class Sections
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
                    {loading ? "..." : workloadSummary?.class_sections || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-blue-100 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Students Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-green-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-green-600 mb-1 truncate">
                    Total Students
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">
                    {loading ? "..." : workloadSummary?.total_students || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-green-100 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Subject Areas Card */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1 truncate">
                    Subject Areas
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                    {loading ? "..." : workloadSummary?.subject_areas || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-purple-100 flex-shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Advisory Duties Card */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-amber-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1 truncate">
                    Advisory Duties
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">
                    {loading ? "..." : workloadSummary?.advisory_duties || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-amber-100 flex-shrink-0">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Table */}
        <WorkloadTable searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default Workload;
