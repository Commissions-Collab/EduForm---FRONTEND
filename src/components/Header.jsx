import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { LuUsers, LuMenu, LuSettings, LuBell } from "react-icons/lu";

import MobileNavigation from "./MobileNavigation";

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
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.name}
          </h1>

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
