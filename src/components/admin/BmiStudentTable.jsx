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
} from "lucide-react";
import toast from "react-hot-toast";
import useBmiStore from "../../stores/admin/bmiStore";

const BmiStudentTable = ({ students, loading, error }) => {
  const { updateStudentBmi, deleteStudentBmi } = useBmiStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      height_cm: student.height || "",
      weight_kg: student.weight || "",
      remarks: student.remarks || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (bmiRecordId) => {
    if (!editForm.height_cm || !editForm.weight_kg) {
      toast.error("Height and weight are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStudentBmi(bmiRecordId, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating BMI:", error);
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
      }
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
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
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                BMI Records
              </h2>
              <p className="text-sm text-gray-600">
                BMI tracking and health status monitoring for students
              </p>
            </div>

            {!loading && students.length > 0 && (
              <div className="text-sm text-gray-500">
                {students.length}{" "}
                {students.length === 1 ? "student" : "students"} recorded
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
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
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TriangleAlert className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-900">
                  Error loading health data
                </p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  No health records found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  BMI data for students will appear here once recorded
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
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
                      {/* Student Name */}
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

                      {/* Height */}
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
                              <span className="text-xs text-gray-500">cm</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Weight */}
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
                              <span className="text-xs text-gray-500">kg</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* BMI */}
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

                      {/* Status */}
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

                      {/* Actions */}
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
                              <Save className="w-4 h-4" />
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
        )}
      </div>
    </div>
  );
};

export default BmiStudentTable;
