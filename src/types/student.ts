/**
 * Student Type Definitions
 * Matches PRD database schema and API responses
 */

export type Gender = "laki-laki" | "perempuan";

/** Student record from API */
export interface Student {
  id: string;
  nisn: string;
  full_name: string;
  class_id: string;
  class_name: string;
  date_of_birth: string | null; // ISO date
  gender: Gender | null;
  photo_url: string | null;
  qr_code_data: string; // "NISN|FullName|ClassName"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Create student DTO */
export interface CreateStudentDto {
  nisn: string;
  full_name: string;
  class_id: string;
  date_of_birth?: string;
  gender?: Gender;
  photo_url?: string;
}

/** Update student DTO */
export interface UpdateStudentDto {
  full_name?: string;
  class_id?: string;
  date_of_birth?: string;
  gender?: Gender;
  photo_url?: string;
  is_active?: boolean;
}

/** Student query parameters */
export interface StudentQueryParams {
  class_id?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/** Bulk student import row */
export interface BulkStudentRow {
  nisn: string;
  full_name: string;
  class_name: string;
  date_of_birth?: string;
  gender?: Gender;
}

/** Bulk import result */
export interface BulkImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{ row: number; nisn: string; message: string }>;
}
