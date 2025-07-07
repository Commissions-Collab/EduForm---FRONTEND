import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
        <form className="w-full bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg space-y-6 relative overflow-hidden">
          <h1 className="text-4xl font-extrabold text-[#3730A3] text-center mb-2 animate-fadeInDown">
            AcadFlow
          </h1>

          <p className="text-gray-600 text-center mb-6 text-md">
            Your pathway to knowledge.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login to Your Account
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#3730A3] hover:text-[#2C268C] hover:underline transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Link to="/student/dashboard">
            <button
              type="button"
              className="w-full bg-[#3730A3] hover:bg-[#2C268C] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </Link>

          <div className="flex justify-center mt-5">
            <span className="text-gray-600 text-sm">
              Don't have an account?
            </span>
            <Link
              to="/sign-up"
              className="ml-1 text-[#3730A3] hover:text-[#2C268C] hover:underline text-sm font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </form>

        {/* Dummy login */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Dummy Login</h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleLogin("superadmin")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded transition"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleLogin("admin")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded transition"
            >
              Admin
            </button>
            <button
              onClick={() => handleLogin("student")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition"
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
