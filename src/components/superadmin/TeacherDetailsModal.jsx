import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const TeacherDetailsModal = ({ isOpen, onClose, teacherId }) => {
  const {
    fetchTeacherDetails,
    selectedTeacherDetails: teacher,
    loading,
  } = useTeacherManagementStore();

  useEffect(() => {
    if (isOpen && teacherId) {
      fetchTeacherDetails(teacherId);
    }
  }, [isOpen, teacherId, fetchTeacherDetails]);

  if (!isOpen) return null;

  const renderValue = (value) =>
    value ? value : <span className="italic text-gray-500">N/A</span>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Teacher Details
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            View full profile, advisory, and teaching assignments
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        ) : teacher ? (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto px-1">
            {/* 🧾 Basic Info */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {teacher.first_name}{" "}
                  {teacher.middle_name ? teacher.middle_name + " " : ""}
                  {teacher.last_name}
                </p>
                <p>
                  <span className="font-medium">Employee ID:</span>{" "}
                  {renderValue(teacher.employee_id)}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {renderValue(teacher.user?.email)}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {renderValue(teacher.phone)}
                </p>
                <p>
                  <span className="font-medium">Specialization:</span>{" "}
                  {renderValue(teacher.specialization)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`${
                      teacher.employment_status === "active"
                        ? "text-green-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {teacher.employment_status}
                  </span>
                </p>
              </div>
            </div>

            {/* 🧑‍🏫 Advisory */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Advisory Section
              </h3>
              {teacher.section_advisors?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {teacher.section_advisors.map((adv, i) => (
                    <li key={i}>
                      <span className="font-medium">
                        {adv.section?.name || "N/A"}
                      </span>{" "}
                      <span className="text-gray-500">
                        ({adv.academic_year?.name})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No assigned advisory.
                </p>
              )}
            </div>

            {/* 📚 Subjects */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Assigned Subjects
              </h3>
              {teacher.teacher_subjects?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {teacher.teacher_subjects.map((ts, i) => (
                    <li key={i}>
                      <span className="font-medium">{ts.subject?.name}</span>{" "}
                      <span className="text-gray-500">
                        ({ts.section?.name || "No section"}) -{" "}
                        {ts.academic_year?.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No subjects assigned.
                </p>
              )}
            </div>

            {/* 🗓 Schedule */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Schedule
              </h3>
              {teacher.schedules?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {teacher.schedules.map((sched, i) => (
                    <li key={i}>
                      <span className="font-medium">
                        {sched.section?.name || "N/A"}
                      </span>{" "}
                      <span className="text-gray-500">
                        ({sched.day_of_week}) {sched.start_time} -{" "}
                        {sched.end_time}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No schedule available.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center py-6">
            No teacher details found.
          </p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
