import React from "react";
import { LuFileText, LuTrash2, LuEye, LuPen } from "react-icons/lu";

const RecordsTable = ({ students, loading, onEdit, onDelete, onView }) => {
  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  // Function to format student data consistently
  const formatStudent = (student) => ({
    id: student.id,
    name:
      student.name ||
      `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
      "Unknown",
    studentId: student.student_id || student.id || "N/A",
    lrn: student.lrn || "N/A",
    grade: student.grade || student.year_level || "N/A",
    section: student.section || "N/A",
    status: student.status || student.enrollment_status || "Unknown",
    gwa: student.gwa || student.general_weighted_average || "N/A",
    attendance: student.attendance || student.attendance_rate || "N/A",
    email: student.email || "N/A",
    contactNumber: student.contact_number || student.phone || "N/A",
    address: student.address || "N/A",
    guardianName: student.guardian_name || student.parent_name || "N/A",
    guardianContact:
      student.guardian_contact || student.parent_contact || "N/A",
    enrollmentDate: student.enrollment_date || student.created_at || "N/A",
    records: student.records || [],
  });

  // Function to determine status color
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("enrolled") || statusLower.includes("active")) {
      return "bg-green-100 text-green-800";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("processing")
    ) {
      return "bg-yellow-100 text-yellow-800";
    } else if (
      statusLower.includes("dropped") ||
      statusLower.includes("inactive")
    ) {
      return "bg-red-100 text-red-800";
    } else if (
      statusLower.includes("graduated") ||
      statusLower.includes("completed")
    ) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="animate-pulse">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <LuFileText className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No records found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {students.map((student) => {
                const formattedStudent = formatStudent(student);
                return (
                  <tr
                    key={formattedStudent.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(formattedStudent.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formattedStudent.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {formattedStudent.studentId}
                          </div>
                          <div className="text-xs text-gray-400">
                            LRN: {formattedStudent.lrn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formattedStudent.grade}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formattedStudent.section}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          formattedStudent.status
                        )}`}
                      >
                        {formattedStudent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <span className="text-gray-500 text-xs w-8">
                            GWA:
                          </span>
                          <span className="font-medium">
                            {formattedStudent.gwa}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-xs w-8">
                            Att:
                          </span>
                          <span className="text-gray-600">
                            {formattedStudent.attendance}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div
                          className="truncate max-w-40"
                          title={formattedStudent.email}
                        >
                          {formattedStudent.email}
                        </div>
                        <div
                          className="truncate max-w-40"
                          title={formattedStudent.contactNumber}
                        >
                          {formattedStudent.contactNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(student)}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <LuEye className="w-5 h-5" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(student)}
                            className="text-green-400 hover:text-green-600 transition-colors"
                            title="Edit Student"
                          >
                            <LuPen className="w-5 h-5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(formattedStudent.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete Student"
                          >
                            <LuTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecordsTable;
