// src/api/grades.js
import axios from "axios";
import { getItem } from "../utils/storage";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchGrades = async () => {
  const sectionId = getItem("sectionId", false);
  const academicYearId = getItem("academicYearId", false);
  const quarterId = getItem("quarterId", false);
  const token = getItem("token", false);

  const response = await axios.get(
    `${API_BASE}/teacher/sections/${sectionId}/grades`,
    {
      params: {
        quarter_id: quarterId,
        academic_year_id: academicYearId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data?.grades || response.data || [];
};

export const updateGrade = async (studentId, field, value) => {
  const token = getItem("token", false);

  return axios.patch(
    `${API_BASE}/grades/${studentId}`,
    { [field]: value },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
