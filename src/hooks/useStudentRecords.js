import { useState, useEffect } from "react";
import { studentsData } from "../constants";

export const useStudentsRecords = (storageKey = "students") => {
  const localStudents = localStorage.getItem(storageKey);
  const [students, setStudents] = useState(
    localStudents ? JSON.parse(localStudents) : studentsData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const RECORDS_PER_PAGE = 10;
  const totalPages = Math.ceil(students.length / RECORDS_PER_PAGE);

  const indexOfLast = currentPage * RECORDS_PER_PAGE;
  const indexOfFirst = indexOfLast - RECORDS_PER_PAGE;
  const currentRecords = students.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(students));
  }, [students, storageKey]);

  return {
    students,
    setStudents,
    currentPage,
    setCurrentPage,
    RECORDS_PER_PAGE,
    totalPages,
    currentRecords,
  };
};
