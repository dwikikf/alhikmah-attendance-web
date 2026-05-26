/**
 * Report Type Definitions
 * Matches PRD API responses for all report types
 */

import type { AttendanceStatus, AttendanceSummary } from "./attendance";

/** Report period types */
export type ReportType = "harian" | "mingguan" | "bulanan" | "semesteran" | "custom";

/** Daily report from API */
export interface DailyReport {
  report_type: "harian";
  class_id: string;
  class_name: string;
  date: string; // YYYY-MM-DD
  total_students: number;
  summary: AttendanceSummary & { hadir_percentage: number };
  records: Array<{
    nisn: string;
    student_name: string;
    status: AttendanceStatus;
    scanned_at: string | null;
    is_manual: boolean;
  }>;
  generated_at: string;
}

/** Monthly student stats */
export interface MonthlyStudentStats {
  nisn: string;
  student_name: string;
  hadir: number;
  izin: number;
  sakit: number;
  tanpa_keterangan: number;
  attendance_percentage: number;
}

/** Monthly report from API */
export interface MonthlyReport {
  report_type: "bulanan";
  class_id: string;
  class_name: string;
  period: string; // e.g., "May 2024"
  total_days: number;
  summary: {
    total_students: number;
    avg_hadir_percentage: number;
    total_izin: number;
    total_sakit: number;
    total_tanpa_keterangan: number;
  };
  student_stats: MonthlyStudentStats[];
  generated_at: string;
}

/** Semester trend data point */
export interface SemesterTrend {
  month: string;
  attendance_percentage: number;
}

/** Semester report from API */
export interface SemesterReport {
  report_type: "semesteran";
  class_id: string;
  class_name: string;
  period: string; // e.g., "Semester 1 - 2024/2025"
  duration_days: number;
  summary: {
    avg_attendance: number;
    total_izin: number;
    total_sakit: number;
    total_tanpa_keterangan: number;
  };
  trend: SemesterTrend[];
  student_stats: MonthlyStudentStats[];
  generated_at: string;
}

/** Student individual report */
export interface StudentReport {
  student_id: string;
  nisn: string;
  student_name: string;
  class_name: string;
  period: string;
  summary: {
    total_days: number;
    hadir: number;
    izin: number;
    sakit: number;
    tanpa_keterangan: number;
    attendance_percentage: number;
  };
  daily_records: Array<{
    date: string;
    status: AttendanceStatus;
    scanned_at: string | null;
  }>;
}

/** Report query parameters */
export interface ReportQueryParams {
  class_id: string;
  date?: string; // for daily
  month?: string; // for monthly (YYYY-MM)
  semester?: "1" | "2"; // for semester
  academic_year?: string; // for semester
  from_date?: string; // for custom
  to_date?: string; // for custom
  format?: "json" | "csv" | "pdf" | "excel";
}

/** Export request */
export interface ExportRequest {
  report_type: ReportType;
  class_id: string;
  date?: string;
  month?: string;
  semester?: string;
  academic_year?: string;
  format: "csv" | "excel";
}
