import React, { useEffect } from "react";
import { CircleAlert } from "lucide-react";
import toast from "react-hot-toast";
import useHealthProfileStore from "../../stores/users/healthProfileStore";
import BmiSummary from "../../components/user/BmiSummary";
import BmiRecords from "../../components/user/BmiRecords";

const HealthProfile = () => {
  const { data, loading, error, fetchBmiData, clearError } =
    useHealthProfileStore();

  useEffect(() => {
    fetchBmiData();
  }, [fetchBmiData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Safe data access with defaults
  const bmiRecords = Array.isArray(data) ? data : [];

  if (error && !loading) {
    return (
      <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen flex items-center justify-center animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <CircleAlert className="w-12 h-12 text-red-600 animate-pulse" />
          <p className="text-red-600 font-medium">
            Error loading health profile
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen animate-fade-in">
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Health Profile
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium animate-pulse">
                Student Panel
              </span>
            </div>
          </div>
        </div>

        <BmiSummary data={bmiRecords} loading={loading} />
      </div>

      <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <BmiRecords data={bmiRecords} loading={loading} error={error} />
      </section>
    </main>
  );
};

export default HealthProfile;
