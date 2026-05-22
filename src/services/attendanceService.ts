/**
 * Attendance Service
 * Handles all attendance-related API calls matching PRD endpoints.
 */

import api from "@/utils/api";
import type { ApiResponse } from "@/types/api";
import type {
  AttendanceRecord,
  DailyAttendance,
  QRScanRequest,
  ManualAttendanceRequest,
  UpdateAttendanceRequest,
} from "@/types/attendance";
import type { StudentReport } from "@/types/report";

// ─── QR Scan ───────────────────────────────────────────────────────────────────

/**
 * POST /attendances/qr-scan
 * Record attendance via QR code scan.
 */
export async function recordQRScan(
  payload: QRScanRequest,
): Promise<ApiResponse<AttendanceRecord>> {
  const response = await api.post<ApiResponse<AttendanceRecord>>(
    "/attendances/qr-scan",
    payload,
  );
  return response.data;
}

// ─── Manual Attendance ─────────────────────────────────────────────────────────

/**
 * POST /attendances/manual
 * Record manual attendance for multiple students at once.
 */
export async function recordManualAttendance(
  payload: ManualAttendanceRequest,
): Promise<ApiResponse<AttendanceRecord[]>> {
  const response = await api.post<ApiResponse<AttendanceRecord[]>>(
    "/attendances/manual",
    payload,
  );
  return response.data;
}

// ─── Get Class Attendance ──────────────────────────────────────────────────────

/**
 * GET /attendances/{class_id}/{date}
 * Get attendance records for a specific class on a specific date.
 *
 * @param classId - UUID of the class
 * @param date    - Date string in YYYY-MM-DD format
 */
export async function getClassAttendance(
  classId: string,
  date: string,
): Promise<ApiResponse<DailyAttendance>> {
  const response = await api.get<ApiResponse<DailyAttendance>>(
    `/attendances/${encodeURIComponent(classId)}/${encodeURIComponent(date)}`,
  );
  return response.data;
}

// ─── Update Attendance ─────────────────────────────────────────────────────────

/**
 * PUT /attendances/{attendance_id}
 * Update an existing attendance record (e.g., change status, add notes).
 *
 * @param attendanceId - UUID of the attendance record
 * @param payload      - Updated status, notes, and reason for change
 */
export async function updateAttendance(
  attendanceId: string,
  payload: UpdateAttendanceRequest,
): Promise<ApiResponse<AttendanceRecord>> {
  const response = await api.put<ApiResponse<AttendanceRecord>>(
    `/attendances/${encodeURIComponent(attendanceId)}`,
    payload,
  );
  return response.data;
}


