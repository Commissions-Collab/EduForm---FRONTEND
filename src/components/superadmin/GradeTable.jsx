import { BookOpen } from "lucide-react";

const GradeTable = ({ students, loading }) => {
  if (loading) {
    return null;
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No grade data available for this selection.
        </p>
      </div>
    );
  }

  // Get unique subjects from first student's grades
  const subjects =
    students[0]?.grades?.length > 0
      ? students[0].grades.map((g) => ({
          id: g.subject_id,
          name: g.subject_name,
        }))
      : [];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Student Grades</h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {students.length} student{students.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Student Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">
                LRN
              </th>
              {subjects.map((subject) => (
                <th
                  key={subject.id}
                  className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700"
                >
                  {subject.name}
                </th>
              ))}
              <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Average
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student.student_id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                  {student.student_name}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                  {student.lrn}
                </td>
                {student.grades?.map((grade) => (
                  <td
                    key={grade.subject_id}
                    className="px-4 sm:px-6 py-4 text-center text-sm font-medium"
                  >
                    {grade.grade ? (
                      <span
                        className={
                          grade.grade >= 75
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {grade.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
                <td className="px-4 sm:px-6 py-4 text-center text-sm font-medium">
                  {student.average_grade > 0
                    ? student.average_grade.toFixed(2)
                    : "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "Passing"
                        ? "bg-green-100 text-green-800"
                        : student.status === "Failing"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTable;
