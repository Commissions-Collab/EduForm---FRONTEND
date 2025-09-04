import React, { useState } from "react";
import { LuSearch, LuFileInput, LuCircleAlert } from "react-icons/lu";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import FormsEditModal from "../../components/superadmin/FormsEditModal";
import FormsTable from "../../components/superadmin/FormsTable";

const FormsManagement = () => {
  const { formData, formErrors, clearAllForms } = useFormsManagementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState(null);

  // Open modal for editing a form type
  const handleOpenModal = (formType) => {
    setSelectedFormType(formType);
    setIsModalOpen(true);
  };

  // Calculate summary stats
  const formTypes = Object.keys(formData);
  const totalForms = formTypes.length;
  const formsWithErrors = Object.keys(formErrors).filter(
    (key) => formErrors[key]
  ).length;

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Forms Management</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Search form types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Form Types
                </p>
                <p className="text-2xl font-bold text-blue-900">{totalForms}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuFileInput className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">
                  Forms with Errors
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {formsWithErrors}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <LuCircleAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear All Forms Button */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => {
            clearAllForms();
          }}
        >
          <LuFileInput className="inline-block mr-2 w-5 h-5" />
          Clear All Forms
        </button>
      </div>

      {/* Forms Table */}
      <FormsTable searchTerm={searchTerm} onEdit={handleOpenModal} />

      {/* Edit Modal */}
      <FormsEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFormType(null);
        }}
        formType={selectedFormType}
      />
    </main>
  );
};

export default FormsManagement;
