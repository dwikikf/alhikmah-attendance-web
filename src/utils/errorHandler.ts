// Error Handling Utilities

import { AxiosError } from "axios";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/config/constants";
import type { ApiErrorResponse } from "@/types/api";

/** Parsed application error */
export interface AppError {
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string[]>;
  isNetworkError: boolean;
  isAuthError: boolean;
}

/**
 * Parse an error (from Axios or generic) into a standardized AppError
 */
export function parseError(error: unknown): AppError {
  // Axios error with response
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      message: error.message,
      isNetworkError: false,
      isAuthError: false,
    };
  }

  // String error
  if (typeof error === "string") {
    return {
      message: error,
      isNetworkError: false,
      isAuthError: false,
    };
  }

  // Unknown error
  return {
    message: "Terjadi kesalahan yang tidak diketahui.",
    isNetworkError: false,
    isAuthError: false,
  };
}

/**
 * Parse an Axios error into AppError
 */
function parseAxiosError(error: AxiosError<ApiErrorResponse>): AppError {
  // Network error (no response)
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      isNetworkError: true,
      isAuthError: false,
    };
  }

  const { status, data } = error.response;
  const isAuthError =
    status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN;

  // Map status codes to messages
  let message: string;
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      message = data?.message || ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case HTTP_STATUS.FORBIDDEN:
      message = data?.message || ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case HTTP_STATUS.NOT_FOUND:
      message = data?.message || ERROR_MESSAGES.NOT_FOUND;
      break;
    case HTTP_STATUS.BAD_REQUEST:
      message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      message = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return {
    message,
    statusCode: status,
    fieldErrors: data?.errors,
    isNetworkError: false,
    isAuthError,
  };
}

/**
 * Get a user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  return parseError(error).message;
}

/**
 * Check if error is a network connectivity issue
 */
export function isNetworkError(error: unknown): boolean {
  return parseError(error).isNetworkError;
}

/**
 * Check if error is an authentication/authorization issue
 */
export function isAuthenticationError(error: unknown): boolean {
  return parseError(error).isAuthError;
}

/**
 * Check if the browser is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
