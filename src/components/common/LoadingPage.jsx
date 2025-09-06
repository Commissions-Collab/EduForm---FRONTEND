import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo Section with Pulse Animation */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
            <img
              src="/logo/acadflow.png"
              alt="AcadFlow Logo"
              className="w-30 h-30 object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="hidden text-white text-2xl font-bold">AF</div>
          </div>
          <h1 className="text-3xl font-bold text-[#3730A3] animate-pulse">
            AcadFlow
          </h1>
        </div>

        {/* Loading Message */}
      </div>
    </div>
  );
};

export default LoadingPage;
