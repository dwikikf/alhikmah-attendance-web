// Axios Instance with JWT Token Interceptors

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { apiConfig, API_ENDPOINTS } from "@/config/api";
import {
  getAccessToken,
  setTokens,
  removeTokens,
  isTokenExpired,
  isTokenExpiringSoon,
} from "@/utils/auth";
import type { RefreshTokenResponse } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api";
import { toast } from "sonner";

/** Flag to prevent multiple simultaneous refresh attempts */
let isRefreshing = false;

/** Queue of requests waiting for token refresh */
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Notify all queued requests that the token has been refreshed
 */
function onTokenRefreshed(newToken: string): void {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

/**
 * Add a request to the refresh queue
 */
function addRefreshSubscriber(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

/**
 * Create and configure the main Axios instance
 */
const api: AxiosInstance = axios.create({
  ...apiConfig,
  withCredentials: true,
});

/**
 * Request interceptor - Attach JWT token to outgoing requests
 * Also implements proactive token refresh before expiry
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      // Check if token is expiring soon (within 5 minutes) and proactively refresh
      if (
        isTokenExpiringSoon(accessToken, 300) &&
        !isTokenExpired(accessToken, 0) &&
        !config.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
      ) {
        try {
          const newToken = await refreshTokenSilently();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          }
        } catch {
          // If proactive refresh fails, continue with existing token
        }
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - Handle 401 errors with automatic token refresh
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 errors (unauthorized) for token refresh
    if (error.response?.status !== 401 || !originalRequest) {
      // Global error handling for non-401 errors
      const errorData = error.response?.data as ApiErrorResponse;
      if (errorData?.message) {
        toast.error(errorData.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }
      return Promise.reject(error);
    }

    // Don't retry if this is already a retry or a login/refresh request
    if (
      originalRequest._retry ||
      originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
      originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      // Token refresh failed - clear tokens and redirect to login
      removeTokens();
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest._retry = true;
          resolve(api(originalRequest));
        });
      });
    }

    // Start refreshing
    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const newToken = await refreshTokenSilently();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        onTokenRefreshed(newToken);
        return api(originalRequest);
      } else {
        throw new Error("Token refresh returned null");
      }
    } catch (refreshError) {
      // Refresh failed - clear tokens and trigger logout
      removeTokens();
      refreshSubscribers = [];
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/**
 * Silently refresh the access token using the stored refresh token in HttpOnly Cookie
 */
async function refreshTokenSilently(): Promise<string | null> {
  try {
    // Use a fresh axios instance to avoid interceptor loops
    const response = await axios.post<RefreshTokenResponse>(
      `${apiConfig.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        timeout: apiConfig.timeout,
        withCredentials: true,
      },
    );

    const { accessToken } = response.data as any; // Backend now only returns access_token
    setTokens({ accessToken });
    return accessToken;
  } catch {
    return null;
  }
}

export default api;
