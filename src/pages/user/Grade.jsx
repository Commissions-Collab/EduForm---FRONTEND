import React, { useEffect } from "react";
import { LuCircleAlert, LuUser } from "react-icons/lu";
import toast from "react-hot-toast";
import useStudentGradeStore from "../../stores/users/studentGradeStore";
import QuarterFilter from "../../components/user/QuarterFilter";
import GradeSummary from "../../components/user/GradeSummary";
import GradeList from "../../components/user/GradeList";

const Grades = () => {
  const {
    data,
    quarters,
    selectedQuarter,
    loading,
    error,
    quartersLoading,
    quartersError,
    fetchGrades,
    fetchQuarterFilter,
    setSelectedQuarter,
    clearError,
  } = useStudentGradeStore();

  useEffect(() => {
    fetchQuarterFilter();
    fetchGrades(selectedQuarter);
  }, [fetchQuarterFilter, fetchGrades, selectedQuarter]);

  useEffect(() => {
    if (error || quartersError) {
      toast.error(error || quartersError);
      clearError();
    }
  }, [error, quartersError, clearError]);

  if (error && quartersError) {
    return (
      <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <LuCircleAlert className="w-12 h-12 text-red-600 animate-pulse" />
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
          <QuarterFilter
            quarters={quarters}
            selectedQuarter={selectedQuarter}
            setSelectedQuarter={setSelectedQuarter}
            loading={quartersLoading}
            error={quartersError}
          />
        </div>

        <GradeSummary
          quarter={data.quarter}
          quarterAverage={data.quarter_average}
          honorsEligibility={data.honors_eligibility}
          loading={loading}
        />
      </div>

      <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <GradeList grades={data.grades} loading={loading} error={error} />
      </section>
    </main>
  );
};

export default Grades;
