import React, { useState } from "react";
import MobileNavigation from "./MobileNavigation";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { LuUsers, LuMenu, LuSettings, LuBell } from "react-icons/lu";

const Header = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const { pathname } = useLocation();

  return (
    <>
      <header className="header w-full border-gray-100 bg-white">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl text-[#3730A3] hover:scale-105 transition-transform duration-300 cursor-pointer focus:outline-none lg:hidden"
        >
          {menuOpen ? <LuMenu /> : <LuMenu />}
        </button>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800"></h1>

          {/* <div>
            <button
              onClick={() => {
                localStorage.removeItem("attendanceRecords");
                localStorage.removeItem("students");
                window.location.reload();
              }}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Reset Data
            </button>
          </div> */}

          <div className="flex items-center gap-5">
            <div className="flex items-center  gap-2 lg:gap-5">
              <p className="font-medium bg-[#3730A3] p-3 rounded-full text-xl text-white">
                <LuBell />
              </p>
              <p className="font-medium bg-[#3730A3] p-3 rounded-full text-xl text-white">
                <LuSettings />
              </p>
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
