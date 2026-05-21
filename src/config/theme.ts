// Theme Configuration - Light and dark color schemes

export const themeConfig = {
  light: {
    background: "#f8fafc",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    primary: "#059669",
    primaryForeground: "#ffffff",
    secondary: "#f1f5f9",
    secondaryForeground: "#475569",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#0d9488",
    accentForeground: "#ffffff",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#059669",
  },
  dark: {
    background: "#030712",
    foreground: "#f8fafc",
    card: "#111827",
    cardForeground: "#f8fafc",
    primary: "#10b981",
    primaryForeground: "#022c22",
    secondary: "#1e293b",
    secondaryForeground: "#94a3b8",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    accent: "#14b8a6",
    accentForeground: "#042f2e",
    destructive: "#dc2626",
    destructiveForeground: "#fef2f2",
    border: "#1e293b",
    input: "#1e293b",
    ring: "#10b981",
  },
} as const;

export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme_preference";
