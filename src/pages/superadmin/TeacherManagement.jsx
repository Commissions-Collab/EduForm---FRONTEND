import React, { useState, useEffect, useMemo } from "react";
import {
  LuUsers,
  LuPlus,
  LuTrash,
  LuRefreshCw,
  LuBadgeAlert,
  LuCalendarClock,
  LuPen,
} from "react-icons/lu";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import Pagination from "../../components/superadmin/Pagination";
import TeacherFormModal from "../../components/superadmin/TeacherFormModal";

const TeacherManagement = () => {
  const {
    teachers,
    schedules,
    isLoading,
    error,
    fetchTeachers,
    fetchSchedules,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    createTeacherSchedule,
  } = useTeacherManagementStore();
  const { updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();

  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const teachersPerPage = 10;

  useEffect(() => {
    fetchTeachers();
    fetchSchedules();
  }, [fetchTeachers, fetchSchedules]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * teachersPerPage;
    const end = start + teachersPerPage;
    return filteredTeachers.slice(start, end);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateTeacher = () => {
    clearForm("teacher");
    setFormType("teacher");
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    updateFormData("teacher", teacher);
    setFormType("teacher");
    setEditingItemId(teacher.id);
    setIsModalOpen(true);
  };

  const handleCreateSchedule = () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher first");
      return;
    }
    clearForm("schedule");
    setFormType("schedule");
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      const result = await deleteTeacher(id);
      if (result.success && selectedTeacherId === id) {
        setSelectedTeacherId(null);
      }
      const totalPagesAfterDelete = Math.ceil(
        (filteredTeachers.length - 1) / teachersPerPage
      );
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
    }
  };

  const handleSubmit = async (formData) => {
    let result;
    if (formType === "teacher") {
      if (editingItemId) {
        result = await updateTeacher(editingItemId, formData);
      } else {
        result = await createTeacher(formData);
      }
    } else if (formType === "schedule") {
      result = await createTeacherSchedule({
        ...formData,
        teacher_id: selectedTeacherId,
      });
    }
    if (result?.success) {
      setIsModalOpen(false);
      setFormType(null);
      setEditingItemId(null);
      clearForm(formType);
    }
  };

  const selectedTeacherSchedules = useMemo(() => {
    return schedules.filter(
      (schedule) => schedule.teacher_id === selectedTeacherId
    );
  }, [schedules, selectedTeacherId]);

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  const TeacherManagementSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
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

  if (isLoading && !teachers.length) {
    return <TeacherManagementSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Teacher Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage teachers and their schedules
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teachers..."
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleCreateTeacher}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <LuPlus className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
              <button
                onClick={() => {
                  fetchTeachers();
                  fetchSchedules();
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <LuRefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <LuBadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error loading data
                </p>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    fetchTeachers();
                    fetchSchedules();
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Teachers</h2>
                  {!isLoading && (
                    <div className="text-sm text-gray-500">
                      {filteredTeachers.length}{" "}
                      {filteredTeachers.length === 1 ? "teacher" : "teachers"}{" "}
                      found
                      {searchTerm && (
                        <span className="ml-1">
                          for "
                          <span className="font-medium text-gray-700">
                            {searchTerm}
                          </span>
                          "
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <LuUsers className="w-4 h-4" />
                          Name
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))
                    ) : filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <LuUsers className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                No teachers found
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {searchTerm
                                  ? "Try adjusting your search criteria"
                                  : "Add a new teacher to get started"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedTeachers.map((teacher) => (
                        <tr
                          key={teacher.id}
                          className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                            selectedTeacherId === teacher.id
                              ? "bg-indigo-50"
                              : ""
                          }`}
                          onClick={() => setSelectedTeacherId(teacher.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <LuUsers className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {teacher.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {teacher.email}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTeacher(teacher);
                                }}
                              >
                                <LuPen className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTeacher(teacher.id);
                                }}
                              >
                                <LuTrash className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && filteredTeachers.length > 0 && (
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      {currentPage * teachersPerPage - teachersPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * teachersPerPage,
                        filteredTeachers.length
                      )}{" "}
                      of {filteredTeachers.length} teachers
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <LuCalendarClock className="w-5 h-5 text-indigo-600" />
                  <span>Teacher Schedules</span>
                </h2>
                {selectedTeacherId && (
                  <button
                    onClick={handleCreateSchedule}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <LuPlus className="w-3.5 h-3.5 inline mr-1" />
                    Add Schedule
                  </button>
                )}
              </div>
              {selectedTeacherId ? (
                selectedTeacherSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTeacherSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border-b border-gray-200 pb-3 last:border-b-0"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {schedule.day} | {schedule.start_time} -{" "}
                          {schedule.end_time}
                        </p>
                        {schedule.section && (
                          <p className="text-sm text-gray-500">
                            Section: {schedule.section}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No schedules for this teacher
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500">
                  Select a teacher to view schedules
                </p>
              )}
            </div>
          </section>
        </main>

        <TeacherFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormType(null);
            setEditingItemId(null);
            clearForm(formType);
          }}
          formType={formType}
          itemId={editingItemId}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TeacherManagement;
