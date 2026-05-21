// useAuth Hook - Easy access to auth context

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import type { AuthContextType } from "@/types/auth";

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Wrap your component tree with <AuthProvider>.",
    );
  }

  return context;
}

/**
 * Hook to check if the current user has a specific role
 */
export function useHasRole(
  ...roles: string[]
): { hasRole: boolean; isLoading: boolean } {
  const { user, isLoading } = useAuth();

  const hasRole = user ? roles.includes(user.role) : false;

  return { hasRole, isLoading };
}

/**
 * Hook to check if the user is an admin
 */
export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const { hasRole, isLoading } = useHasRole("admin");
  return { isAdmin: hasRole, isLoading };
}
