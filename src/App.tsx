import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Layout imports (to be created)
// import AuthLayout from '@layouts/AuthLayout'
// import MainLayout from '@layouts/MainLayout'

// Page imports (to be created)
// import LoginPage from '@pages/LoginPage'
// import DashboardPage from '@pages/DashboardPage'
// import NotFoundPage from '@pages/NotFoundPage'

// Create query client instance
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Auth Layout */}
          {/* <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route> */}

          {/* Protected Routes - Main Layout */}
          {/* <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route> */}

          {/* Fallback Routes */}
          {/* <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
