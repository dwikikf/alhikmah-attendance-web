import { useQuery } from "@tanstack/react-query";
import { getStudentReport } from "@/services/reportService";
import { getStudent } from "@/services/studentService";

export function useAttendanceHistory(studentId: string, fromDate?: string, toDate?: string) {
  // We use current month/year if fromDate/toDate is not provided
  // Or we can just default to empty/all if API allows.
  // The API signature requires StudentReportParams { from_date: string; to_date: string; }
  
  const today = new Date();
  const defaultFromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const defaultToDate = today.toISOString().split('T')[0];

  const params = {
    from_date: fromDate || defaultFromDate,
    to_date: toDate || defaultToDate,
  };

  const { data: reportData, isLoading: isLoadingReport, error: reportError } = useQuery({
    queryKey: ["studentReport", studentId, params.from_date, params.to_date],
    queryFn: () => getStudentReport(studentId, params),
    enabled: !!studentId,
  });

  const { data: studentData, isLoading: isLoadingStudent, error: studentError } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  });

  return {
    records: reportData?.data?.records || [],
    summary: reportData?.data?.summary || { hadir: 0, izin: 0, sakit: 0, tanpa_keterangan: 0, hadir_percentage: 0 },
    student: studentData?.data,
    isLoading: isLoadingReport || isLoadingStudent,
    error: reportError || studentError,
  };
}
