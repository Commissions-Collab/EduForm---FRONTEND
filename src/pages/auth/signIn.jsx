// src/pages/SignIn.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { useAuthStore } from "../../stores/auth";
const SignIn = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    // Clear any existing API errors before attempting login
    clearErrors("api");

    const result = await login(formData);

    if (result.success && result.user) {
      navigate(`/${result.user.role}/dashboard`, { replace: true });
    } else {
      setError("api", {
        type: "manual",
        message: result.message || "Login failed. Please try again.",
      });
    }
  };

  // Clear API errors when user starts typing in either field
  const handleInputChange = (fieldName) => (e) => {
    if (errors.api) {
      clearErrors("api");
    }
    setValue(fieldName, e.target.value, { shouldValidate: true });
  };

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 overflow-y-auto max-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="form-input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              onChange={handleInputChange("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              onChange={handleInputChange("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {errors.api && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.api.message}
          </p>
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
          disabled={isLoggingIn}
          className={`w-full flex justify-center items-center gap-2 font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5
    ${
      isLoggingIn
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-[#3730A3] hover:bg-[#2C268C] text-white"
    }
  `}
        >
          {isLoggingIn ? (
            <>
              <span>Logging in...</span>
              <ClipLoader size={18} color="#ffffff" />
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="flex justify-center mt-5">
          <span className="text-gray-600 text-sm">Don't have an account?</span>
          <Link
            to="/sign-up"
            className="ml-1 text-[#3730A3] hover:text-[#2C268C] hover:underline text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
