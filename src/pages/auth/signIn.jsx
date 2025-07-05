import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"> 
      <form className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg space-y-6 relative overflow-hidden"> 

        <h1 className="text-4xl font-extrabold text-[#3730A3] text-center mb-2 animate-fadeInDown"> 
          EduForm
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
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400" // Enhanced focus, padding, border
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400" // Enhanced focus, padding, border
          />
        </div>

        <div className="flex justify-end pt-2"> 
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#3730A3] hover:text-[#2C268C] hover:underline transition-colors duration-200" // Added font-medium, transition
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#3730A3] hover:bg-[#2C268C] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5" // Increased padding, bolder font, shadow, slight lift on hover
        >
          Login
        </button>

        <div className="flex justify-center mt-5"> 
          <span className="text-gray-600 text-sm">Don't have an account?</span> 
          <Link
            to="/sign-up"
            className="ml-1 text-[#3730A3] hover:text-[#2C268C] hover:underline text-sm font-medium transition-colors duration-200" 
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;