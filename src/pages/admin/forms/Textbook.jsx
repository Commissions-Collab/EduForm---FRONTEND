import React, { useEffect, useState } from "react";
import { LuBadgeAlert, LuSearch } from "react-icons/lu";
import TextbookTable from "../../../components/admin/TextbookTable";
import { useTextbookStore } from "../../../stores/useTextbookStore";

const Textbook = () => {
  const { fetchTextbooks } = useTextbookStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTextbooks();
  }, []);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">
          Textbook Accountability (SF3): Grade 10-A
        </div>
        <div className="items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="Search textbook..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 red-card">
        <div className="flex items-center gap-5">
          <LuBadgeAlert className="red-card-icon" />
          <div className="flex flex-col">
            <span className="text-md text-[#B91C1C] font-semibold">
              Missing Textbook Alert
            </span>
            <span className="text-sm text-[#B91C1C]/80">
              15 students have not returned their textbooks.
            </span>
          </div>
        </div>
      </div>

      <TextbookTable searchTerm={searchTerm} />
    </main>
  );
};

export default Textbook;
