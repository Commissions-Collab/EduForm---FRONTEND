import React, { useState, useEffect } from "react";
import { X, Save, Eye, EyeOff, Loader } from "lucide-react";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const TeacherModal = ({ isOpen, onClose, selectedTeacher }) => {
  const { createTeacher, updateTeacher, loading } = useTeacherManagementStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    address: "",
    phone: "",
    specialization: "",
    hired_date: "",
    status: "active",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTeacher) {
      setFormData({
        email: selectedTeacher.user?.email || "",
        password: "",
        password_confirmation: "",
        first_name: selectedTeacher.first_name || "",
        middle_name: selectedTeacher.middle_name || "",
        last_name: selectedTeacher.last_name || "",
        gender: selectedTeacher.gender || "",
        address: selectedTeacher.address || "",
        phone: selectedTeacher.phone || "",
        specialization: selectedTeacher.specialization || "",
        hired_date: selectedTeacher.hired_date || "",
        status: selectedTeacher.employment_status || "active",
      });
    } else {
      setFormData({
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        address: "",
        phone: "",
        specialization: "",
        hired_date: "",
        status: "active",
      });
    }
    setErrors({});
  }, [selectedTeacher, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation (only for new teachers or when password is provided)
    if (!selectedTeacher && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Password confirmation
    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    // Required fields
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Phone validation (if provided)
    if (formData.phone && !/^09[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be in format 09XXXXXXXXX";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = { ...formData };

      // Remove empty password fields for updates
      if (
        selectedTeacher &&
        (!dataToSubmit.password || dataToSubmit.password.trim() === "")
      ) {
        delete dataToSubmit.password;
        delete dataToSubmit.password_confirmation;
      }

      if (selectedTeacher) {
        await updateTeacher(selectedTeacher.id, dataToSubmit);
      } else {
        await createTeacher(dataToSubmit);
      }
      onClose();
    } catch (err) {
      // Handle validation errors from backend
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors || {};
        setErrors(backendErrors);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      password_confirmation: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      address: "",
      phone: "",
      specialization: "",
      hired_date: "",
      status: "active",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 sm:mx-0 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="teacher-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {selectedTeacher ? "Edit Teacher" : "Add Teacher"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors"
            aria-label="Close modal"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 border-b pb-2">
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    placeholder="teacher@example.com"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password{" "}
                    {selectedTeacher ? (
                      ""
                    ) : (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 pr-10 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={
                        selectedTeacher
                          ? "Leave blank to keep unchanged"
                          : "Enter password (min 8 characters)"
                      }
                      required={!selectedTeacher}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password{" "}
                    {selectedTeacher ? (
                      ""
                    ) : (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 pr-10 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.password_confirmation
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={
                        selectedTeacher
                          ? "Leave blank to keep unchanged"
                          : "Confirm password"
                      }
                      required={!selectedTeacher}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.first_name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    placeholder="John"
                    disabled={loading}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="middle_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Michael (optional)"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.last_name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    placeholder="Doe"
                    disabled={loading}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.gender
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="123 Main St, Barangay, City, Province"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 border-b pb-2">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="09123456789"
                    maxLength="11"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Format: 09XXXXXXXXX
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Mathematics, Science, English, etc."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="hired_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hired Date
                  </label>
                  <input
                    type="date"
                    id="hired_date"
                    name="hired_date"
                    value={formData.hired_date}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {selectedTeacher ? "Update Teacher" : "Create Teacher"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
