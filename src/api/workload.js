import axios from "axios";

export const getWorkloads = async () => {
  const token = localStorage.getItem("token"); // Or use your utility
  const response = await axios.get(
    "http://127.0.0.1:8000/api/teacher/workloads",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data?.workloads || [];
};
