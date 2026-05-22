import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AttendanceTrendChart from "@/components/dashboard/AttendanceTrendChart";
import {
  useTotalStudents,
  useTotalClasses,
  useTodayAttendanceSummary,
} from "@/queries/useDashboardQuery";

export default function DashboardPage() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  // ─── Fetch real data from backend ────────────────────────────────────────────

  // 1. Total active students
  const { data: totalStudents = 0, isLoading: isLoadingStudents } =
    useTotalStudents();

  // 2. Total classes and class list
  const { data: classesInfo, isLoading: isLoadingClasses } = useTotalClasses();
  const totalClasses = classesInfo?.total ?? 0;
  const classIds = useMemo(
    () => (classesInfo?.classes || []).map((c) => c.id),
    [classesInfo],
  );

  // 3. Today's attendance aggregated across all classes
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

  const isLoading = isLoadingStudents || isLoadingClasses || isLoadingAttendance;

  // ─── Mock trend data (will be replaced when backend provides trend endpoint) ─
  const mockTrendData = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          date: format(date, "dd MMM"),
          hadir: Math.floor(Math.random() * 20) + 250,
          izin: Math.floor(Math.random() * 5) + 5,
          sakit: Math.floor(Math.random() * 10) + 2,
          tanpa_keterangan: Math.floor(Math.random() * 3),
        };
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}. Berikut ringkasan absensi hari
          ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Siswa Aktif"
          value={totalStudents}
          icon={Users}
          description="Terdaftar aktif"
          isLoading={isLoadingStudents}
        />
        <StatsCard
          title="Total Kelas"
          value={totalClasses}
          icon={GraduationCap}
          description="Kelas terdaftar"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart data={mockTrendData} isLoading={false} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity records={[]} isLoading={isLoadingAttendance} />
        </div>
      </div>
    </div>
  );
}
