import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { ThemeProvider } from "@/components/theme-provider";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";

// Eager-loaded pages (critical path)
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

// Lazy-loaded pages (code splitting)
const AttendanceScannerPage = lazy(() => import("@/pages/AttendanceScannerPage"));
const StudentsPage = lazy(() => import("@/pages/StudentsPage"));
const ClassesPage = lazy(() => import("@/pages/ClassesPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));

// Fallback for lazy loaded pages
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
    </div>
  );
}

// Create query client instance with defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="alhikmah-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes - Auth Layout */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                  </Route>

                  {/* Protected Routes - Main Layout */}
                  <Route element={<PrivateRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/attendance" element={<AttendanceScannerPage />} />
                      
                      <Route element={<PrivateRoute allowedRoles={['admin', 'teacher']} />}>
                        <Route path="/students" element={<StudentsPage />} />
                        <Route path="/students/:id" element={<StudentsPage />} />
                        <Route path="/classes" element={<ClassesPage />} />
                        <Route path="/classes/:id" element={<ClassesPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                      </Route>

                      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Route>
                    </Route>
                  </Route>

                  {/* Error Routes */}
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/not-found" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
