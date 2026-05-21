// PrivateRoute - Protected route wrapper that redirects unauthenticated users

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

interface PrivateRouteProps {
  /** Optional: restrict to specific roles */
  allowedRoles?: UserRole[];
  /** Optional: redirect path for unauthenticated users (default: /login) */
  redirectTo?: string;
  /** Optional: redirect path for unauthorized users (default: /unauthorized) */
  unauthorizedRedirectTo?: string;
}

/**
 * PrivateRoute wraps routes that require authentication.
 * Redirects to login if not authenticated.
 * Optionally restricts access to specific roles.
 *
 * @example
 * ```tsx
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 * <Route element={<PrivateRoute allowedRoles={['admin']} />}>
 *   <Route path="/settings" element={<SystemSettings />} />
 * </Route>
 * ```
 */
export default function PrivateRoute({
  allowedRoles,
  redirectTo = "/login",
  unauthorizedRedirectTo = "/unauthorized",
}: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }

  // Authenticated (and authorized) - render child routes
  return <Outlet />;
}
