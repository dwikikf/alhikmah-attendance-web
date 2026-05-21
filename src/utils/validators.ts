// Form Validators using Zod schemas

import { z } from "zod";

/** Login form validation schema */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Password reset request schema */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

/** Password reset confirmation schema */
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, "Token tidak valid"),
    newPassword: z
      .string()
      .min(1, "Password baru wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type PasswordResetConfirmFormData = z.infer<
  typeof passwordResetConfirmSchema
>;

/** Change password schema (authenticated user) */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(1, "Password baru wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/** Email validation helper */
export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

/** Password strength checker */
export function getPasswordStrength(
  password: string,
): "weak" | "medium" | "strong" {
  if (password.length < 6) return "weak";

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}
