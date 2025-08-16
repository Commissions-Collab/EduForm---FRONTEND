import React, { useEffect, useState } from "react";
import {
  LuSearch,
  LuUsers,
  LuBookOpen,
  LuClock,
  LuUserCheck,
  LuCalendarDays,
  LuTrendingUp,
} from "react-icons/lu";
import WorkloadTable from "../../../components/admin/WorkloadTable";
import { useAdminStore } from "../../../stores/useAdminStore";

const Workload = () => {
  const { fetchWorkloads, workloads, loading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const totalSections = workloads?.length || 0;
  const totalStudents =
    workloads?.reduce((sum, record) => sum + (record.students || 0), 0) || 0;
  const totalHours =
    workloads?.reduce((sum, record) => sum + (record.hours_per_week || 0), 0) ||
    0;
  const advisoryCount =
    workloads?.filter((record) => record.advisory_role === "Yes").length || 0;

  return (
    <main className=" bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Workload </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800  rounded-full font-medium">
                SF7
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
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Sections
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {loading ? "..." : totalSections}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {loading ? "..." : totalStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuBookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Total Hours
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {loading ? "..." : totalHours}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LuClock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Advisory Roles
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {loading ? "..." : advisoryCount}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <LuUserCheck className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Workload Table */}
      <WorkloadTable searchTerm={searchTerm} />
    </main>
  );
};

export default Workload;
