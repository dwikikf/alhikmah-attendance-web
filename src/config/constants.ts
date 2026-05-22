// Application Constants

export const APP_CONFIG = {
  APP_NAME: "Alhikmah Attendance System",
  APP_VERSION: "0.1.0",
  API_TIMEOUT: 30000,
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.VITE_JWT_TOKEN_KEY || "auth_token",
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN_KEY || "refresh_token",
  USER_PREFERENCES: "user_preferences",
  THEME: "theme_preference",
};

export const QR_CONFIG = {
  SIZE: parseInt(import.meta.env.VITE_QR_CODE_SIZE || "300"),
  ERROR_LEVEL: import.meta.env.VITE_QR_CODE_ERROR_LEVEL || "H",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "20"),
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || "100"),
};

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  SICK: "sick",
  PERMISSION: "permission",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Terjadi kesalahan jaringan. Silakan coba lagi.",
  SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
  INVALID_CREDENTIALS: "Email atau password tidak valid.",
  UNAUTHORIZED: "Anda tidak memiliki akses ke halaman ini.",
  NOT_FOUND: "Data tidak ditemukan.",
  VALIDATION_ERROR: "Silakan periksa kembali data yang Anda masukkan.",
  TOKEN_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Berhasil login.",
  LOGOUT_SUCCESS: "Berhasil logout.",
  CREATE_SUCCESS: "Data berhasil dibuat.",
  UPDATE_SUCCESS: "Data berhasil diperbarui.",
  DELETE_SUCCESS: "Data berhasil dihapus.",
  ATTENDANCE_RECORDED: "Absensi berhasil dicatat.",
} as const;
