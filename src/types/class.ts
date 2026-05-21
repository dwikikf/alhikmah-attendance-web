/**
 * Class Type Definitions
 * Matches PRD database schema and API responses
 */

/** Class record from API */
export interface Class {
  id: string;
  class_name: string; // e.g., "1A", "2B"
  teacher_id: string;
  teacher_name: string;
  academic_year: string; // e.g., "2024/2025"
  capacity: number;
  student_count: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** Create class DTO */
export interface CreateClassDto {
  class_name: string;
  teacher_id: string;
  academic_year: string;
  capacity?: number;
  description?: string;
}

/** Update class DTO */
export interface UpdateClassDto {
  class_name?: string;
  teacher_id?: string;
  capacity?: number;
  description?: string;
}

/** Class query parameters */
export interface ClassQueryParams {
  academic_year?: string;
  teacher_id?: string;
  page?: number;
  limit?: number;
}

/** Class with student list (detail view) */
export interface ClassDetail extends Class {
  students: Array<{
    id: string;
    nisn: string;
    full_name: string;
    qr_code_data: string;
    attendance_today: string | null;
    scanned_at: string | null;
  }>;
}
