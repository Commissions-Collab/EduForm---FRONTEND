import axios from "axios";
import { getItem, removeItem } from "./utils";
import toast from "react-hot-toast";

const BASE_URL = "http://127.0.0.1:8000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

let csrfTokenFetched = false;

export const fetchCsrfToken = async () => {
  if (csrfTokenFetched) return;
  try {
    await axios.get("/sanctum/csrf-cookie", {
      baseURL: BASE_URL.replace("/api", ""),
      withCredentials: true,
    });
    csrfTokenFetched = true;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    toast.error("Failed to initialize session. Please try again.");
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (["post", "put", "patch"].includes(config.method.toLowerCase())) {
      await fetchCsrfToken();
    }
    const token = getItem("token", false);
    if (token && typeof token === "string" && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Reset csrfTokenFetched on unauthorized event
window.addEventListener("unauthorized", () => {
  csrfTokenFetched = false;
});
