// Authentication Type Definitions

import { USER_ROLES } from "@/config/constants";

/** User role type derived from constants */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** User model returned from API */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/** JWT token payload after decoding */
export interface JWTPayload {
  sub: string; // user ID
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/** Stored auth tokens */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Login request payload */
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/** Login response from API (data portion) */
export interface LoginResponse {
  user: User;
  token: string;
  refresh_token: string;
}

/** Refresh token request */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** Refresh token response */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** Password reset request */
export interface PasswordResetRequest {
  email: string;
}

/** Password reset response */
export interface PasswordResetResponse {
  message: string;
}

/** Password reset confirmation (with token from email) */
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/** Change password request (authenticated user) */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Auth context state */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/** Auth context actions */
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

/** Complete auth context type */
export type AuthContextType = AuthState & AuthActions;
