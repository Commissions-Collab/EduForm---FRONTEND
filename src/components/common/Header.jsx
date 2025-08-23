import React, { useEffect, useRef, useState } from "react";
import MobileNavigation from "./MobileNavigation";
import GlobalFilterDropdown from "../admin/GlobalFilterDropdown";
import { LuMenu, LuBell } from "react-icons/lu";
import { useAuthStore } from "../../stores/useAuthStore";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifDropdownRef = useRef();

  // ✅ Get role directly from auth store
  const userRole = useAuthStore((state) => state.user?.role);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header w-full border-gray-100 bg-white">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl text-[#3730A3] hover:scale-105 transition-transform duration-300 cursor-pointer focus:outline-none xl:hidden"
        >
          <LuMenu />
        </button>

        <div className="flex w-full items-center justify-between">
          {/* ✅ Pass real role to dropdown */}
          <GlobalFilterDropdown userRole={userRole} />
          <div></div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative text-[17px] p-2 bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] rounded-full transition"
              >
                <LuBell />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                  3
                </span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b text-lg font-bold text-[#3730A3]">
                    Notifications
                  </div>
                  <ul className="text-sm max-h-60 overflow-y-auto">
                    <li className="px-4 py-3 hover:bg-gray-50">
                      3 textbooks are overdue from Grade 10-A.
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50">
                      New Biology books have been added to the inventory.
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50">
                      System maintenance scheduled for July 20.
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-100 text-center text-blue-600 font-medium cursor-pointer">
                      View all
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {menuOpen && <MobileNavigation onClose={() => setMenuOpen(false)} />}
    </>
  );
};

export default Header;
