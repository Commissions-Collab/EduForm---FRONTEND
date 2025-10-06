import React, { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";
import EnrollmentTable from "../../components/superadmin/EnrollmentTable";
import EnrollmentModal from "../../components/superadmin/EnrollmentModal";
import BulkEnrollmentModal from "../../components/superadmin/BulkEnrollmentModal";
import PromoteModal from "../../components/superadmin/PromoteModal";

const Enrollment = () => {
  const {
    enrollments,
    pagination,
    loading,
    error,
    fetchEnrollments,
    fetchStudents,
    fetchAcademicYears,
    fetchYearLevels,
    fetchSections,
    deleteEnrollment,
    clearError,
  } = useEnrollmentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchEnrollments(1, 25),
          fetchStudents(),
          fetchAcademicYears(),
          fetchYearLevels(),
          fetchSections(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [
    fetchEnrollments,
    fetchStudents,
    fetchAcademicYears,
    fetchYearLevels,
    fetchSections,
  ]);

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
        setSelectedEnrollments((prev) =>
          prev.filter((enrollment) => enrollment.id !== id)
        );
      } catch (err) {
        // Error handled by store
      }
    }
  };

  const getUniqueStudentIds = (enrollments) => {
    const uniqueStudentIds = new Set();
    enrollments.forEach((enrollment) => {
      const studentId = enrollment.student_id || enrollment.student?.id;
      if (studentId) {
        uniqueStudentIds.add(studentId);
      }
    });
    return uniqueStudentIds;
  };

  const summary = {
    totalEnrollments: pagination.total || 0,
    enrolledStudents: enrollments.filter(
      (e) => e.enrollment_status === "enrolled"
    ).length,
    uniqueEnrolledStudents: getUniqueStudentIds(
      enrollments.filter((e) => e.enrollment_status === "enrolled")
    ).size,
  };

  const getSelectedStudentIds = () => {
    return [
      ...new Set(
        selectedEnrollments
          .map((enrollment) => enrollment.student_id || enrollment.student?.id)
          .filter((id) => id !== undefined)
      ),
    ];
  };

  const handleBulkModal = () => {
    if (selectedEnrollments.length === 0) {
      toast.error("Please select students to enroll");
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handlePromoteModal = () => {
    if (selectedEnrollments.length === 0) {
      toast.error("Please select students to promote");
      return;
    }
    setIsPromoteModalOpen(true);
  };

  const handleModalClose = (modalSetter) => {
    modalSetter(false);
  };

  return (
    <main className="bg-gray-50/50 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Enrollment Management
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search by student name or LRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                  Total Enrollments
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {loading ? "..." : summary.totalEnrollments}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">
                  Enrolled (Current Page)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">
                  {loading ? "..." : summary.enrolledStudents}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                  Selected Students
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">
                  {getSelectedStudentIds().length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-6 sm:mb-8">
        <EnrollmentTable
          title="Enrollments"
          data={enrollments}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          selectedEnrollments={selectedEnrollments}
          setSelectedEnrollments={setSelectedEnrollments}
          onAdd={() => {
            setSelectedEnrollment(null);
            setIsEnrollmentModalOpen(true);
          }}
          onBulk={handleBulkModal}
          onPromote={handlePromoteModal}
          onEdit={(enrollment) => {
            setSelectedEnrollment(enrollment);
            setIsEnrollmentModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </section>

      {/* Single Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => handleModalClose(setIsEnrollmentModalOpen)}
        selectedEnrollment={selectedEnrollment}
      />

      {/* Bulk Enrollment Modal */}
      <BulkEnrollmentModal
        isOpen={isBulkModalOpen}
        onClose={() => handleModalClose(setIsBulkModalOpen)}
        selectedStudentIds={getSelectedStudentIds()}
        selectedEnrollments={selectedEnrollments}
      />

      {/* Promotion Modal */}
      <PromoteModal
        isOpen={isPromoteModalOpen}
        onClose={() => handleModalClose(setIsPromoteModalOpen)}
        selectedStudentIds={getSelectedStudentIds()}
        selectedEnrollments={selectedEnrollments}
      />
    </main>
  );
};

export default Enrollment;
