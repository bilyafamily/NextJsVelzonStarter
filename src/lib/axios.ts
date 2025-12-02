import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

// Create axios instance with base URL
export const apiClient = axios.create({
  baseURL: "http://localhost:7194/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: any) => {
    // Try to get session from NextAuth
    const session = await getSession();

    if (session?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh session
        const session = await getSession();
        if (session?.accessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login on refresh failure
        window.location.href = "/auth/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
