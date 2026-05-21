/**
 * Student Service
 * Handles all student-related API calls matching PRD endpoints.
 */

import api from "@/utils/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  Student,
  CreateStudentDto,
  UpdateStudentDto,
  StudentQueryParams,
} from "@/types/student";

// ─── List Students ─────────────────────────────────────────────────────────────

/**
 * GET /students
 * List students with optional filters (class_id, is_active, search, pagination).
 */
export async function getStudents(
  params?: StudentQueryParams,
): Promise<PaginatedResponse<Student>> {
  const response = await api.get<PaginatedResponse<Student>>("/students", {
    params,
  });
  return response.data;
}

// ─── Get Single Student ────────────────────────────────────────────────────────

/**
 * GET /students/{id}
 * Get a single student by ID.
 */
export async function getStudent(
  id: string,
): Promise<ApiResponse<Student>> {
  const response = await api.get<ApiResponse<Student>>(
    `/students/${encodeURIComponent(id)}`,
  );
  return response.data;
}

// ─── Create Student ────────────────────────────────────────────────────────────

/**
 * POST /students
 * Create a new student record.
 */
export async function createStudent(
  payload: CreateStudentDto,
): Promise<ApiResponse<Student>> {
  const response = await api.post<ApiResponse<Student>>(
    "/students",
    payload,
  );
  return response.data;
}

// ─── Update Student ────────────────────────────────────────────────────────────

/**
 * PUT /students/{id}
 * Update an existing student record.
 */
export async function updateStudent(
  id: string,
  payload: UpdateStudentDto,
): Promise<ApiResponse<Student>> {
  const response = await api.put<ApiResponse<Student>>(
    `/students/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data;
}

// ─── Delete (Soft) Student ─────────────────────────────────────────────────────

/**
 * DELETE /students/{id}
 * Soft-delete a student by setting is_active = false.
 */
export async function deleteStudent(
  id: string,
): Promise<ApiResponse<void>> {
  const response = await api.delete<ApiResponse<void>>(
    `/students/${encodeURIComponent(id)}`,
  );
  return response.data;
}

// ─── Get Student QR Code ───────────────────────────────────────────────────────

/**
 * GET /students/{id}/qrcode
 * Get the QR code image for a student.
 * Returns a Blob that can be used to create an object URL for display.
 */
export async function getStudentQRCode(id: string): Promise<Blob> {
  const response = await api.get(`/students/${encodeURIComponent(id)}/qrcode`, {
    responseType: "blob",
  });
  return response.data as Blob;
}
