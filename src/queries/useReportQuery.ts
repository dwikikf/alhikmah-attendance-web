import { useQuery } from "@tanstack/react-query";
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
