import React, { useEffect, useState } from "react";
import { LuBadgeAlert, LuSearch } from "react-icons/lu";
import WorkloadCards from "../../../components/admin/WorkloadCards";
import WorkloadTable from "../../../components/admin/WorkloadTable";
import { useAdminStore } from "../../../stores/useAdminStore";

const Workload = () => {
  const { fetchWorkloads } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWorkloads();
  }, []);

  return (
    <main className="p-4">
      {/* Page Title + Search */}
      <div className="between">
        <div className="page-title">Workload Management (SF7)</div>
        <div className="items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="Search section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <WorkloadCards />
        <WorkloadTable searchTerm={searchTerm} />
      </div>
    </main>
  );
};

export default Workload;
