import { useEffect, useState } from "react";
import { getItem } from "../lib/utils";

export const useGlobalFilters = () => {
  const [filters, setFilters] = useState({
    academicYearId: "",
    quarterId: "",
    sectionId: "",
  });

  useEffect(() => {
    // Initialize from localStorage
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    setFilters({
      academicYearId: savedAcademicYear || "",
      quarterId: savedQuarter || "",
      sectionId: savedSection || "",
    });

    // Listen for filter changes
    const handleGlobalFiltersChanged = (event) => {
      setFilters(event.detail);
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);

    return () => {
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
    };
  }, []);

  const hasAllFilters =
    filters.academicYearId && filters.quarterId && filters.sectionId;

  return {
    ...filters,
    hasAllFilters,
    filters, // Return the full object for destructuring
  };
};
