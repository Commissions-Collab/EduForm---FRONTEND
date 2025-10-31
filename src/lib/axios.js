import axios from "axios";
import { getItem, removeItem } from "./utils";
import toast from "react-hot-toast";

// Configuration constants aligned with backend
const BASE_URL = "http://127.0.0.1:8000/api"; //http://127.0.0.1:8000/api https://api.acad-flow.com
const SANCTUM_CSRF_URL = BASE_URL.replace("/api", "") + "/sanctum/csrf-cookie";
const SESSION_LIFETIME_MINUTES = 120; // Match backend SESSION_LIFETIME

let csrfTokenFetched = false;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

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
    toast.error(`${message}. Please try again.`);
    throw error;
  }
};

// Request interceptor with proper session expiry checking
axiosInstance.interceptors.request.use((config) => {
  const sessionExpiry = getItem("session_expiry", false, localStorage);

  if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
    // Session expired - clear storage and dispatch unauthorized event
    removeItem("token");
    removeItem("user");
    removeItem("session_expiry");
    csrfTokenFetched = false;
    window.dispatchEvent(new Event("unauthorized"));
    toast.error("Session expired. Please log in again.");
    return Promise.reject(new Error("Session expired"));
  }

  return config;
});

// Response interceptor handling Laravel session responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Handle unauthorized and session expired responses
    if (status === 401) {
      // Unauthorized - invalid or missing token
      removeItem("token");
      removeItem("user");
      removeItem("session_expiry");
      csrfTokenFetched = false;
      window.dispatchEvent(new Event("unauthorized"));
      toast.error("Authentication failed. Please log in again.");
    } else if (status === 419) {
      // CSRF token mismatch or session expired
      removeItem("token");
      removeItem("user");
      removeItem("session_expiry");
      csrfTokenFetched = false;
      window.dispatchEvent(new Event("unauthorized"));
      toast.error("Session expired. Please log in again.");
    } else if (status === 429) {
      // Too many requests
      toast.error(
        "Too many requests. Please wait a moment before trying again."
      );
    }

    return Promise.reject(error);
  }
);

// Clean up CSRF token state on unauthorized
const handleUnauthorized = () => {
  csrfTokenFetched = false;
};

window.addEventListener("unauthorized", handleUnauthorized);

// Cleanup on module unload
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener("unauthorized", handleUnauthorized);
  });
}

export { SESSION_LIFETIME_MINUTES };
