// Authentication API Service

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  User,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import { getRefreshToken } from "@/utils/auth";

const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    const data = response.data.data;
    return {
      token: data.token,
      refresh_token: data.refresh_token,
      user: {
        ...data.user,
        name: data.user?.full_name || data.user?.name || "User",
      },
    };
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Logout should succeed even if API call fails
      // Tokens will be cleared on the client side regardless
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken },
    );
    return response.data;
  },

  /**
   * Get the currently authenticated user's profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<any>>(
      API_ENDPOINTS.AUTH.GET_CURRENT_USER,
    );
    const user = response.data.data;
    return {
      ...user,
      name: user.full_name || user.name || "User",
    };
  },

  /**
   * Request a password reset email
   */
  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<PasswordResetResponse> {
    const response = await api.post<PasswordResetResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  /**
   * Reset password using token from email
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<PasswordResetResponse> {
    const response = await api.post<PasswordResetResponse>(
      `${API_ENDPOINTS.AUTH.RESET_PASSWORD}/confirm`,
      { token, newPassword },
    );
    return response.data;
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${API_ENDPOINTS.AUTH.RESET_PASSWORD}/change`,
      { currentPassword, newPassword },
    );
    return response.data;
  },
};

export default authService;
