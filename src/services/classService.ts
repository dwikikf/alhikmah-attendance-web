/**
 * Class Service
 * Handles all class-related API calls matching PRD endpoints.
 */

import api from "@/utils/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  Class,
  ClassDetail,
  CreateClassDto,
  UpdateClassDto,
  ClassQueryParams,
} from "@/types/class";

// ─── List Classes ──────────────────────────────────────────────────────────────

/**
 * GET /classes
 * List classes with optional filters (academic_year, pagination).
 */
export async function getClasses(
  params?: ClassQueryParams,
): Promise<PaginatedResponse<Class>> {
  const response = await api.get<PaginatedResponse<Class>>("/classes", {
    params,
  });
  return {
    ...response.data,
    data: response.data.data || [],
  };
}

// ─── Get Class Detail ──────────────────────────────────────────────────────────

/**
 * GET /classes/{id}
 * Get class detail including its list of students.
 */
export async function getClass(
  id: string,
): Promise<ApiResponse<ClassDetail>> {
  const response = await api.get<ApiResponse<ClassDetail>>(
    `/classes/${encodeURIComponent(id)}`,
  );
  return response.data;
}

/**
 * GET /classes/{id}/students
 * Get students for a specific class.
 */
export async function getClassStudents(
	id: string,
): Promise<ApiResponse<any[]>> { // Will import Student type next
	const response = await api.get<ApiResponse<any[]>>(
		`/classes/${encodeURIComponent(id)}/students`,
	);
	return response.data;
}

// ─── Create Class ──────────────────────────────────────────────────────────────

/**
 * POST /classes
 * Create a new class.
 */
export async function createClass(
  payload: CreateClassDto,
): Promise<ApiResponse<Class>> {
  const response = await api.post<ApiResponse<Class>>(
    "/classes",
    payload,
  );
  return response.data;
}

// ─── Update Class ──────────────────────────────────────────────────────────────

/**
 * PUT /classes/{id}
 * Update an existing class.
 */
export async function updateClass(
  id: string,
  payload: UpdateClassDto,
): Promise<ApiResponse<Class>> {
  const response = await api.put<ApiResponse<Class>>(
    `/classes/${encodeURIComponent(id)}`,
    payload,
  );
  return response.data;
}

// ─── Delete (Soft) Class ───────────────────────────────────────────────────────

/**
 * DELETE /classes/{id}
 * Soft-delete a class.
 */
export async function deleteClass(
  id: string,
): Promise<ApiResponse<void>> {
  const response = await api.delete<ApiResponse<void>>(
    `/classes/${encodeURIComponent(id)}`,
  );
  return response.data;
}
