import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  DailyAttendance,
  QRScanRequest,
  ManualAttendanceRequest,
  UpdateAttendanceRequest,
  AttendanceQueryParams,
  StudentReport
} from "@/types";

/**
 * Fetch daily attendance for a specific class
 */
export const useClassAttendance = (params: AttendanceQueryParams) => {
  return useQuery({
    queryKey: ["attendance", "class", params.class_id, params.date],
    queryFn: async () => {
      if (!params.class_id || !params.date) return null;
      const res = await api.get<{ success: boolean; data: DailyAttendance }>(
        `/attendances/${params.class_id}/${params.date}`
      );
      return res.data.data;
    },
    enabled: !!params.class_id && !!params.date,
  });
};

/**
 * Record attendance via QR Code Scan
 */
export const useRecordQRScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: QRScanRequest) => {
      const res = await api.post("/attendances/qr-scan", payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the class daily attendance
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
};

/**
 * Record attendance manually
 */
export const useRecordManualAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ManualAttendanceRequest) => {
      const res = await api.post("/attendances/manual", payload);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate the class daily attendance
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },
  });
};

/**
 * Update an existing attendance record
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAttendanceRequest;
    }) => {
      const res = await api.put(`/attendances/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      // General invalidation for all attendance data
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

/**
 * Fetch student attendance history
 */
export const useStudentAttendanceHistory = (
  studentId: string,
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["attendance", "student", studentId, fromDate, toDate],
    queryFn: async () => {
      if (!studentId) return null;
      
      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      
      const queryString = params.toString();
      const url = `/reports/student/${studentId}${queryString ? `?${queryString}` : ""}`;
      
      const res = await api.get<{ success: boolean; data: StudentReport }>(url);
      return res.data.data;
    },
    enabled: !!studentId,
  });
};
