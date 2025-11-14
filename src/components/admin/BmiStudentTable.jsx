import React, { useState } from "react";
import {
  User,
  Ruler,
  Weight,
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
  Edit2,
  Trash2,
  X,
  Save,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import useBmiStore from "../../stores/admin/bmiStore";

const BmiStudentTable = ({ students, loading, error }) => {
  const { updateStudentBmi, deleteStudentBmi, addStudentBmi } = useBmiStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    student_id: "",
    height_cm: "",
    weight_kg: "",
    remarks: "",
  });

  const getBmiStatusConfig = (status) => {
    const configs = {
      Underweight: {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: TrendingDown,
        color: "text-yellow-600",
      },
      Normal: {
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-200",
        icon: Heart,
        color: "text-green-600",
      },
      Overweight: {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-200",
        icon: TrendingUp,
        color: "text-orange-600",
      },
      Obese: {
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
        icon: TriangleAlert,
        color: "text-red-600",
      },
    };
    return configs[status] || configs["Normal"];
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?"
    );
  };

  const getBmiColor = (bmi) => {
    if (!bmi || bmi === "-") return "text-gray-500";
    const value = parseFloat(bmi);
    if (value < 18.5) return "text-yellow-600";
    if (value < 25) return "text-green-600";
    if (value < 30) return "text-orange-600";
    return "text-red-600";
  };

  const handleEdit = (student) => {
    setEditingId(student.bmi_record_id);
    setEditForm({
      student_id: student.student_id,
      height_cm: student.height != null ? String(student.height) : "",
      weight_kg: student.weight != null ? String(student.weight) : "",
      remarks: student.remarks || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (bmiRecordId) => {
    if (!bmiRecordId) {
      toast.error("Cannot update: No BMI record exists for this student");
      return;
    }
    if (!editForm.height_cm || !editForm.weight_kg) {
      toast.error("Height and weight are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...editForm,
        height_cm: parseFloat(editForm.height_cm),
        weight_kg: parseFloat(editForm.weight_kg),
      };
      await updateStudentBmi(bmiRecordId, payload);
      setEditingId(null);
      setEditForm({});
      toast.success("BMI record updated successfully!");
    } catch (error) {
      console.error("Error updating BMI:", error);
      toast.error(error.message || "Failed to update BMI record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async () => {
    if (!addForm.student_id || !addForm.height_cm || !addForm.weight_kg) {
      toast.error("Student, height, and weight are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await addStudentBmi({
        ...addForm,
        height_cm: parseFloat(addForm.height_cm),
        weight_kg: parseFloat(addForm.weight_kg),
      });
      setShowAddForm(false);
      setAddForm({
        student_id: "",
        height_cm: "",
        weight_kg: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Error adding BMI:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bmiRecordId, studentName) => {
    if (
      window.confirm(
        `Are you sure you want to delete BMI record for ${studentName}?`
      )
    ) {
      try {
        await deleteStudentBmi(bmiRecordId);
      } catch (error) {
        console.error("Error deleting BMI:", error);
        toast.error(error.message || "Failed to delete BMI record");
      }
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Mobile Card View
  const MobileCard = ({ student }) => {
    const statusConfig = getBmiStatusConfig(student.bmi_status);
    const StatusIcon = statusConfig.icon;
    const isEditing = editingId === student.bmi_record_id;

    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-4 ${
          isEditing ? "ring-2 ring-blue-500" : ""
        }`}
      >
        {/* Student Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {student.name}
            </p>
            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
          </div>
          {student.bmi_status && student.bmi_status !== "-" && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
              {student.bmi_status}
            </span>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Height */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Height</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={editForm.height_cm}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    height_cm: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="cm"
              />
            ) : (
              <div>
                <span className="text-lg font-bold text-gray-900">
                  {student.height ?? "-"}
                </span>
                {student.height && (
                  <span className="text-xs text-gray-500 ml-1">cm</span>
                )}
              </div>
            )}
          </div>

          {/* Weight */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Weight</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                step="0.1"
                value={editForm.weight_kg}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    weight_kg: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="kg"
              />
            ) : (
              <div>
                <span className="text-lg font-bold text-gray-900">
                  {student.weight ?? "-"}
                </span>
                {student.weight && (
                  <span className="text-xs text-gray-500 ml-1">kg</span>
                )}
              </div>
            )}
          </div>

          {/* BMI */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">BMI</span>
            </div>
            <span className={`text-lg font-bold ${getBmiColor(student.bmi)}`}>
              {student.bmi ?? "-"}
            </span>
          </div>

          {/* Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Status</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {student.bmi_status ?? "-"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={() => handleSaveEdit(student.bmi_record_id)}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving" : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEdit(student)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                disabled={!student.bmi_record_id}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() =>
                  handleDelete(student.bmi_record_id, student.name)
                }
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                disabled={!student.bmi_record_id}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                BMI Records
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                BMI tracking and health status monitoring for students
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add BMI Record
              </button>
              {!loading && students.length > 0 && (
                <div className="text-xs sm:text-sm text-gray-500">
                  {students.length}{" "}
                  {students.length === 1 ? "student" : "students"} recorded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add BMI Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New BMI Record
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student
                </label>
                <select
                  value={addForm.student_id}
                  onChange={(e) =>
                    setAddForm({ ...addForm, student_id: e.target.value })
                  }
                  className="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a student</option>
                  {students
                    .filter((student) => !student.bmi_record_id)
                    .map((student) => (
                      <option
                        key={student.student_id}
                        value={student.student_id}
                      >
                        {student.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={addForm.height_cm}
                  onChange={(e) =>
                    setAddForm({ ...addForm, height_cm: e.target.value })
                  }
                  className="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={addForm.weight_kg}
                  onChange={(e) =>
                    setAddForm({ ...addForm, weight_kg: e.target.value })
                  }
                  className="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="kg"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  value={addForm.remarks}
                  onChange={(e) =>
                    setAddForm({ ...addForm, remarks: e.target.value })
                  }
                  className="mt-1 w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional remarks"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleAddSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving" : "Save"}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <>
            {/* Mobile Loading */}
            <div className="block lg:hidden p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            {/* Desktop Loading */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Height (cm)
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Weight className="w-4 h-4" />
                        Weight (kg)
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
                        BMI
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        Health Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div>
                            <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="w-16 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-10 h-3 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="w-6 h-2 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-10 h-3 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="w-6 h-2 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-10 h-3 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="w-6 h-2 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-20 h-5 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-16 h-5 bg-gray-200 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : error ? (
          <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TriangleAlert className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-900 text-sm sm:text-base">
                  Error loading health data
                </p>
                <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  No health records found
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  BMI data for students will appear here once recorded
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden p-4 space-y-4">
              {students.map((student) => (
                <MobileCard key={student.student_id} student={student} />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Height (cm)
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Weight className="w-4 h-4" />
                        Weight (kg)
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
                        BMI
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        Health Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const statusConfig = getBmiStatusConfig(student.bmi_status);
                    const StatusIcon = statusConfig.icon;
                    const isEditing = editingId === student.bmi_record_id;

                    return (
                      <tr
                        key={student.student_id}
                        className={`hover:bg-gray-50/50 transition-colors ${
                          isEditing ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {getInitials(student.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {student.student_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editForm.height_cm}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  height_cm: e.target.value,
                                })
                              }
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="cm"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-gray-900">
                                {student.height ?? "-"}
                              </span>
                              {student.height && (
                                <span className="text-xs text-gray-500">
                                  cm
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editForm.weight_kg}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  weight_kg: e.target.value,
                                })
                              }
                              className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="kg"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-gray-900">
                                {student.weight ?? "-"}
                              </span>
                              {student.weight && (
                                <span className="text-xs text-gray-500">
                                  kg
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span
                              className={`text-lg font-bold ${getBmiColor(
                                student.bmi
                              )}`}
                            >
                              {student.bmi ?? "-"}
                            </span>
                            {student.bmi && student.bmi !== "-" && (
                              <span className="text-xs text-gray-500">BMI</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {student.bmi_status && student.bmi_status !== "-" ? (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                            >
                              <StatusIcon
                                className={`w-3 h-3 ${statusConfig.color}`}
                              />
                              {student.bmi_status}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleSaveEdit(student.bmi_record_id)
                                }
                                disabled={isSubmitting}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                {isSubmitting ? (
                                  "Saving..."
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSubmitting}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(student)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                                disabled={!student.bmi_record_id}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    student.bmi_record_id,
                                    student.name
                                  )
                                }
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                                disabled={!student.bmi_record_id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BmiStudentTable;
