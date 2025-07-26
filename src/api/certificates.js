import axios from "axios";
import { getItem } from "../utils/storage";

export const getAttendanceCertificates = async () => {
  const token = getItem("token", false);
  const sectionId = getItem("sectionId", false);
  const academicYearId = getItem("academicYearId", false);
  const quarterId = getItem("quarterId", false);

  const response = await axios.get(
    `http://127.0.0.1:8000/api/teacher/sections/${sectionId}/certificates/attendance`,
    {
      params: { academic_year_id: academicYearId, quarter_id: quarterId },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getHonorCertificates = async () => {
  const token = getItem("token", false);
  const sectionId = getItem("sectionId", false);
  const academicYearId = getItem("academicYearId", false);

  const response = await axios.get(
    `http://127.0.0.1:8000/api/teacher/sections/${sectionId}/certificates/honor`,
    {
      params: { academic_year_id: academicYearId },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
