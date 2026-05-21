// AuthLayout - Layout for login, password reset, and other auth pages

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading, show a minimal loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400" />
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Left decorative panel - hidden on mobile */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700" />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating decorative circles */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-center p-12 xl:p-16">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                />
              </svg>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Sistem Absensi
              <br />
              <span className="text-emerald-200">SDIT Al Hikmah</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Kelola absensi siswa dengan mudah menggunakan teknologi QR Code.
              Efisien, akurat, dan real-time.
            </p>

            {/* Feature highlights */}
            <div className="mt-10 space-y-4">
              {[
                { icon: "⚡", text: "Scan QR Code dalam hitungan detik" },
                {
                  icon: "📊",
                  text: "Laporan lengkap harian, bulanan dan semester",
                },
                { icon: "🔒", text: "Keamanan data terjamin" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm backdrop-blur-sm">
                    {feature.icon}
                  </span>
                  <span className="text-sm text-white/80">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
