import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
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
  }, [selectedSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? parseInt(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.strand) delete dataToSubmit.strand; // Remove empty strand
      if (selectedSection) {
        await updateSection(selectedSection.id, dataToSubmit);
      } else {
        await createSection(dataToSubmit);
      }
      onClose();
    } catch (err) {
      // Error handled by store
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
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedSection ? "Edit Section" : "Add Section"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                placeholder="e.g., Section A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year Level
              </label>
              <select
                name="year_level_id"
                value={formData.year_level_id}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="">Select Year Level</option>
                {yearLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>
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
                placeholder="e.g., STEM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room
              </label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                placeholder="e.g., Room 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                placeholder="e.g., 30"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              <LuSave className="w-4 h-4" />
              <span>{selectedSection ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;
