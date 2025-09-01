import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../stores/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const isRegistering = useAuthStore((state) => state.isRegistering);

  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm();

  const totalSteps = 4;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const nextStep = async () => {
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
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
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

    const result = await registerUser(formData, true); // true = isFormData

    if (result.success) {
      navigate("/sign-in");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>

            <div>
              <input
                {...register("LRN", { required: "LRN is required" })}
                placeholder="Learner Reference Number (LRN)"
                className={`form-input ${errors.LRN ? "border-red-500" : ""}`}
              />
              {errors.LRN && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.LRN.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  placeholder="First Name"
                  className={`form-input ${
                    errors.first_name ? "border-red-500" : ""
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("middle_name")}
                  placeholder="Middle Name (Optional)"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <input
                {...register("last_name", {
                  required: "Last name is required",
                })}
                placeholder="Last Name"
                className={`form-input ${
                  errors.last_name ? "border-red-500" : ""
                }`}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  {...register("birthday", {
                    required: "Birthday is required",
                  })}
                  className={`form-input ${
                    errors.birthday ? "border-red-500" : ""
                  }`}
                />
                {errors.birthday && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.birthday.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className={`form-input ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
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
            <input
              {...register("parents_fullname")}
              placeholder="Parent's Full Name"
              className="form-input"
            />
            <input
              {...register("relationship_to_student")}
              placeholder="Relationship"
              className="form-input"
            />
            <input
              {...register("parents_number")}
              placeholder="Parent's Number"
              className="form-input"
            />
            <input
              {...register("parents_email")}
              placeholder="Parent's Email"
              className="form-input"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Picture
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Add a profile picture to personalize your account (Optional).
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
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

              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-[#3730A3] px-4 py-2 rounded-lg border border-[#3730A3] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imagePreview ? "Change Picture" : "Upload Picture"}
              </label>

              {imageFile && (
                <p className="text-sm text-gray-600">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <input
              {...register("email", { required: true })}
              placeholder="Email"
              className="form-input"
            />
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Password"
              className="form-input"
            />
            <input
              type="password"
              {...register("password_confirmation", { required: true })}
              placeholder="Confirm Password"
              className="form-input"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 sm:p-8 md:p-10 max-h-[calc(100vh-80px)] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#3730A3] mb-2">
          AcadFlow
        </h1>
        <p className="text-gray-600 mb-2">Your pathway to knowledge.</p>
        <h2 className="text-2xl font-bold text-gray-800">
          Create Your Account
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#3730A3] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step Content */}
        <div className="min-h-[300px]">{renderStepContent()}</div>

        {/* Navigation Buttons */}
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
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-[#3730A3] text-white rounded-lg font-medium hover:bg-[#2C268C] transition-all"
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
            >
              {isRegistering ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
      </form>

      {/* Sign In Link */}
      <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
        <span className="text-gray-600 text-sm">Already have an account?</span>
        <Link
          to="/sign-in"
          className="ml-1 text-[#3730A3] hover:underline text-sm font-medium"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
