// Auth Utility Functions - Token management, JWT decode, etc.

import { jwtDecode } from "jwt-decode";
import { STORAGE_KEYS } from "@/config/constants";
import type { AuthTokens, JWTPayload } from "@/types/auth";

/**
 * Store access token in localStorage
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Remove access token from localStorage
 */
export function removeAccessToken(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}

// Refresh token is now handled via HttpOnly Cookies, not stored in localStorage

/**
 * Store access token
 */
export function setTokens(tokens: { accessToken: string }): void {
  setAccessToken(tokens.accessToken);
}

/**
 * Get access token wrapper
 */
export function getTokens(): { accessToken: string } | null {
  const accessToken = getAccessToken();
  if (!accessToken) return null;
  return { accessToken };
}

/**
 * Remove both tokens at once (clear all auth data)
 */
export function removeTokens(): void {
  removeAccessToken();
  removeRememberMe();
}

/**
 * Decode a JWT token to extract payload
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired
 * @param token JWT token string
 * @param bufferSeconds Seconds before actual expiry to consider it expired (default: 60)
 */
export function isTokenExpired(
  token: string,
  bufferSeconds: number = 60,
): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime + bufferSeconds;
}

/**
 * Check if a token will expire soon (within the buffer period)
 * Useful for proactive refresh
 */
export function isTokenExpiringSoon(
  token: string,
  bufferSeconds: number = 300,
): boolean {
  return isTokenExpired(token, bufferSeconds);
}

/**
 * Get the time remaining until token expiry in seconds
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - currentTime);
}

/**
 * Store "Remember Me" preference
 */
export function setRememberMe(value: boolean): void {
  if (value) {
    localStorage.setItem("remember_me", "true");
  } else {
    localStorage.removeItem("remember_me");
  }
}

/**
 * Get "Remember Me" preference
 */
export function getRememberMe(): boolean {
  return localStorage.getItem("remember_me") === "true";
}

/**
 * Remove "Remember Me" preference
 */
export function removeRememberMe(): void {
  localStorage.removeItem("remember_me");
}

/**
 * Check if user has valid authentication (token exists and not expired)
 */
export function hasValidAuth(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Get user info from stored token (without API call)
 */
export function getUserFromToken(): JWTPayload | null {
  const token = getAccessToken();
  if (!token) return null;
  if (isTokenExpired(token, 0)) return null;
  return decodeToken(token);
}
