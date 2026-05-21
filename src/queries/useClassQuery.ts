import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { 
  Class, 
  ClassDetail,
  CreateClassDto, 
  UpdateClassDto, 
  ClassQueryParams,
  PaginatedResponse 
} from "@/types";

export const useClasses = (params?: ClassQueryParams) => {
  return useQuery({
    queryKey: ["classes", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.academic_year) searchParams.append("academic_year", params.academic_year);
      if (params?.teacher_id) searchParams.append("teacher_id", params.teacher_id);
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));

      const queryString = searchParams.toString();
      const url = `/classes${queryString ? `?${queryString}` : ""}`;
      
      const res = await api.get<PaginatedResponse<Class>>(url);
      return res.data;
    },
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ success: boolean; data: ClassDetail }>(`/classes/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateClassDto) => {
      const res = await api.post<{ success: boolean; data: Class }>("/classes", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClassDto }) => {
      const res = await api.put<{ success: boolean; data: Class }>(`/classes/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes", variables.id] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
