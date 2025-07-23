import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="mb-4">
        <div className="w-16 h-16 bg-[#3730A3] rounded-full flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-[#3730A3] mb-2">AcadFlow</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-1">
        404 - Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      <Link
        to="/"
        className="bg-[#3730A3] text-white px-6 py-2 rounded-lg hover:bg-[#2c288f] transition duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
