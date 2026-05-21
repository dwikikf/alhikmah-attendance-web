import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto, 
  StudentQueryParams,
  PaginatedResponse 
} from "@/types";

export const useStudents = (params: StudentQueryParams) => {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.class_id) searchParams.append("class_id", params.class_id);
      if (params.is_active !== undefined) searchParams.append("is_active", String(params.is_active));
      if (params.search) searchParams.append("search", params.search);
      if (params.page) searchParams.append("page", String(params.page));
      if (params.limit) searchParams.append("limit", String(params.limit));
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_order) searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = `/students${queryString ? `?${queryString}` : ""}`;
      
      const res = await api.get<PaginatedResponse<Student>>(url);
      return res.data;
    },
  });
};

export const useStudent = (id: string) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ success: boolean; data: Student }>(`/students/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateStudentDto) => {
      const res = await api.post<{ success: boolean; data: Student }>("/students", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStudentDto }) => {
      const res = await api.put<{ success: boolean; data: Student }>(`/students/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
