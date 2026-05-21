import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: ReactNode;
  /** Allowed roles to see the children */
  allowedRoles: UserRole[];
  /** Optional fallback UI if the user doesn't have permission */
  fallback?: ReactNode;
}

/**
 * A wrapper component that only renders its children if the current user
 * has one of the allowed roles. Useful for hiding admin-only buttons.
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
