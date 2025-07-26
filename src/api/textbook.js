import axios from "axios";
import { getItem } from "../utils/storage";

export const getTextbooks = async () => {
  const token = getItem("token", false);
  const sectionId = getItem("sectionId", false);
  const academicYearId = getItem("academicYearId", false);

  const response = await axios.get(
    `http://127.0.0.1:8000/api/teacher/sections/${sectionId}/textbooks`,
    {
      params: { academic_year_id: academicYearId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
