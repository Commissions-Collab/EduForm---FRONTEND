import axios from "axios";
import { getItem } from "../utils/storage";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchAttendance = async (sectionId, quarterId, academicYearId) => {
  const token = getItem("token", false);
  const response = await axios.get(
    `${API_BASE}/teacher/sections/${sectionId}/attendance`,
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
  return response.data;
};

export const updateAttendanceStatus = (id, status) => {
  const token = getItem("token", false);
  return axios.patch(
    `${API_BASE}/attendance/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateAttendanceReason = (id, reason) => {
  const token = getItem("token", false);
  return axios.patch(
    `${API_BASE}/attendance/${id}/reason`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const downloadAttendancePDF = async (
  sectionId,
  quarterId,
  academicYearId
) => {
  const token = getItem("token", false);
  const response = await axios.get(
    `${API_BASE}/teacher/sections/${sectionId}/attendance/quarterly/pdf`,
    {
      params: {
        quarter_id: quarterId,
        academic_year_id: academicYearId,
      },
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
