// PasswordResetForm Component - Request password reset via email

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "@/services/authService";
import {
  passwordResetSchema,
  type PasswordResetFormData,
} from "@/utils/validators";
import { getErrorMessage } from "@/utils/errorHandler";
import { cn } from "@/lib/utils";

interface PasswordResetFormProps {
  onBackToLogin?: () => void;
  className?: string;
}

export default function PasswordResetForm({
  onBackToLogin,
  className,
}: PasswordResetFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    setServerError(null);
    try {
      await authService.requestPasswordReset({ email: data.email });
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  // Success state - email sent
  if (isSubmitted) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center">
          {/* Success icon */}
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
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Cek Email Anda
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Kami telah mengirim link reset password ke{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {submittedEmail}
            </span>
            . Silakan cek inbox dan folder spam Anda.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSubmittedEmail("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              id="reset-resend-btn"
            >
              Kirim ulang email
            </button>

            {onBackToLogin && (
              <button
                onClick={onBackToLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                id="reset-back-to-login-btn"
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
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                Kembali ke login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Request form
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
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
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lupa Password?
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password.
        </p>
      </div>

      {/* Error Alert */}
      {serverError && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30"
          role="alert"
          id="reset-error-alert"
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
          <p className="flex-1 text-sm font-medium text-red-800 dark:text-red-200">
            {serverError}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="reset-email"
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
              id="reset-email"
              placeholder="nama@alhikmah.sch.id"
              autoComplete="email"
              disabled={isSubmitting}
              className={cn(
                "block w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-all duration-200",
                "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "dark:bg-gray-800/50 dark:text-white dark:placeholder:text-gray-500",
                errors.email
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/30"
                  : "border-gray-200 focus:border-amber-400 focus:ring-amber-200/50 dark:border-gray-700 dark:focus:border-amber-500 dark:focus:ring-amber-900/30",
              )}
            />
          </div>
          {errors.email && (
            <p
              className="mt-1.5 text-xs text-red-500 dark:text-red-400"
              id="reset-email-error"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="reset-submit-btn"
          className={cn(
            "relative w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-200",
            "hover:from-amber-600 hover:to-orange-700 hover:shadow-xl hover:shadow-amber-500/30",
            "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "active:scale-[0.98]",
          )}
        >
          {isSubmitting ? (
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
              Mengirim...
            </span>
          ) : (
            "Kirim Link Reset"
          )}
        </button>
      </form>

      {/* Back to Login */}
      {onBackToLogin && (
        <button
          onClick={onBackToLogin}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          id="reset-back-btn"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Kembali ke login
        </button>
      )}
    </div>
  );
}
