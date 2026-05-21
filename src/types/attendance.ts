/**
 * Attendance Type Definitions
 * Matches PRD database schema and API responses
 */

/** Attendance status enum matching PRD */
export type AttendanceStatus = "hadir" | "izin" | "sakit" | "tanpa_keterangan";

/** Attendance status labels in Indonesian */
export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  izin: "Izin",
  sakit: "Sakit",
  tanpa_keterangan: "Tanpa Keterangan",
};

/** Attendance status colors for UI badges */
export const ATTENDANCE_STATUS_COLORS: Record<
  AttendanceStatus,
  { bg: string; text: string; border: string }
> = {
  hadir: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  izin: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  sakit: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  tanpa_keterangan: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
};

/** Single attendance record from API */
export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  nisn: string;
  class_id: string;
  class_name: string;
  attendance_date: string; // ISO date string (YYYY-MM-DD)
  status: AttendanceStatus;
  recorded_by: string;
  recorded_at: string; // ISO timestamp
  scanned_at: string | null; // null if manual entry
  notes: string | null;
  is_manual: boolean;
}

/** Summary of attendance counts for a class/day */
export interface AttendanceSummary {
  hadir: number;
  izin: number;
  sakit: number;
  tanpa_keterangan: number;
  hadir_percentage?: number;
}

/** Daily attendance for a class */
export interface DailyAttendance {
  class_id: string;
  class_name: string;
  attendance_date: string;
  total_students: number;
  summary: AttendanceSummary;
  records: AttendanceRecord[];
}

/** QR scan request payload matching PRD */
export interface QRScanRequest {
  qr_code_data: string; // "NISN|FullName|ClassName"
  class_id: string;
  scanned_at: string; // ISO timestamp
}

/** Manual attendance entry for a single student */
export interface ManualAttendanceEntry {
  student_id: string;
  status: AttendanceStatus;
  notes?: string;
}

/** Manual attendance request payload matching PRD */
export interface ManualAttendanceRequest {
  class_id: string;
  attendance_date: string; // YYYY-MM-DD
  students: ManualAttendanceEntry[];
}

/** Update attendance request */
export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
  notes?: string;
  reason: string; // reason for change (audit trail)
}

/** Attendance audit log entry */
export interface AttendanceAudit {
  id: string;
  attendance_id: string;
  old_status: AttendanceStatus;
  new_status: AttendanceStatus;
  changed_by: string;
  changed_at: string;
  reason: string;
}

/** Attendance query parameters */
export interface AttendanceQueryParams {
  class_id: string;
  date: string; // YYYY-MM-DD
}

/** Student attendance for "belum absen" list */
export interface UnscannedStudent {
  id: string;
  nisn: string;
  full_name: string;
  class_name: string;
}
