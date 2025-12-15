import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

/**
 * Axios instance
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Flushes the queue after refresh succeeds or fails
 */
const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response, fail fast
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isAuthMeRequest = originalRequest.url?.endsWith("/auth/me");
    const isRefreshRequest = originalRequest.url?.endsWith("/auth/refresh");

    /**
     * 🚫 NEVER retry these
     */
    if (isAuthMeRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    /**
     * Only handle auth failures
     */
    if ((status !== 401 && status !== 403) || originalRequest._retry) {
      return Promise.reject(error);
    }

    /**
     * Mark request as retried
     */
    originalRequest._retry = true;

    /**
     * If refresh already in progress, queue request
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    /**
     * Start refresh flow
     */
    isRefreshing = true;

    try {
      await api.get("/api/v1/auth/refresh");

      processQueue(null);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
