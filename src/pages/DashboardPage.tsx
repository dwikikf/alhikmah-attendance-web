import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { Users, UserCheck, UserX, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AttendanceTrendChart from "@/components/dashboard/AttendanceTrendChart";
import { useClassAttendance } from "@/queries/useAttendanceQuery";

// Temporary mock data for the dashboard until the backend is fully connected
const mockTrendData = Array.from({ length: 7 }).map((_, i) => {
  const date = subDays(new Date(), 6 - i);
  return {
    date: format(date, "dd MMM"),
    hadir: Math.floor(Math.random() * 20) + 250,
    izin: Math.floor(Math.random() * 5) + 5,
    sakit: Math.floor(Math.random() * 10) + 2,
    tanpa_keterangan: Math.floor(Math.random() * 3),
  };
});

export default function DashboardPage() {
  const { user } = useAuth();
  
  // We'll fetch today's attendance for a default class (class-1) just to show something real
  // In a real dashboard, this would be an aggregated /dashboard/stats endpoint
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: attendanceData, isLoading } = useClassAttendance({
    class_id: "class-1",
    date: today,
  });

  // Calculate mock stats if the real API fails or returns null
  const stats = {
    totalStudents: 320,
    presentPercentage: attendanceData?.summary.hadir_percentage || 95,
    absentCount: (attendanceData?.summary.sakit || 0) + (attendanceData?.summary.izin || 0) + (attendanceData?.summary.tanpa_keterangan || 0) || 12,
    lateCount: 5, // We don't have late in the new schema, but keeping it for UI variety
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}. Berikut ringkasan absensi hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Siswa"
          value={stats.totalStudents}
          icon={Users}
          description="Terdaftar aktif"
          isLoading={isLoading}
        />
        <StatsCard
          title="Kehadiran"
          value={`${stats.presentPercentage}%`}
          icon={UserCheck}
          trend={{ value: 2.1, label: "dari kemarin", positive: true }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Tidak Hadir"
          value={stats.absentCount}
          icon={UserX}
          description="Sakit, Izin, & Alpa"
          isLoading={isLoading}
        />
        <StatsCard
          title="Terlambat"
          value={stats.lateCount}
          icon={AlertCircle}
          trend={{ value: 1.5, label: "dari kemarin", positive: false }}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceTrendChart data={mockTrendData} isLoading={false} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity 
            records={attendanceData?.records.slice(0, 10)} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}
