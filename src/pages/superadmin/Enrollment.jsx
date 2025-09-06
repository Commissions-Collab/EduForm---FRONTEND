import React, { useEffect, useState } from "react";
import { LuSearch, LuUsers, LuUserCheck } from "react-icons/lu";

import toast from "react-hot-toast";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";
import EnrollmentTable from "../../components/superadmin/EnrollmentTable";
import EnrollmentModal from "../../components/superadmin/EnrollmentModal";

const Enrollment = () => {
  const {
    enrollments,
    pagination,
    loading,
    error,
    fetchEnrollments,
    deleteEnrollment,
    clearError,
  } = useEnrollmentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    fetchEnrollments(1, 25); // Fetch first page with 25 enrollments
  }, [fetchEnrollments]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await deleteEnrollment(id);
      } catch (err) {
        // Error handled by store
      }
    }
  };

  const summary = {
    totalEnrollments: pagination.total,
    enrolledStudents: enrollments.filter(
      (e) => e.enrollment_status === "enrolled"
    ).length,
    pendingEnrollments: enrollments.filter(
      (e) => e.enrollment_status === "pending"
    ).length,
  };

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Enrollment Management
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search enrollments by student name or LRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {loading ? "..." : summary.totalEnrollments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Enrolled Students
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {loading ? "..." : summary.enrolledStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Pending Enrollments
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {loading ? "..." : summary.pendingEnrollments}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LuUserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <EnrollmentTable
          title="Enrollments"
          data={enrollments}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          onAdd={() => {
            setSelectedEnrollment(null);
            setIsEnrollmentModalOpen(true);
          }}
          onEdit={(enrollment) => {
            setSelectedEnrollment(enrollment);
            setIsEnrollmentModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </section>

      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        selectedEnrollment={selectedEnrollment}
      />
    </main>
  );
};

export default Enrollment;
