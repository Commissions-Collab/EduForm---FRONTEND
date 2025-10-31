import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";
import toast from "react-hot-toast";

const SubjectModal = ({ isOpen, onClose, selectedSubject }) => {
  const { createSubjects, updateSubject } = useClassManagementStore();

  const [subjects, setSubjects] = useState([
    { name: "", code: "", description: "", units: 1, is_active: true },
  ]);

  useEffect(() => {
    if (selectedSubject) {
      setSubjects([
        {
          name: selectedSubject.name || "",
          code: selectedSubject.code || "",
          description: selectedSubject.description || "",
          units: selectedSubject.units || 1,
          is_active: selectedSubject.is_active ?? true,
        },
      ]);
    } else {
      setSubjects([
        { name: "", code: "", description: "", units: 1, is_active: true },
      ]);
    }
  }, [selectedSubject]);

  const handleAddRow = () => {
    setSubjects([
      ...subjects,
      { name: "", code: "", description: "", units: 1, is_active: true },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (subjects.length === 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSubject) {
        await updateSubject(selectedSubject.id, subjects[0]);
        toast.success("Subject updated successfully");
      } else {
        await createSubjects(subjects);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedSubject ? "Edit Subject" : "Add Subject"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="relative p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              {/* Remove Button */}
              {subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  title="Remove subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={subject.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., MATH101"
                    value={subject.code}
                    onChange={(e) =>
                      handleChange(index, "code", e.target.value.toUpperCase())
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Units */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 3"
                    min={1}
                    max={10}
                    value={subject.units}
                    onChange={(e) =>
                      handleChange(index, "units", parseInt(e.target.value))
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Basic principles of mathematics"
                    value={subject.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-2 col-span-2 mt-2">
                  <input
                    type="checkbox"
                    checked={subject.is_active}
                    onChange={(e) =>
                      handleChange(index, "is_active", e.target.checked)
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>
          ))}

          {/* Add Another */}
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Another Subject
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {selectedSubject ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;
