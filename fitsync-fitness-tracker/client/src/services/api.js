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
/** Hard redirect helper function */
const redirectToHome = () => {
  window.location.replace("/auth/login");
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
    const isRefreshRequest = originalRequest.url?.endsWith("/auth/refresh");

    /**
     * These requests will NEVER get retreied
     */
    if (isRefreshRequest) {
      return Promise.reject(error);
    }

    const isTokenExpiredError =
      status === 401 &&
      (error?.response?.data?.message === "ACCESS_TOKEN_EXPIRED" ||
        error?.response?.data?.message === "MISSING_AUTHORIZATION_TOKEN");

    /**
     * Only auth failures get retried
     */
    if (!isTokenExpiredError || originalRequest._retry) {
      return Promise.reject(error);
    }

    /**
     * Marks request as retried
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
     * Starts refresh flow
     */
    isRefreshing = true;

    try {
      await api.get("/api/v1/auth/refresh");
      isRefreshing = false;
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);
      redirectToHome();
      return Promise.reject(refreshError);
    }
  },
);
