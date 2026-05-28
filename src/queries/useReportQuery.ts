import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type { 
  DailyReport, 
  MonthlyReport, 
  SemesterReport,
  ReportQueryParams 
} from "@/types";

/**
 * Fetch daily report
 */
export const useDailyReport = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: ["report", "daily", params.class_id, params.date],
    queryFn: async () => {
      if (!params.class_id || !params.date) return null;
      const res = await api.get<{ success: boolean; data: DailyReport }>(
        `/reports/daily?class_id=${params.class_id}&date=${params.date}`
      );
      return res.data.data;
    },
    enabled: !!params.class_id && !!params.date,
  });
};

/**
 * Fetch monthly report
 */
export const useMonthlyReport = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: ["report", "monthly", params.class_id, params.month],
    queryFn: async () => {
      if (!params.class_id || !params.month) return null;
      const res = await api.get<{ success: boolean; data: MonthlyReport }>(
        `/reports/monthly?class_id=${params.class_id}&month=${params.month}`
      );
      return res.data.data;
    },
    enabled: !!params.class_id && !!params.month,
  });
};

/**
 * Fetch semester report
 */
export const useSemesterReport = (params: ReportQueryParams) => {
  return useQuery({
    queryKey: ["report", "semester", params.class_id, params.semester, params.academic_year],
    queryFn: async () => {
      if (!params.class_id || !params.semester || !params.academic_year) return null;
      const res = await api.get<{ success: boolean; data: SemesterReport }>(
        `/reports/semester?class_id=${params.class_id}&semester=${params.semester}&academic_year=${params.academic_year}`
      );
      return res.data.data;
    },
    enabled: !!params.class_id && !!params.semester && !!params.academic_year,
  });
};

/**
 * Force refresh mutations
 */
export const useRefreshDailyReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { class_id: string; date: string }) => {
      const res = await api.get<{ success: boolean; data: DailyReport }>(
        `/reports/daily?class_id=${params.class_id}&date=${params.date}&force_refresh=true`
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["report", "daily", variables.class_id, variables.date]
      });
    }
  });
};
export const useRefreshMonthlyReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { class_id: string; month: string }) => {
      const res = await api.get<{ success: boolean; data: MonthlyReport }>(
        `/reports/monthly?class_id=${params.class_id}&month=${params.month}&force_refresh=true`
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["report", "monthly", variables.class_id, variables.month]
      });
    }
  });
};

export const useRefreshSemesterReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { class_id: string; semester: string; academic_year: string }) => {
      const res = await api.get<{ success: boolean; data: SemesterReport }>(
        `/reports/semester?class_id=${params.class_id}&semester=${params.semester}&academic_year=${params.academic_year}&force_refresh=true`
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["report", "semester", variables.class_id, variables.semester, variables.academic_year]
      });
    }
  });
};
