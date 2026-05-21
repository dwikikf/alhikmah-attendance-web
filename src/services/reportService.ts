/**
 * Report Service
 * Handles all report-related API calls matching PRD endpoints.
 */

import api from "@/utils/api";
import type { ApiResponse } from "@/types/api";
import type {
  DailyReport,
  MonthlyReport,
  SemesterReport,
  StudentReport,
  ExportRequest,
} from "@/types/report";

// ─── Daily Report ──────────────────────────────────────────────────────────────

/** Query params for daily report */
export interface DailyReportParams {
  class_id: string;
  date: string; // YYYY-MM-DD
}

/**
 * GET /reports/daily?class_id=X&date=Y
 * Get the daily attendance report for a specific class and date.
 */
export async function getDailyReport(
  params: DailyReportParams,
): Promise<ApiResponse<DailyReport>> {
  const response = await api.get<ApiResponse<DailyReport>>(
    "/reports/daily",
    { params },
  );
  return response.data;
}

// ─── Monthly Report ────────────────────────────────────────────────────────────

/** Query params for monthly report */
export interface MonthlyReportParams {
  class_id: string;
  month: string; // YYYY-MM
}

/**
 * GET /reports/monthly?class_id=X&month=Y
 * Get the monthly attendance report for a specific class and month.
 */
export async function getMonthlyReport(
  params: MonthlyReportParams,
): Promise<ApiResponse<MonthlyReport>> {
  const response = await api.get<ApiResponse<MonthlyReport>>(
    "/reports/monthly",
    { params },
  );
  return response.data;
}

// ─── Semester Report ───────────────────────────────────────────────────────────

/** Query params for semester report */
export interface SemesterReportParams {
  class_id: string;
  semester: "1" | "2";
  academic_year: string; // e.g., "2024/2025"
}

/**
 * GET /reports/semester?class_id=X&semester=1&academic_year=2024/2025
 * Get the semester attendance report for a specific class.
 */
export async function getSemesterReport(
  params: SemesterReportParams,
): Promise<ApiResponse<SemesterReport>> {
  const response = await api.get<ApiResponse<SemesterReport>>(
    "/reports/semester",
    { params },
  );
  return response.data;
}

// ─── Student Report ────────────────────────────────────────────────────────────

/** Query params for student report */
export interface StudentReportParams {
  from_date: string; // YYYY-MM-DD
  to_date: string;   // YYYY-MM-DD
}

/**
 * GET /reports/student/{student_id}?from_date=X&to_date=Y
 * Get attendance history for a specific student within a date range.
 */
export async function getStudentReport(
  studentId: string,
  params: StudentReportParams,
): Promise<ApiResponse<StudentReport>> {
  const response = await api.get<ApiResponse<StudentReport>>(
    `/reports/student/${encodeURIComponent(studentId)}`,
    { params },
  );
  return response.data;
}

// ─── Export Report ─────────────────────────────────────────────────────────────

/**
 * POST /reports/export
 * Export a report in the requested format (CSV, Excel, PDF).
 * Returns a Blob that can be used to trigger a file download.
 */
export async function exportReport(payload: ExportRequest): Promise<Blob> {
  const response = await api.post("/reports/export", payload, {
    responseType: "blob",
  });
  return response.data as Blob;
}

/**
 * Helper: trigger a browser download from a Blob.
 *
 * @param blob     - The file blob returned from exportReport
 * @param filename - Desired filename for the download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
