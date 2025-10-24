import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";

const SectionModal = ({
  isOpen,
  onClose,
  selectedSection,
  yearLevels,
  academicYears,
}) => {
  const { createSection, updateSection } = useClassManagementStore();
  const [formData, setFormData] = useState({
    name: "",
    year_level_id: "",
    academic_year_id: "",
    strand: "",
    room: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedSection) {
      setFormData({
        name: selectedSection.name || "",
        year_level_id: selectedSection.year_level_id || "",
        academic_year_id: selectedSection.academic_year_id || "",
        strand: selectedSection.strand || "",
        room: selectedSection.room || "",
        capacity: selectedSection.capacity || "",
      });
    } else {
      setFormData({
        name: "",
        year_level_id: "",
        academic_year_id: "",
        strand: "",
        room: "",
        capacity: "",
      });
    }
    setErrors({});
  }, [selectedSection, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? (value ? parseInt(value) : "") : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Section name is required";
    }

    if (!formData.year_level_id) {
      newErrors.year_level_id = "Year level is required";
    }

    if (!formData.academic_year_id) {
      newErrors.academic_year_id = "Academic year is required";
    }

    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        name: formData.name,
        year_level_id: parseInt(formData.year_level_id),
        academic_year_id: parseInt(formData.academic_year_id),
        room: formData.room,
        capacity: parseInt(formData.capacity),
      };

      // Only include strand if it has a value
      if (formData.strand.trim()) {
        dataToSubmit.strand = formData.strand;
      }

      if (selectedSection) {
        await updateSection(selectedSection.id, dataToSubmit);
      } else {
        await createSection(dataToSubmit);
      }
      onClose();
    } catch (err) {
      console.error("Section error:", err);
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedSection ? "Edit Section" : "Add Section"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Section Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Section Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                required
                placeholder="e.g., Grade 7-A"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year Level <span className="text-red-500">*</span>
              </label>
              <select
                name="year_level_id"
                value={formData.year_level_id}
                onChange={handleChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.year_level_id
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Year Level</option>
                {yearLevels && yearLevels.length > 0 ? (
                  yearLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No year levels available</option>
                )}
              </select>
              {errors.year_level_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.year_level_id}
                </p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.academic_year_id
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Academic Year</option>
                {academicYears && academicYears.length > 0 ? (
                  academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                      {year.is_current ? " (Current)" : ""}
                    </option>
                  ))
                ) : (
                  <option disabled>No academic years available</option>
                )}
              </select>
              {errors.academic_year_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.academic_year_id}
                </p>
              )}
            </div>

            {/* Strand (for G11/G12) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Strand (for G11/G12)
              </label>
              <input
                type="text"
                name="strand"
                value={formData.strand}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., STEM, ABM, HUMSS"
                disabled={isSubmitting}
              />
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.room ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                required
                placeholder="e.g., Room 101"
                disabled={isSubmitting}
              />
              {errors.room && (
                <p className="text-red-500 text-xs mt-1">{errors.room}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.capacity
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
                placeholder="e.g., 40"
                min="1"
                disabled={isSubmitting}
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow disabled:bg-indigo-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? "Saving..."
                  : selectedSection
                  ? "Update"
                  : "Save"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;
