import axios from "axios";
import { getItem, removeItem } from "./utils";
import toast from "react-hot-toast";

// Configuration constants
const BASE_URL = "http://127.0.0.1:8000/api";
const SANCTUM_CSRF_URL = BASE_URL.replace("/api", "") + "/sanctum/csrf-cookie";

// Type definitions for better type safety
/** @typedef {import('axios').AxiosInstance} AxiosInstance */
/** @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig */
/** @typedef {import('axios').AxiosResponse} AxiosResponse */
/** @typedef {import('axios').AxiosError} AxiosError */

/** @type {boolean} */
let csrfTokenFetched = false;

/**
 * Creates and configures the Axios instance
 * @type {AxiosInstance}
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000, // Added timeout for reliability
});

/**
 * Fetches CSRF token from Sanctum
 * @returns {Promise<void>}
 */
export const fetchCsrfToken = async () => {
  if (csrfTokenFetched) return;

  try {
    const response = await axios.get(SANCTUM_CSRF_URL, {
      baseURL: BASE_URL.replace("/api", ""),
      withCredentials: true,
      timeout: 5000,
    });

    if (response.status === 204 || response.status === 200) {
      csrfTokenFetched = true;
    } else {
      throw new Error("Invalid CSRF token response");
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to initialize session";
    console.error("Failed to fetch CSRF token:", {
      message,
      status: error?.response?.status,
      error,
    });
    toast.error(`${message}. Please try again.`);
    throw error; // Re-throw to allow calling code to handle
  }
};

/**
 * Request interceptor to add CSRF token and Authorization header
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (process.env.NODE_ENV !== "production") {
      console.log("Response error:", {
        status,
        data: error?.response?.data,
        url: error?.config?.url,
      });
    }
    if (status === 401 || status === 419) {
      console.warn("Unauthorized access detected:", {
        status,
        data: error?.response?.data,
      });
      removeItem("token");
      removeItem("user");
      csrfTokenFetched = false;
      window.dispatchEvent(new Event("unauthorized"));
      toast.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);
/**
 * Response interceptor to handle unauthorized responses
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 419) {
      console.warn("Unauthorized access detected:", {
        status,
        data: error?.response?.data,
      });

      // Clear auth-related storage
      removeItem("token");
      removeItem("user");
      csrfTokenFetched = false;

      // Dispatch unauthorized event
      window.dispatchEvent(new Event("unauthorized"));
      toast.error("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);

/**
 * Centralized unauthorized event handler
 */
const handleUnauthorized = () => {
  csrfTokenFetched = false;
};

// Register event listener with proper cleanup
window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload (for hot-reloading scenarios)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}
