import React, { useEffect, useState } from "react";
import { Search, Users, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import TeacherModal from "../../components/superadmin/TeacherModal";
import TeacherManagementTable from "../../components/superadmin/TeacherManagementTable";
import AssignScheduleModal from "../../components/superadmin/AssignScheduleModal";
import AssignAdviserModal from "../../components/superadmin/AssignAdviserModal";
import AssignSubjectModal from "../../components/superadmin/AssignSubjectModal";
import TeacherDetailsModal from "../../components/superadmin/TeacherDetailsModal";

const TeacherManagement = () => {
  const {
    teachers,
    pagination,
    loading,
    error,
    fetchTeachers,
    deleteTeacher,
    removeAdviser,
    clearError,
  } = useTeacherManagementStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [isAdviserModalOpen, setIsAdviserModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignSubjectModalOpen, setIsAssignSubjectModalOpen] =
    useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  useEffect(() => {
    fetchTeachers(1, 25); // Fetch first page with 25 teachers
  }, [fetchTeachers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleOpenScheduleModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsScheduleModalOpen(true);
  };

  const handleOpenAdviserModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsAdviserModalOpen(true);
  };

  const handleOpenAssignSubjectModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsAssignSubjectModalOpen(true);
  };

  const handleCloseAllModals = () => {
    setIsTeacherModalOpen(false);
    setIsScheduleModalOpen(false);
    setIsAdviserModalOpen(false);
    setIsAssignSubjectModalOpen(false);
    setIsViewDetailsOpen(false);
    setSelectedTeacher(null);
  };

  const handleRemoveAdviser = async (teacher) => {
    if (!teacher?.id) return;
    const academicYearId = teacher.section_advisors?.[0]?.academic_year_id;

    if (!academicYearId) {
      toast.error("No advisory found to remove.");
      return;
    }

    if (
      window.confirm(
        `Remove ${teacher.first_name} ${teacher.last_name} as adviser?`
      )
    ) {
      try {
        await removeAdviser(teacher.id, academicYearId);
        toast.success("Adviser removed successfully.");
      } catch {
        toast.error("Failed to remove adviser.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id);
      } catch (err) {
        // Error handled by store
      }
    }
  };

  const summary = {
    totalTeachers: pagination.total,
    activeTeachers: teachers.filter((t) => t.employment_status === "active")
      .length,
    advisers: teachers.filter((t) => t.section_advisors?.length > 0).length,
  };

  return (
    <main className="bg-gray-50/50 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Teacher Management
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
              placeholder="Search teachers by name or email..."
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
                  Total Teachers
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {loading ? "..." : summary.totalTeachers}
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
                  Active Teachers
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">
                  {loading ? "..." : summary.activeTeachers}
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
                  Advisers
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">
                  {loading ? "..." : summary.advisers}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <section className="mb-6 sm:mb-8">
        <TeacherManagementTable
          title="Teachers"
          data={teachers}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          onAdd={() => {
            setSelectedTeacher(null);
            setIsTeacherModalOpen(true);
          }}
          onEdit={(teacher) => {
            setSelectedTeacher(teacher);
            setIsTeacherModalOpen(true);
          }}
          onDelete={handleDelete}
          onAssignSchedule={handleOpenScheduleModal}
          onAssignAdviser={handleOpenAdviserModal}
          onAssignSubjects={handleOpenAssignSubjectModal}
          onRemoveAdviser={handleRemoveAdviser}
          onViewDetails={(teacher) => {
            setSelectedTeacher(teacher);
            setIsViewDetailsOpen(true);
          }}
        />
      </section>

      {/* Modals */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        selectedTeacher={selectedTeacher}
      />

      <AssignScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseAllModals}
        teacher={selectedTeacher}
      />

      <AssignAdviserModal
        isOpen={isAdviserModalOpen}
        onClose={handleCloseAllModals}
        teacher={selectedTeacher}
      />

      <AssignSubjectModal
        isOpen={isAssignSubjectModalOpen}
        onClose={handleCloseAllModals}
        teacher={selectedTeacher}
      />

      <TeacherDetailsModal
        isOpen={isViewDetailsOpen}
        onClose={handleCloseAllModals}
        teacherId={selectedTeacher?.id}
      />
    </main>
  );
};

export default TeacherManagement;
