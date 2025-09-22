import React, { useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthStore from "../../stores/auth";
import { clearStorage } from "../../lib/utils";

// Type definitions for form data
/** @typedef {{ email: string, password: string }} SignInFormData */

/**
 * SignIn component for user authentication
 * @returns {JSX.Element} SignIn form component
 */
const SignIn = () => {
  const navigate = useNavigate();
  const { login, user, isLoggingIn, authError } = useAuthStore();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm();

  // Handle input change to clear API errors and update form values
  const handleInputChange = useCallback(
    (fieldName) => (e) => {
      if (errors.api) {
        clearErrors("api");
      }
      setValue(fieldName, e.target.value, { shouldValidate: true });
    },
    [clearErrors, setValue, errors.api]
  );

  // Handle form submission
  const onSubmit = useCallback(
    async (/** @type {SignInFormData} */ formData) => {
      try {
        clearErrors("api");
        const result = await login(formData);
        if (result.success && result.user) {
          navigate(`/${result.user.role}/dashboard`, { replace: true });
        } else {
          setError("api", { message: result.message || "Login failed" });
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("SignIn submission error:", {
            message: error.message,
            formData,
          });
        }
        setError("api", {
          message: "An unexpected error occurred during login",
        });
      }
    },
    [login, navigate, setError, clearStorage]
  );

  // Redirect if user is already authenticated
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
        noValidate
        aria-label="Sign In Form"
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

        {errors.api && (
          <p
            className="text-red-500 text-sm text-center mt-2"
            role="alert"
            id="api-error"
          >
            {errors.api.message}
          </p>
        )}
        {authError && !errors.api && (
          <p
            className="text-red-500 text-sm text-center mt-2"
            role="alert"
            id="auth-error"
          >
            {authError}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1 sr-only"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              className={`form-input ${errors.email ? "border-red-500" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              onChange={handleInputChange("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                className="text-red-500 text-sm mt-1"
                id="email-error"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1 sr-only"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={`form-input ${
                errors.password ? "border-red-500" : ""
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              onChange={handleInputChange("password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p
                className="text-red-500 text-sm mt-1"
                id="password-error"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#3730A3] hover:text-[#2C268C] hover:underline transition-colors duration-200"
            aria-label="Forgot your password?"
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
            }`}
          aria-label={isLoggingIn ? "Logging in" : "Login"}
          aria-disabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-center mt-5">
          <span className="text-gray-600 text-sm">Don't have an account?</span>
          <Link
            to="/sign-up"
            className="ml-1 text-[#3730A3] hover:text-[#2C268C] hover:underline text-sm font-medium"
            aria-label="Sign up for a new account"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

SignIn.propTypes = {};

export default SignIn;
