// RoleGuard Component - Role-based access control wrapper

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  /** Allowed roles that can access the children */
  allowedRoles: UserRole[];
  /** Content to render when user has the required role */
  children: ReactNode;
  /** Optional fallback when user doesn't have the required role */
  fallback?: ReactNode;
  /** If true, show nothing instead of fallback when unauthorized */
  silent?: boolean;
}

/**
 * RoleGuard restricts content visibility based on user roles.
 * Wraps children and only renders them if the user has one of the allowed roles.
 *
 * @example
 * ```tsx
 * <RoleGuard allowedRoles={['admin', 'principal']}>
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */
export default function RoleGuard({
  allowedRoles,
  children,
  fallback,
  silent = false,
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While loading, don't render anything
  if (isLoading) {
    return null;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (silent) return null;
    return fallback ? <>{fallback}</> : null;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    if (silent) return null;

    // Default unauthorized message
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <svg
              className="h-8 w-8 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Akses Terbatas
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
