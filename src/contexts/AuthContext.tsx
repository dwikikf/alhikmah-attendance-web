// Auth Context - Global authentication state management
// Handles: login, logout, auto-logout on token expiry, token refresh, remember me

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import authService from "@/services/authService";
import {
  setTokens,
  removeTokens,
  getAccessToken,
  isTokenExpired,
  getTokenTimeRemaining,
  setRememberMe,
  getRememberMe,
  decodeToken,
} from "@/utils/auth";
import { getErrorMessage } from "@/utils/errorHandler";
import type {
  AuthContextType,
  AuthState,
  LoginRequest,
  User,
} from "@/types/auth";

// ─── State Management ─────────────────────────────────────────────

type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ──────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Login ──────────────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginRequest) => {
    dispatch({ type: "AUTH_LOADING" });

    try {
      const response = await authService.login(credentials);

      // Store tokens
      setTokens(response.tokens);

      // Handle remember me
      setRememberMe(credentials.rememberMe ?? false);

      dispatch({ type: "AUTH_SUCCESS", payload: response.user });
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw error;
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Silently fail - we still want to clear local state
    } finally {
      removeTokens();
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, []);

  // ── Refresh Auth ───────────────────────────────────────────────
  const refreshAuth = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    // If token is fully expired and no remember me, logout
    if (isTokenExpired(token, 0) && !getRememberMe()) {
      removeTokens();
      dispatch({ type: "AUTH_LOGOUT" });
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch {
      // Try to refresh the token
      try {
        const refreshResponse = await authService.refreshToken();
        setTokens({
          accessToken: refreshResponse.accessToken,
          refreshToken: refreshResponse.refreshToken,
        });
        const user = await authService.getCurrentUser();
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch {
        removeTokens();
        dispatch({ type: "AUTH_LOGOUT" });
      }
    }
  }, []);

  // ── Clear Error ────────────────────────────────────────────────
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // ── Update User ────────────────────────────────────────────────
  const updateUser = useCallback((user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  }, []);

  // ── Initialize auth state on mount ─────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        dispatch({ type: "AUTH_LOGOUT" });
        return;
      }

      // Quick check: if token is expired and no remember me, logout immediately
      if (isTokenExpired(token, 0) && !getRememberMe()) {
        removeTokens();
        dispatch({ type: "AUTH_LOGOUT" });
        return;
      }

      // Try to get user data from token first (fast path)
      const decoded = decodeToken(token);
      if (decoded && !isTokenExpired(token, 0)) {
        // We have a valid token, set user from decoded token immediately
        // then refresh in background for full user data
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            isActive: true,
            createdAt: "",
            updatedAt: "",
          },
        });

        // Refresh user data from API in background
        try {
          const user = await authService.getCurrentUser();
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        } catch {
          // Token-based data is still valid, keep the session
        }
      } else {
        // Token is expired, try refresh
        await refreshAuth();
      }
    };

    initAuth();
  }, [refreshAuth]);

  // ── Auto-logout timer when token expires ───────────────────────
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const token = getAccessToken();
    if (!token) return;

    const timeRemaining = getTokenTimeRemaining(token);
    if (timeRemaining <= 0) return;

    // Set a timer to auto-refresh or logout when token expires
    const timeoutMs = Math.max((timeRemaining - 60) * 1000, 1000); // Refresh 60s before expiry

    const timer = setTimeout(async () => {
      try {
        const refreshResponse = await authService.refreshToken();
        setTokens({
          accessToken: refreshResponse.accessToken,
          refreshToken: refreshResponse.refreshToken,
        });
        // Re-trigger this effect by getting fresh user data
        const user = await authService.getCurrentUser();
        dispatch({ type: "AUTH_SUCCESS", payload: user });
      } catch {
        // Refresh failed, check remember me
        if (!getRememberMe()) {
          removeTokens();
          dispatch({ type: "AUTH_LOGOUT" });
        }
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.user]);

  // ── Listen for forced logout events from API interceptor ───────
  useEffect(() => {
    const handleForcedLogout = () => {
      dispatch({ type: "AUTH_LOGOUT" });
    };

    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  // ── Memoize context value ──────────────────────────────────────
  const contextValue = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      logout,
      refreshAuth,
      clearError,
      updateUser,
    }),
    [state, login, logout, refreshAuth, clearError, updateUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
