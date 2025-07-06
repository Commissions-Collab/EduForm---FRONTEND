import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { FaBell } from "react-icons/fa";

const Header = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  return (
    <header className="header w-full border-gray-100 bg-white">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800">{user?.name}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
