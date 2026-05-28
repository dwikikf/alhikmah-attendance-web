import { UserRole } from "./auth";

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  full_name: string;
  email: string;
  password?: string;
}

export interface UserQueryParams {
  role?: UserRole;
  is_active?: boolean;
  page?: number;
  limit?: number;
}
