import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  useTotalClasses,
  useTodayAttendanceSummary,
} from "@/queries/useDashboardQuery";
import { getCurrentAcademicYear } from "@/utils/date";

export default function DashboardPage() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  // ─── Fetch real data from backend ────────────────────────────────────────────

  const academicYear = getCurrentAcademicYear();

  // 1. Total classes and class list filtered by academic year
  const { data: classesInfo, isLoading: isLoadingClasses } = useTotalClasses(academicYear);
  const totalClasses = classesInfo?.total ?? 0;
  const classIds = useMemo(
    () => (classesInfo?.classes || []).map((c) => c.id),
    [classesInfo],
  );

  // 2. Total active students calculated from filtered classes
  const totalStudents = useMemo(() => {
    return classesInfo?.classes.reduce((sum, c) => sum + (c.student_count || 0), 0) || 0;
  }, [classesInfo]);

  // 3. Today's attendance aggregated across all filtered classes
  const { data: attendanceTotals, isLoading: isLoadingAttendance } =
    useTodayAttendanceSummary(classIds, today);

  // ─── Calculate stats from real data ──────────────────────────────────────────

  const hadir = attendanceTotals?.hadir ?? 0;
  const izin = attendanceTotals?.izin ?? 0;
  const sakit = attendanceTotals?.sakit ?? 0;
  const tanpaKeterangan = attendanceTotals?.tanpa_keterangan ?? 0;
  const totalRecorded = hadir + izin + sakit + tanpaKeterangan;
  const absentCount = izin + sakit + tanpaKeterangan;

  const hadirPercentage =
    totalRecorded > 0 ? Math.round((hadir / totalRecorded) * 100) : 0;

  const isLoading = isLoadingClasses || isLoadingAttendance;


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {user?.name}. Berikut ringkasan absensi hari
            ini.
          </p>
        </div>
        <button 
          onClick={() => { throw new Error("Test Sentry Error from Web Dashboard!"); }}
          className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Test Sentry Error
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Siswa Aktif"
          value={totalStudents}
          icon={Users}
          description={`Tahun Ajaran ${academicYear}`}
          isLoading={isLoadingClasses}
        />
        <StatsCard
          title="Total Kelas"
          value={totalClasses}
          icon={GraduationCap}
          description={`Tahun Ajaran ${academicYear}`}
          isLoading={isLoadingClasses}
        />
        <StatsCard
          title="Kehadiran Hari Ini"
          value={totalRecorded > 0 ? `${hadirPercentage}%` : "–"}
          icon={UserCheck}
          description={
            totalRecorded > 0
              ? `${hadir} dari ${totalRecorded} siswa hadir`
              : "Belum ada data absensi"
          }
          isLoading={isLoadingAttendance}
        />
        <StatsCard
          title="Tidak Hadir"
          value={absentCount}
          icon={UserX}
          description={
            absentCount > 0
              ? `Sakit: ${sakit} · Izin: ${izin} · Alpa: ${tanpaKeterangan}`
              : "Semua siswa hadir"
          }
          isLoading={isLoadingAttendance}
        />
      </div>

    </div>
  );
}
