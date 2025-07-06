import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 relative overflow-hidden max-h-[calc(100vh-80px)] overflow-y-auto">

      <h1 className="text-4xl font-extrabold text-[#3730A3] text-center mb-2">
        EduForm
      </h1>

      <p className="text-gray-600 text-center mb-6 text-md">
        Your pathway to knowledge.
      </p>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Create Your Account
      </h2>

      <form className="space-y-4">
        <input
          type="text"
          name="lrn"
          placeholder="Learner Reference Number (LRN)"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name (Optional)"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dateOfBirth"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            id="gender"
            name="gender"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Prefer not to say</option>
          </select>
        </div>

        {/* Parent/Guardian Information Section */}
        <div className="py-3">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Parent/Guardian Information
            </h3>
            <input
              type="text"
              name="parentGuardianFullName"
              placeholder="Parent/Guardian Full Name"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              required
            />
            <input
              type="text"
              name="relationshipToStudent"
              placeholder="Relationship to Student (e.g., Mother, Father)"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              required
            />
            <input
              type="tel"
              name="parentGuardianContact"
              placeholder="Parent/Guardian Contact Number"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              required
            />
            <input
              type="email"
              name="parentGuardianEmail"
              placeholder="Parent/Guardian Email Address (Optional)"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Student's Email address"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#3730A3] hover:bg-[#2C268C] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mt-4"
        >
          Sign Up
        </button>
      </form>

      <div className="flex justify-center mt-5">
        <span className="text-gray-600 text-sm">Already have an account?</span>
        <Link
          to="/sign-in"
          className="ml-1 text-[#3730A3] hover:text-[#2C268C] hover:underline text-sm font-medium transition-colors duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
