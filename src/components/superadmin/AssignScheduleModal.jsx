import { useEffect, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const AssignScheduleModal = ({ isOpen, onClose, teacher }) => {
  const {
    createTeacherSchedule,
    subjects,
    academicYear,
    quarters,
    sections,
    fetchDropdownData,
    updateSectionsForYear,
    loading,
  } = useTeacherManagementStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicYearId, setAcademicYearId] = useState("");

  const initialScheduleState = {
    subject_id: "",
    section_id: "",
    quarter_id: "",
    day_of_week: "Monday",
    start_time: "",
    end_time: "",
    room: "",
  };

  const [schedules, setSchedules] = useState([initialScheduleState]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData(); // Now calls your controller endpoint
    } else {
      // Reset form when closing
      setSchedules([{ ...initialScheduleState }]);
      setAcademicYearId("");
      setIsSubmitting(false);
    }
  }, [isOpen, fetchDropdownData]);

  useEffect(() => {
    // Auto-select current academic year if available
    if (academicYear && academicYear.id) {
      setAcademicYearId(academicYear.id.toString());
    }
  }, [academicYear]);

  if (!isOpen || !teacher) return null;

  const handleAcademicYearChange = async (yearId) => {
    setAcademicYearId(yearId);

    // Reset all sections in schedules when academic year changes
    const resetSchedules = schedules.map((schedule) => ({
      ...schedule,
      section_id: "",
    }));
    setSchedules(resetSchedules);

    // Update sections for the selected academic year
    if (yearId) {
      await updateSectionsForYear(yearId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!academicYearId) return;

    const isValid = schedules.every(
      (schedule) =>
        schedule.subject_id &&
        schedule.section_id &&
        schedule.quarter_id &&
        schedule.day_of_week &&
        schedule.start_time &&
        schedule.end_time
    );

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await createTeacherSchedule({
        teacher_id: teacher.id,
        academic_year_id: academicYearId,
        schedules,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create schedules:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setSchedules(updatedSchedules);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { ...initialScheduleState }]);
  };

  const removeSchedule = (index) => {
    if (schedules.length > 1) {
      const updatedSchedules = schedules.filter((_, i) => i !== index);
      setSchedules(updatedSchedules);
    }
  };

  const formatTeacherName = (teacher) => {
    const parts = [
      teacher.first_name,
      teacher.middle_name,
      teacher.last_name,
    ].filter(Boolean);
    return parts.join(" ");
  };

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Schedules - {formatTeacherName(teacher)}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Add multiple class schedules for this teacher
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Year Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year *
            </label>
            <select
              value={academicYearId}
              onChange={(e) => handleAcademicYearChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYear ? (
                <option value={academicYear.id}>
                  {academicYear.name}{" "}
                  {academicYear.is_current ? "(Current)" : ""}
                </option>
              ) : (
                <option disabled>Loading academic year...</option>
              )}
            </select>
          </div>

          {/* Schedule Entries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Class Schedules ({schedules.length})
              </h3>
              <button
                type="button"
                onClick={addSchedule}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                disabled={isSubmitting || loading}
              >
                <LuPlus className="w-4 h-4" />
                Add Schedule
              </button>
            </div>

            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-white relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Schedule #{index + 1}
                  </h4>
                  {schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      disabled={isSubmitting}
                    >
                      <LuTrash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      value={schedule.subject_id}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "subject_id",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects && subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading subjects...</option>
                      )}
                    </select>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section *
                    </label>
                    <select
                      value={schedule.section_id}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "section_id",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Section</option>
                      {sections?.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quarter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quarter *
                    </label>
                    <select
                      value={schedule.quarter_id}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "quarter_id",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select Quarter</option>
                      {quarters && quarters.length > 0 ? (
                        quarters.map((quarter) => (
                          <option key={quarter.id} value={quarter.id}>
                            {quarter.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading quarters...</option>
                      )}
                    </select>
                  </div>

                  {/* Day of Week */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week *
                    </label>
                    <select
                      value={schedule.day_of_week}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "day_of_week",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={schedule.start_time}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "start_time",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={schedule.end_time}
                      onChange={(e) =>
                        handleScheduleChange(index, "end_time", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min={schedule.start_time}
                      required
                    />
                  </div>

                  {/* Room */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room
                    </label>
                    <input
                      type="text"
                      value={schedule.room}
                      onChange={(e) =>
                        handleScheduleChange(index, "room", e.target.value)
                      }
                      placeholder="Enter room number or location (optional)"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      maxLength="255"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting || loading || schedules.length === 0}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Schedules...
                </span>
              ) : (
                `Create ${schedules.length} Schedule${
                  schedules.length !== 1 ? "s" : ""
                }`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignScheduleModal;
