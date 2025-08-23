import React, { useState, useEffect } from "react";
import {
  LuX,
  LuUser,
  LuMail,
  LuPhone,
  LuBriefcase,
  LuShield,
  LuKey,
} from "react-icons/lu";

const UserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "Teacher",
    department: "",
    subject_area: "",
    position: "",
    status: "active",
    employee_id: "",
    hire_date: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    qualifications: "",
    experience_years: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Role options
  const roles = [
    { value: "Admin", label: "Administrator" },
    { value: "Super Admin", label: "Super Administrator" },
    { value: "Teacher", label: "Teacher" },
    { value: "Head Teacher", label: "Head Teacher" },
    { value: "Principal", label: "Principal" },
    { value: "Guidance Counselor", label: "Guidance Counselor" },
    { value: "Registrar", label: "Registrar" },
    { value: "Staff", label: "Staff" },
  ];

  // Department options
  const departments = [
    "Mathematics",
    "Science",
    "English",
    "Filipino",
    "Social Studies",
    "Physical Education",
    "Arts",
    "Technology and Livelihood Education",
    "Values Education",
    "Music",
    "Administration",
    "Guidance",
    "Library",
  ];

  // Initialize form data when user or modal opens
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Editing existing user
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || user.contact_number || "",
          role: user.role || user.position || "Teacher",
          department: user.department || user.subject_area || "",
          subject_area: user.subject_area || "",
          position: user.position || "",
          status: user.status || (user.is_active ? "active" : "inactive"),
          employee_id: user.employee_id || user.teacher_id || "",
          hire_date:
            user.hire_date || user.created_at
              ? user.created_at.split("T")[0]
              : "",
          address: user.address || "",
          emergency_contact: user.emergency_contact || "",
          emergency_phone: user.emergency_phone || "",
          qualifications: user.qualifications || user.education || "",
          experience_years: user.experience_years || "",
          password: "",
          confirm_password: "",
        });
        setShowPasswordFields(false);
      } else {
        // Adding new user - reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "Teacher",
          department: "",
          subject_area: "",
          position: "",
          status: "active",
          employee_id: "",
          hire_date: "",
          address: "",
          emergency_contact: "",
          emergency_phone: "",
          qualifications: "",
          experience_years: "",
          password: "",
          confirm_password: "",
        });
        setShowPasswordFields(true);
      }
      setErrors({});
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Password validation for new users
    if (!user || showPasswordFields) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        contact_number: formData.phone,
        is_active: formData.status === "active",
      };

      // Remove password fields if not needed
      if (user && !showPasswordFields) {
        delete submitData.password;
        delete submitData.confirm_password;
      }

      await onSave(submitData);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {user ? "Edit User Account" : "Create New User"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LuX className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <LuUser className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="text-md font-medium text-gray-900">
                    Personal Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.first_name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.last_name ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Employee ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      name="hire_date"
                      value={formData.hire_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Complete address"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <LuMail className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="text-md font-medium text-gray-900">
                    Contact Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="user@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergency_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+63 XXX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <LuBriefcase className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="text-md font-medium text-gray-900">
                    Professional Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.role ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Area
                    </label>
                    <input
                      type="text"
                      name="subject_area"
                      value={formData.subject_area}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mathematics, Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Specific position title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications
                    </label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Educational background, certifications, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <LuShield className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="text-md font-medium text-gray-900">
                      Account Security
                    </h4>
                  </div>
                  {user && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showPasswordFields
                        ? "Cancel Password Change"
                        : "Change Password"}
                    </button>
                  )}
                </div>

                {(!user || showPasswordFields) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password {!user && "*"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password {!user && "*"}
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirm_password
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm password"
                      />
                      {errors.confirm_password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {user ? "Updating..." : "Creating..."}
                    </div>
                  ) : user ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
