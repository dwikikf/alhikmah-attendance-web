import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { PaginatedResponse } from "@/types/api";
import type { Student } from "@/types/student";
import type { Class } from "@/types/class";
import type { DailyReport } from "@/types/report";

/**
 * Dashboard stats aggregated from multiple backend endpoints.
 */
export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  todayAttendance: {
    hadir: number;
    izin: number;
    sakit: number;
    tanpa_keterangan: number;
    total: number;
    hadirPercentage: number;
  };
  classes: Array<{
    id: string;
    class_name: string;
    student_count: number;
  }>;
}

/**
 * Fetch total student count from /students endpoint.
 * We only need pagination.totalItems, so limit=1.
 */
export const useTotalStudents = () => {
  return useQuery({
    queryKey: ["dashboard", "totalStudents"],
    queryFn: async () => {
      try {
        const res = await api.get<PaginatedResponse<Student>>("/students", {
          params: { limit: 1, page: 1, is_active: true },
        });
        // The backend may return pagination info in different shapes
        const pagination = (res.data as any)?.pagination || (res.data as any)?.meta;
        return pagination?.totalItems ?? pagination?.total ?? (res.data.data || []).length;
      } catch {
        return 0;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch total class count from /classes endpoint.
 */
export const useTotalClasses = () => {
  return useQuery({
    queryKey: ["dashboard", "totalClasses"],
    queryFn: async () => {
      try {
        const res = await api.get<PaginatedResponse<Class>>("/classes", {
          params: { limit: 100, page: 1 },
        });
        const data = res.data.data || [];
        const pagination = (res.data as any)?.pagination || (res.data as any)?.meta;
        return {
          total: pagination?.totalItems ?? pagination?.total ?? data.length,
          classes: data.map((c: any) => ({
            id: c.id,
            class_name: c.class_name,
            student_count: c.student_count || 0,
          })),
        };
      } catch {
        return { total: 0, classes: [] };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch today's attendance aggregated across all classes.
 * We iterate over each class and call /reports/daily for each.
 * If class list is empty or reports fail, we gracefully return zeros.
 */
export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ["dashboard", "recentActivity", limit],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: any[] }>("/dashboard/recent-activity", { params: { limit } });
      return res.data?.data || [];
    },
  });
};

export const useAttendanceTrend = (days: number = 7) => {
  return useQuery({
    queryKey: ["dashboard", "attendanceTrend", days],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: any[] }>("/dashboard/attendance-trend", { params: { days } });
      return res.data?.data || [];
    },
  });
};

export const useTodayAttendanceSummary = (
  classIds: string[],
  date: string,
) => {
  return useQuery({
    queryKey: ["dashboard", "todayAttendance", date, classIds],
    queryFn: async () => {
      const totals = {
        hadir: 0,
        izin: 0,
        sakit: 0,
        tanpa_keterangan: 0,
        totalStudents: 0,
      };

      if (!classIds.length) return totals;

      // Fetch attendance for each class in parallel
      const results = await Promise.allSettled(
        classIds.map(async (classId) => {
          const res = await api.get<{ success: boolean; data: DailyReport }>(
            `/reports/daily`,
            { params: { class_id: classId, date } },
          );
          return res.data?.data;
        }),
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          const report = result.value;
          const summary = report.summary;
          if (summary) {
            totals.hadir += summary.hadir || 0;
            totals.izin += summary.izin || 0;
            totals.sakit += summary.sakit || 0;
            totals.tanpa_keterangan += summary.tanpa_keterangan || 0;
          }
          totals.totalStudents += report.total_students || 0;
        }
      }

      return totals;
    },
    enabled: classIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
