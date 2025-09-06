import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const TeacherModal = ({ isOpen, onClose, selectedTeacher }) => {
  const { createTeacher, updateTeacher } = useTeacherManagementStore();
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
  }, [selectedTeacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
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
      // Error handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl mx-4 sm:mx-0 max-h-[600px] overflow-auto"
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
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
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., teacher@example.com"
                    aria-required="true"
                  />
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
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder={
                      selectedTeacher
                        ? "Leave blank to keep unchanged"
                        : "Enter password"
                    }
                    required={!selectedTeacher}
                    aria-required={!selectedTeacher}
                  />
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
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder={
                      selectedTeacher
                        ? "Leave blank to keep unchanged"
                        : "Confirm password"
                    }
                    required={!selectedTeacher}
                    aria-required={!selectedTeacher}
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
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
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., John"
                    aria-required="true"
                  />
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
                    placeholder="e.g., Michael"
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
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., Doe"
                    aria-required="true"
                  />
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
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    aria-required="true"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 123 Main St"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Professional Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 09123456789"
                  />
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
                    placeholder="e.g., Mathematics"
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
                    aria-required="true"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              <LuSave className="w-4 h-4" />
              <span>{selectedTeacher ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
