import React, { useState } from "react";
import {
  LuPlus,
  LuRefreshCw,
  LuBadgeAlert,
  LuClock,
  LuPen,
  LuFileInput,
} from "react-icons/lu";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import FormModal from "../../components/superadmin/FormModal";

const FormsManagement = () => {
  const { formData, formErrors, clearForm, resetFormsManagementStore } =
    useFormsManagementStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState(null);

  const formTypes = [
    { id: "academicYear", name: "Academic Year" },
    { id: "calendarEvent", name: "Calendar Event" },
    { id: "student", name: "Student" },
    { id: "enrollment", name: "Enrollment" },
    { id: "yearLevel", name: "Year Level" },
    { id: "section", name: "Section" },
    { id: "teacher", name: "Teacher" },
    { id: "schedule", name: "Schedule" },
  ];

  const handleEditForm = (formType) => {
    setSelectedFormType(formType);
    setIsModalOpen(true);
  };

  const handleClearForm = (formType) => {
    if (
      window.confirm(
        `Are you sure you want to clear the ${formType.name} form data?`
      )
    ) {
      clearForm(formType.id);
    }
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset all form data?")) {
      resetFormsManagementStore();
    }
  };

  const FormsSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Forms Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage form data for various school entities
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <LuFileInput className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Total Forms:</span>
                  <span className="font-semibold text-indigo-600">
                    {formTypes.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedFormType(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <LuPlus className="w-4 h-4" />
                  <span>Add Form Data</span>
                </button>
                <button
                  onClick={handleResetAll}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <LuRefreshCw className="w-4 h-4" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Form Types
                      </h2>
                      <p className="text-sm text-gray-600">
                        View and manage form data for different entities
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formTypes.length} form types available
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <LuFileInput className="w-4 h-4" />
                          Form Type
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Data Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Errors
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formTypes.map((formType) => (
                      <tr
                        key={formType.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <LuFileInput className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formType.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              Object.keys(formData[formType.id]).length > 0
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {Object.keys(formData[formType.id]).length > 0
                              ? "Filled"
                              : "Empty"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">
                          {formErrors[formType.id] || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => handleEditForm(formType)}
                            >
                              <LuPen className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleClearForm(formType)}
                            >
                              <LuRefreshCw className="w-3.5 h-3.5" />
                              Clear
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <LuClock className="w-5 h-5 text-indigo-600" />
                <span>Form Status Overview</span>
              </h2>
              <div className="space-y-3">
                {formTypes.map((formType) => (
                  <div
                    key={formType.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formType.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formErrors[formType.id]
                          ? "Has errors"
                          : Object.keys(formData[formType.id]).length > 0
                          ? "Data filled"
                          : "No data"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFormType(null);
          }}
          formType={selectedFormType}
        />
      </div>
    </div>
  );
};

export default FormsManagement;
