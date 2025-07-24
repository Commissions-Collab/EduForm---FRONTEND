import React, { useState } from "react";
import { LuInfo } from "react-icons/lu";

const HealthProfile = () => {
  const [startHeight, setStartHeight] = useState(""); // cm
  const [startWeight, setStartWeight] = useState(""); // kg
  const [endHeight, setEndHeight] = useState("");
  const [endWeight, setEndWeight] = useState("");

  const calculateBMI = (heightCm, weightKg) => {
    if (!heightCm || !weightKg) return "";
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getClassification = (bmi) => {
    if (!bmi) return { label: "—", color: "text-gray-400", bg: "bg-gray-100" };
    const val = parseFloat(bmi);
    if (val < 18.5)
      return {
        label: "Underweight",
        color: "text-yellow-500",
        bg: "bg-yellow-50",
      };
    if (val < 25)
      return { label: "Normal", color: "text-green-600", bg: "bg-green-50" };
    if (val < 30)
      return {
        label: "Overweight",
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    return { label: "Obese", color: "text-red-600", bg: "bg-red-50" };
  };

  const startBmi = calculateBMI(startHeight, startWeight);
  const endBmi = calculateBMI(endHeight, endWeight);
  const startClass = getClassification(startBmi);
  const endClass = getClassification(endBmi);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Health Profile (SF8)</div>
        <div className="inline-flex items-center px-2 py-1 text-sm rounded-lg bg-[#E0E7FF] text-[#3730A3]">
          <span className="ml-2">Last Checkup: July 23, 2025</span>
        </div>
      </div>
      <div className="shad-container p-4 mt-8">
        <div className="flex items-center gap-5">
          <LuInfo size={20} />
          Note:
          <span className="text-sm text-gray-500 items-center">
            Health data can only be updated by authorized school health
            personnel. If you notice any discrepancies, please report them to
            the health office.
          </span>
        </div>
      </div>

      <div className="shad-container p-5 mt-8">
        <div className="text-xl font-medium">BMI Tracker</div>

        <div className="grid grid-cols-12 gap-6">
          {/* Start of School Year */}
          <div className="col-span-12 xl:col-span-6 mt-8 bg-gray-50 p-5 border border-gray-200 rounded-lg">
            <div className="flex justify-between text-sm">
              <h1 className="text-sm font-medium text-gray-500">
                Beginning of the School Year
              </h1>
              <h1 className="text-sm font-medium text-gray-500">
                July 23, 2025
              </h1>
            </div>

            <div className="flex justify-between mt-4 text-sm items-center">
              <label className="font-semibold text-gray-500">Height (cm)</label>
              <input
                type="number"
                value={startHeight}
                onChange={(e) => setStartHeight(e.target.value)}
                placeholder="Enter height"
                className="border text-sm rounded px-3 py-1 w-28 text-right"
              />
            </div>

            <div className="flex justify-between mt-4 text-sm items-center">
              <label className="font-semibold text-gray-500">Weight (kg)</label>
              <input
                type="number"
                value={startWeight}
                onChange={(e) => setStartWeight(e.target.value)}
                placeholder="Enter Weight"
                className="border text-sm rounded px-3 py-1 w-28 text-right"
              />
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <label className="font-semibold text-gray-500">BMI</label>
              <div className="font-semibold">{startBmi || "—"}</div>
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <label className="font-semibold text-gray-500">
                Classification
              </label>
              <div
                className={`inline-flex items-center px-2 py-1 text-xs rounded-sm ${startClass.bg} ${startClass.color}`}
              >
                {startClass.label}
              </div>
            </div>
          </div>

          {/* End of School Year */}
          <div className="col-span-12 xl:col-span-6 mt-8 bg-gray-50 p-5 border border-gray-200 rounded-lg">
            <div className="flex justify-between text-sm">
              <h1 className="text-sm font-medium text-gray-500">
                End of the School Year
              </h1>
              <h1 className="text-sm font-medium text-gray-500">
                May 11, 2025
              </h1>
            </div>

            <div className="flex justify-between mt-4 text-sm items-center">
              <label className="font-semibold text-gray-500">Height (cm)</label>
              <input
                type="number"
                value={endHeight}
                onChange={(e) => setEndHeight(e.target.value)}
                placeholder="Enter Height"
                className="border text-sm rounded px-3 py-1 w-28 text-right"
              />
            </div>

            <div className="flex justify-between mt-4 text-sm items-center">
              <label className="font-semibold text-gray-500">Weight (kg)</label>
              <input
                type="number"
                value={endWeight}
                onChange={(e) => setEndWeight(e.target.value)}
                placeholder="Enter Weight"
                className="border text-sm rounded px-3 py-1 w-28 text-right"
              />
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <label className="font-semibold text-gray-500">BMI</label>
              <div className="font-semibold">{endBmi || "—"}</div>
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <label className="font-semibold text-gray-500">
                Classification
              </label>
              <div
                className={`inline-flex items-center px-2 py-1 text-xs rounded-sm ${endClass.bg} ${endClass.color}`}
              >
                {endClass.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HealthProfile;
