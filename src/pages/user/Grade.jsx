import React, { useEffect } from "react";
import { CircleAlert } from "lucide-react";
import toast from "react-hot-toast";
import useStudentGradeStore from "../../stores/users/studentGradeStore";
import GradeSummary from "../../components/user/GradeSummary";
import GradeList from "../../components/user/GradeList";

const Grades = () => {
  const { data, loading, error, fetchGrades, clearError } =
    useStudentGradeStore();

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Safe data access with defaults
  const quarter = data?.quarter ?? "N/A";
  const quarterAverage = data?.quarter_average ?? 0;
  const honorsEligibility = data?.honors_eligibility ?? null;
  const grades = Array.isArray(data?.grades) ? data.grades : [];

  if (error && !loading) {
    return (
      <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <CircleAlert className="w-12 h-12 text-red-600 animate-pulse" />
          <p className="text-red-600 font-medium">Error loading grades</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen animate-fade-in">
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Grades</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium animate-pulse">
                Student Panel
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Showing grades for {quarter}.
        </p>

        <GradeSummary
          quarter={quarter}
          quarterAverage={quarterAverage}
          honorsEligibility={honorsEligibility}
          loading={loading}
        />
      </div>

      <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <GradeList grades={grades} loading={loading} error={error} />
      </section>
    </main>
  );
};

export default Grades;
