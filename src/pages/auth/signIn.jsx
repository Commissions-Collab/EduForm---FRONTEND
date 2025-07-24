import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const SignIn = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await login(form);

      if (res.success) {
        navigate(`/${res.user.role}/dashboard`);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-[#3730A3] text-center mb-2">
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
            value={form.email}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <div className="flex justify-end pt-2">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#3730A3] hover:text-[#2C268C] hover:underline transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#3730A3] hover:bg-[#2C268C] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
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
