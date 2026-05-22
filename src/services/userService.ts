import api from "@/utils/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { SystemUser as User, CreateUserDto, UpdateUserDto, UserQueryParams } from "@/types/user";

export async function getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
  const response = await api.get<PaginatedResponse<User>>("/users", { params });
  return {
    ...response.data,
    data: response.data.data || [],
  };
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>(`/users/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createUser(payload: CreateUserDto): Promise<ApiResponse<User>> {
  const response = await api.post<ApiResponse<User>>("/users", payload);
  return response.data;
}

export async function updateUser(id: string, payload: UpdateUserDto): Promise<ApiResponse<User>> {
  const response = await api.put<ApiResponse<User>>(`/users/${encodeURIComponent(id)}`, payload);
  return response.data;
}

export async function deleteUser(id: string): Promise<ApiResponse<void>> {
  const response = await api.delete<ApiResponse<void>>(`/users/${encodeURIComponent(id)}`);
  return response.data;
}
