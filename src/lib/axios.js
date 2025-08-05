import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Handle both string and parsed token formats
    const tokenValue = typeof token === 'string' ? token : JSON.stringify(token);
    config.headers.Authorization = `Bearer ${tokenValue}`;
  }
  return config;
});
