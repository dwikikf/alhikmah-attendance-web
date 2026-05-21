import { API_CONFIG } from "./constants";

export const apiConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API Endpoint definitions
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    GET_CURRENT_USER: "/auth/me",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Students
  STUDENTS: {
    LIST: "/students",
    CREATE: "/students",
    GET: "/students/:id",
    UPDATE: "/students/:id",
    DELETE: "/students/:id",
    BULK_IMPORT: "/students/bulk-import",
  },

  // Classes
  CLASSES: {
    LIST: "/classes",
    CREATE: "/classes",
    GET: "/classes/:id",
    UPDATE: "/classes/:id",
    DELETE: "/classes/:id",
    MEMBERS: "/classes/:id/members",
  },

  // Attendance
  ATTENDANCE: {
    RECORD: "/attendance",
    LIST: "/attendance",
    GET: "/attendance/:id",
    UPDATE: "/attendance/:id",
    DELETE: "/attendance/:id",
    BULK_UPLOAD: "/attendance/bulk-upload",
    GET_BY_STUDENT: "/attendance/student/:studentId",
    GET_BY_CLASS: "/attendance/class/:classId",
  },

  // QR Codes
  QR: {
    GENERATE: "/qr/generate",
    VALIDATE: "/qr/validate",
    GET_HISTORY: "/qr/history",
  },

  // Reports
  REPORTS: {
    DAILY: "/reports/daily",
    WEEKLY: "/reports/weekly",
    MONTHLY: "/reports/monthly",
    SEMESTER: "/reports/semester",
    CUSTOM: "/reports/custom",
  },

  // Settings
  SETTINGS: {
    GET_SYSTEM: "/settings/system",
    UPDATE_SYSTEM: "/settings/system",
    GET_USER: "/settings/user",
    UPDATE_USER: "/settings/user",
  },
};
