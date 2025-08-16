import axios from "axios";
import { getItem } from "./utils";

export const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getItem("token", false);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors globally if needed
    if (error.response?.status === 401) {
      // Token might be expired - could dispatch logout here if needed
      // Note: Avoid circular imports with auth store
    }
    return Promise.reject(error);
  }
);
