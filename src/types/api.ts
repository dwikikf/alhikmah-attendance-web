// API Response Type Definitions

/** Standard API success response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** API error response */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/** Query parameters for list endpoints */
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Date range filter */
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
