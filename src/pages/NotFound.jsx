import React from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft, LuHouse } from "react-icons/lu";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-indigo-100  rounded-full flex items-center justify-center mx-auto mb-3 ">
            <img
              src="/logo/acadflow.png"
              alt="AcadFlow Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="hidden text-white text-2xl font-bold">AF</div>
          </div>
          <h1 className="text-2xl font-bold text-[#3730A3]">AcadFlow</h1>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-[#3730A3] mb-4 opacity-50">
            404
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Oops! The page you're looking for seems to have wandered off. Let's
            get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-[#3730A3] text-white px-6 py-3 rounded-lg hover:bg-[#2c288f] transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
          >
            <LuHouse size={18} />
            Go Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-white text-[#3730A3] px-6 py-3 rounded-lg border border-[#3730A3] hover:bg-[#3730A3] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <LuArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Additional Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support or try
            refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
