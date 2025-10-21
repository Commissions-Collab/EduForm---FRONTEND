import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../stores/auth";
import { clearStorage } from "../../lib/utils";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering, authError } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setError,
    reset,
    watch,
    clearErrors,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      LRN: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      birthday: "",
      gender: "",
      parents_fullname: "",
      relationship_to_student: "",
      parents_number: "",
      parents_email: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");
  const totalSteps = 4;

  // Handle image upload with validation
  const handleImageUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("image", { message: "Please upload a valid image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("image", { message: "Image size must be less than 5MB" });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        setError("image", { message: "Failed to read image file" });
      };
      reader.readAsDataURL(file);
    },
    [setError]
  );

  // Remove uploaded image
  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setError("image", { message: undefined });
  }, [setError]);

  // Validate and proceed to the next step
  const nextStep = useCallback(async () => {
    let fieldsToValidate = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "LRN",
          "first_name",
          "last_name",
          "birthday",
          "gender",
        ];
        break;
      case 4:
        fieldsToValidate = ["email", "password", "password_confirmation"];
        break;
      default:
        break;
    }

    try {
      if (fieldsToValidate.length > 0) {
        const isValid = await trigger(fieldsToValidate);
        if (!isValid) return;

        if (
          currentStep === 4 &&
          getValues("password") !== getValues("password_confirmation")
        ) {
          setError("password_confirmation", {
            message: "Passwords do not match",
          });
          return;
        }
      }

      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      setRegistrationError(null);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error proceeding to next step:", {
          error: error.message,
          currentStep,
        });
      }
      setError("form", { message: "An error occurred while proceeding" });
    }
  }, [currentStep, trigger, getValues, setError, totalSteps]);

  // Go to the previous step
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setRegistrationError(null);
  }, []);

  // Handle form submission with proper error recovery
  const onSubmit = useCallback(
    async (data) => {
      try {
        if (data.password !== data.password_confirmation) {
          setError("password_confirmation", {
            message: "Passwords do not match",
          });
          return;
        }

        setRegistrationError(null);

        const formData = new FormData();
        formData.append("LRN", data.LRN);
        formData.append("first_name", data.first_name);
        formData.append("middle_name", data.middle_name || "");
        formData.append("last_name", data.last_name);
        formData.append("birthday", data.birthday);
        formData.append("gender", data.gender);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
        formData.append("parents_fullname", data.parents_fullname || "");
        formData.append(
          "relationship_to_student",
          data.relationship_to_student || ""
        );
        formData.append("parents_number", data.parents_number || "");
        formData.append("parents_email", data.parents_email || "");
        if (imageFile) {
          formData.append("image", imageFile);
        }

        const result = await registerUser(formData);
        if (result.success) {
          toast.success(
            result.message ||
              "Registration request submitted. Your account will be reviewed by an administrator. You'll receive an email once approved."
          );
          // Reset form completely for fresh start
          reset();
          setImageFile(null);
          setImagePreview(null);
          setCurrentStep(1);
          setRegistrationError(null);
          clearErrors();
          navigate("/sign-in");
        } else {
          // Set specific error that can be cleared when user tries again
          setRegistrationError(result.message || "Registration failed");
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("SignUp submission error:", {
            message: error.message,
            data,
          });
        }
        setRegistrationError(
          "An unexpected error occurred during registration. Please try again."
        );
      }
    },
    [registerUser, navigate, setError, imageFile, reset, clearErrors]
  );

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>
            <div>
              <label
                htmlFor="LRN"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Learner Reference Number (LRN)
              </label>
              <input
                {...register("LRN", { required: "LRN is required" })}
                id="LRN"
                placeholder="Learner Reference Number (LRN)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                  errors.LRN ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.LRN ? "true" : "false"}
                aria-describedby={errors.LRN ? "LRN-error" : undefined}
              />
              {errors.LRN && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="LRN-error"
                  role="alert"
                >
                  {errors.LRN.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  First Name
                </label>
                <input
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  id="first_name"
                  placeholder="First Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.first_name ? "true" : "false"}
                  aria-describedby={
                    errors.first_name ? "first_name-error" : undefined
                  }
                />
                {errors.first_name && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="first_name-error"
                    role="alert"
                  >
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="middle_name"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  Middle Name (Optional)
                </label>
                <input
                  {...register("middle_name")}
                  id="middle_name"
                  placeholder="Middle Name (Optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition"
                  aria-describedby="middle_name-info"
                />
                <span id="middle_name-info" className="sr-only">
                  Optional
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Last Name
              </label>
              <input
                {...register("last_name", {
                  required: "Last name is required",
                })}
                id="last_name"
                placeholder="Last Name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.last_name ? "true" : "false"}
                aria-describedby={
                  errors.last_name ? "last_name-error" : undefined
                }
              />
              {errors.last_name && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="last_name-error"
                  role="alert"
                >
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Birthday
                </label>
                <input
                  type="date"
                  {...register("birthday", {
                    required: "Birthday is required",
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      return (
                        birthDate <= today || "Birthday cannot be in the future"
                      );
                    },
                  })}
                  id="birthday"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                    errors.birthday ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.birthday ? "true" : "false"}
                  aria-describedby={
                    errors.birthday ? "birthday-error" : undefined
                  }
                />
                {errors.birthday && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="birthday-error"
                    role="alert"
                  >
                    {errors.birthday.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  id="gender"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.gender ? "true" : "false"}
                  aria-describedby={errors.gender ? "gender-error" : undefined}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    id="gender-error"
                    role="alert"
                  >
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Parent/Guardian Information
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              All fields are optional
            </p>
            <div>
              <label
                htmlFor="parents_fullname"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Parent's Full Name
              </label>
              <input
                {...register("parents_fullname")}
                id="parents_fullname"
                placeholder="Parent's Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition"
                aria-describedby="parents_fullname-info"
              />
              <span id="parents_fullname-info" className="sr-only">
                Optional
              </span>
            </div>
            <div>
              <label
                htmlFor="relationship_to_student"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Relationship
              </label>
              <input
                {...register("relationship_to_student")}
                id="relationship_to_student"
                placeholder="Relationship"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition"
                aria-describedby="relationship_to_student-info"
              />
              <span id="relationship_to_student-info" className="sr-only">
                Optional
              </span>
            </div>
            <div>
              <label
                htmlFor="parents_number"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Parent's Number
              </label>
              <input
                {...register("parents_number", {
                  pattern: {
                    value: /^\+?\d{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                id="parents_number"
                placeholder="Parent's Number"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                  errors.parents_number ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.parents_number ? "true" : "false"}
                aria-describedby={
                  errors.parents_number
                    ? "parents_number-error"
                    : "parents_number-info"
                }
              />
              {errors.parents_number && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="parents_number-error"
                  role="alert"
                >
                  {errors.parents_number.message}
                </p>
              )}
              <span id="parents_number-info" className="sr-only">
                Optional
              </span>
            </div>
            <div>
              <label
                htmlFor="parents_email"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Parent's Email
              </label>
              <input
                {...register("parents_email", {
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                id="parents_email"
                placeholder="Parent's Email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                  errors.parents_email ? "border-red-500" : "border-gray-300"
                }`}
                aria-invalid={errors.parents_email ? "true" : "false"}
                aria-describedby={
                  errors.parents_email
                    ? "parents_email-error"
                    : "parents_email-info"
                }
              />
              {errors.parents_email && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="parents_email-error"
                  role="alert"
                >
                  {errors.parents_email.message}
                </p>
              )}
              <span id="parents_email-info" className="sr-only">
                Optional
              </span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Picture
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Add a profile picture to personalize your account.
            </p>
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    aria-label="Remove profile picture"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              )}
              <label
                className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-[#3730A3] px-4 py-2 rounded-lg border border-[#3730A3] transition-colors"
                aria-label={
                  imagePreview
                    ? "Change profile picture"
                    : "Upload profile picture"
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-describedby={errors.image ? "image-error" : "image-info"}
                />
                {imagePreview ? "Change Picture" : "Upload Picture"}
              </label>
              {imageFile && (
                <p className="text-sm text-gray-600">
                  Selected: {imageFile.name}
                </p>
              )}
              {errors.image && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="image-error"
                  role="alert"
                >
                  {errors.image.message}
                </p>
              )}
              <span id="image-info" className="sr-only">
                Optional profile picture upload
              </span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Account Details
            </h3>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 sr-only"
              >
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
                id="email"
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  id="password"
                  placeholder="Password"
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  {...register("password_confirmation", {
                    required: "Password confirmation is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  id="password_confirmation"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3730A3] focus:border-transparent outline-none transition ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  aria-invalid={errors.password_confirmation ? "true" : "false"}
                  aria-describedby={
                    errors.password_confirmation
                      ? "password_confirmation-error"
                      : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={
                    showPasswordConfirm ? "Hide password" : "Show password"
                  }
                >
                  {showPasswordConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p
                  className="text-red-500 text-sm mt-1"
                  id="password_confirmation-error"
                  role="alert"
                >
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
            {registrationError && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                role="alert"
              >
                {registrationError}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [
    currentStep,
    register,
    errors,
    imagePreview,
    imageFile,
    handleImageUpload,
    removeImage,
    showPassword,
    showPasswordConfirm,
    password,
    registrationError,
  ]);

  return (
    <div className="w-full max-w-2xl bg-white p-6 sm:p-8 md:p-10 max-h-[calc(100vh-80px)] overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#3730A3] mb-2">
          AcadFlow
        </h1>
        <p className="text-gray-600 mb-2">Your pathway to knowledge.</p>
        <h2 className="text-2xl font-bold text-gray-800">
          Create Your Account
        </h2>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full h-2"
          role="progressbar"
          aria-valuenow={Math.round((currentStep / totalSteps) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Registration progress"
        >
          <div
            className="bg-[#3730A3] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Sign Up Form"
      >
        <div className="min-h-[300px]">{renderStepContent()}</div>
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Go to previous step"
            aria-disabled={currentStep === 1}
          >
            Previous
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-[#3730A3] text-white rounded-lg font-medium hover:bg-[#2C268C] transition-all"
              aria-label="Go to next step"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isRegistering}
              className={`px-6 py-2 font-bold rounded-lg transition-all ${
                isRegistering
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              aria-label={isRegistering ? "Creating account" : "Create account"}
              aria-disabled={isRegistering}
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
      </form>
      <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
        <span className="text-gray-600 text-sm">Already have an account?</span>
        <Link
          to="/sign-in"
          className="ml-1 text-[#3730A3] hover:underline text-sm font-medium"
          aria-label="Sign in to your account"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

SignUp.propTypes = {};

export default SignUp;
