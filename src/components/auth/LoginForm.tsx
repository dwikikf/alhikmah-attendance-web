// LoginForm Component - Email/password login with validation and remember me

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/utils/validators";
import { getPasswordStrength } from "@/utils/validators";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onForgotPassword?: () => void;
  className?: string;
}

export default function LoginForm({
  onForgotPassword,
  className,
}: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const passwordValue = watch("password");
  const passwordStrength = passwordValue
    ? getPasswordStrength(passwordValue)
    : null;

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
    } catch {
      // Error is handled by AuthContext and displayed via the error state
    }
  };

  const loading = isLoading || isSubmitting;

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Selamat Datang
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Masuk ke sistem absensi Al Hikmah
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
          role="alert"
          id="login-error-alert"
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
          <button
            onClick={clearError}
            className="shrink-0 text-red-400 transition-colors hover:text-red-600 dark:hover:text-red-300"
            aria-label="Tutup pesan error"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <input
              {...register("email")}
              type="email"
              id="login-email"
              placeholder="nama@alhikmah.sch.id"
              autoComplete="email"
              disabled={loading}
              className={cn(
                "block w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all duration-200",
                "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "dark:bg-gray-800/50 dark:text-white dark:placeholder:text-gray-500",
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/30"
                  : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-200/50 dark:border-gray-700 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30",
              )}
            />
          </div>
          {errors.email && (
            <p
              className="mt-1.5 text-xs text-red-500 dark:text-red-400"
              id="login-email-error"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="login-password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              disabled={loading}
              className={cn(
                "block w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm shadow-sm transition-all duration-200",
                "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "dark:bg-gray-800/50 dark:text-white dark:placeholder:text-gray-500",
                errors.password
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/30"
                  : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-200/50 dark:border-gray-700 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/30",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p
              className="mt-1.5 text-xs text-red-500 dark:text-red-400"
              id="login-password-error"
            >
              {errors.password.message}
            </p>
          )}
          {/* Password strength indicator */}
          {passwordValue && passwordValue.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    passwordStrength === "weak"
                      ? "bg-red-400"
                      : passwordStrength === "medium"
                        ? "bg-amber-400"
                        : "bg-emerald-400",
                  )}
                />
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    passwordStrength === "medium"
                      ? "bg-amber-400"
                      : passwordStrength === "strong"
                        ? "bg-emerald-400"
                        : "bg-gray-200 dark:bg-gray-700",
                  )}
                />
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    passwordStrength === "strong"
                      ? "bg-emerald-400"
                      : "bg-gray-200 dark:bg-gray-700",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                      ? "text-amber-500"
                      : "text-emerald-500",
                )}
              >
                {passwordStrength === "weak"
                  ? "Lemah"
                  : passwordStrength === "medium"
                    ? "Sedang"
                    : "Kuat"}
              </span>
            </div>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-remember"
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              {...register("rememberMe")}
              type="checkbox"
              id="login-remember"
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Ingat saya
            </span>
          </label>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              id="login-forgot-password-btn"
            >
              Lupa password?
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          id="login-submit-btn"
          className={cn(
            "relative w-full rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200",
            "hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/30",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
            "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-lg",
            "active:scale-[0.98]",
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} SDIT Al Hikmah. Sistem Absensi Digital.
      </p>
    </div>
  );
}
