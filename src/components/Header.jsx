import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { LuUsers, LuSettings, LuBell } from "react-icons/lu";

const Header = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  return (
    <header className="header w-full border-gray-100 bg-white">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h1>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-5">
            <p className="font-medium bg-blue-500 p-3 rounded-full text-xl text-gray-100">
              <LuBell />
            </p>
            <p className="font-medium bg-blue-500 p-3 rounded-full text-xl text-gray-100">
              <LuSettings />
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
