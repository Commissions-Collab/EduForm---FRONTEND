import React from "react";
import {
  Activity,
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  Printer,
  User,
} from "lucide-react";

const ConferenceMain = ({
  loading,
  selectedConferenceStudent,
  onContactParent,
  onPrintReportCard,
}) => {
  const StudentProfileSkeleton = () => (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex space-x-2">
            <div className="h-9 w-32 bg-gray-200 rounded-lg" />
            <div className="h-9 w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="h-5 w-44 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full" />
              <div className="h-4 w-40 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="h-5 w-52 bg-gray-200 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-5 w-12 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="h-5 w-52 bg-gray-200 rounded" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-5 w-full bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="h-5 w-60 bg-gray-200 rounded" />
        <div className="overflow-x-auto">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 w-20 bg-gray-200 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileSection = ({ title, children, icon: Icon }) => (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const StudentProfile = ({ student, onContactParent, onPrintReportCard }) => {
    if (!student) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No Student Selected</p>
            <p className="text-sm">
              Choose a student from the list to view their profile
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600">
                Student ID: {student.student_id || "N/A"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                onClick={onContactParent}
                disabled={!student.guardian_email}
              >
                <Mail size={15} />
                <span>Contact Parent</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => onPrintReportCard(student.id)}
              >
                <Printer size={15} />
                <span>Print Report Card</span>
              </button>
            </div>
          </div>
        </div>

        <ProfileSection title="Guardian Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                <strong>Name:</strong> {student.guardian}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                <strong>Email:</strong>{" "}
                {student.guardian_email || "Not provided"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                <strong>Phone:</strong>{" "}
                {student.guardian_phone || "Not provided"}
              </span>
            </div>
          </div>
        </ProfileSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileSection title="Academic Performance" icon={GraduationCap}>
            {student.grades && student.grades.length > 0 ? (
              <div className="space-y-2">
                {student.grades.map((grade, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm font-medium">
                      {grade.subject}:
                    </span>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        grade.average_grade >= 90
                          ? "bg-green-100 text-green-700"
                          : grade.average_grade >= 85
                          ? "bg-blue-100 text-blue-700"
                          : grade.average_grade >= 75
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {grade.average_grade}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No grades available
              </p>
            )}
          </ProfileSection>

          <ProfileSection title="Attendance Summary" icon={CalendarDays}>
            {student.attendance_summary ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-100 p-3 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {student.attendance_summary.present_percent}%
                    </div>
                    <div className="text-xs text-green-600">Present</div>
                  </div>
                  <div className="bg-red-100 p-3 rounded">
                    <div className="text-lg font-bold text-red-700">
                      {student.attendance_summary.absent_percent}%
                    </div>
                    <div className="text-xs text-red-600">Absent</div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded">
                    <div className="text-lg font-bold text-yellow-700">
                      {student.attendance_summary.late_percent}%
                    </div>
                    <div className="text-xs text-yellow-600">Late</div>
                  </div>
                </div>

                {student.attendance_summary.recent_absents &&
                  student.attendance_summary.recent_absents.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Recent Absences:
                      </h5>
                      <div className="space-y-1">
                        {student.attendance_summary.recent_absents
                          .slice(0, 3)
                          .map((absence, index) => (
                            <div
                              key={index}
                              className="text-xs text-gray-600 bg-white p-2 rounded border"
                            >
                              {new Date(
                                absence.attendance_date
                              ).toLocaleDateString()}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No attendance data available
              </p>
            )}
          </ProfileSection>
        </div>

        {student.bmi_records && student.bmi_records.length > 0 && (
          <ProfileSection title="Health Profile (BMI Records)" icon={Activity}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 font-medium">Quarter</th>
                    <th className="text-left p-2 font-medium">Height (cm)</th>
                    <th className="text-left p-2 font-medium">Weight (kg)</th>
                    <th className="text-left p-2 font-medium">BMI</th>
                    <th className="text-left p-2 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {student.bmi_records.map((bmi, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">Q{bmi.quarter_id}</td>
                      <td className="p-2">{bmi.height_cm || "N/A"}</td>
                      <td className="p-2">{bmi.weight_kg || "N/A"}</td>
                      <td className="p-2">{bmi.bmi || "N/A"}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            bmi.bmi_category === "Normal"
                              ? "bg-green-100 text-green-700"
                              : bmi.bmi_category === "Underweight"
                              ? "bg-blue-100 text-blue-700"
                              : bmi.bmi_category === "Overweight"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {bmi.bmi_category || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProfileSection>
        )}
      </div>
    );
  };

  return (
    <div className="col-span-8 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Student 360° Profile
        </h2>
      </div>
      {loading ? (
        <StudentProfileSkeleton />
      ) : (
        <StudentProfile
          student={selectedConferenceStudent}
          onContactParent={onContactParent}
          onPrintReportCard={onPrintReportCard}
        />
      )}
    </div>
  );
};

export default ConferenceMain;
