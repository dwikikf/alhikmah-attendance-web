import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSemesterReport } from "@/queries/useReportQuery";
import { useClasses } from "@/queries/useClassQuery";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import ReportExporter from "./ReportExporter";
import AttendanceChart from "./AttendanceChart";
import { cn } from "@/lib/utils";

export default function SemesterReportView() {
  const [classId, setClassId] = useState<string>("");
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [academicYear, setAcademicYear] = useState<string>("2025/2026");

  const { user } = useAuth();
  const { data: classesData } = useClasses();
  
  const availableClasses = classesData?.data?.filter(c => {
    if (user?.role === "admin") return true;
    return c.teacher_id === user?.id;
  }) || [];

  // Fetch report data
  const {
    data: report,
    isLoading,
    error,
  } = useSemesterReport({
    class_id: classId,
    semester,
    academic_year: academicYear,
  });

  const columns = [
    { key: "nisn", header: "NISN" },
    { key: "student_name", header: "Nama Siswa", sortable: true },
    { key: "hadir", header: "Hadir", sortable: true },
    { key: "izin", header: "Izin", sortable: true },
    { key: "sakit", header: "Sakit", sortable: true },
    { key: "tanpa_keterangan", header: "Alpa", sortable: true },
    {
      key: "attendance_percentage",
      header: "Persentase",
      sortable: true,
      cell: (row: any) => (
        <span
          className={cn(
            "font-medium",
            row.attendance_percentage >= 80
              ? "text-emerald-600"
              : row.attendance_percentage >= 60
                ? "text-amber-600"
                : "text-red-600",
          )}
        >
          {row.attendance_percentage}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <Select
          value={academicYear}
          onValueChange={(val) => setAcademicYear(val || "2024/2025")}
        >
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Tahun Ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023/2024">2023/2024</SelectItem>
            <SelectItem value="2024/2025">2024/2025</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={semester}
          onValueChange={(v) => setSemester(v as "1" | "2")}
        >
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Semester 1 (Ganjil)</SelectItem>
            <SelectItem value="2">Semester 2 (Genap)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={classId}
          onValueChange={(val) => setClassId(val || "")}
        >
          <SelectTrigger className="w-[150px] bg-background">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="sm:ml-auto">
          <ReportExporter
            reportType="semesteran"
            classId={classId}
            semester={semester}
            academicYear={academicYear}
            filename={`Laporan_Semester_${semester}_${classId}_${academicYear.replace("/", "-")}`}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground text-sm">
            Memuat laporan semester...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-red-200 bg-red-50 text-red-600 rounded-lg">
          Terjadi kesalahan saat memuat data.
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ringkasan Semester</CardTitle>
                  <CardDescription>{report.period}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">
                      Rata-rata Kehadiran
                    </span>
                    <span className="font-bold text-emerald-600 text-lg">
                      {report.summary.avg_attendance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">
                      Total Hari Aktif
                    </span>
                    <span className="font-medium">
                      {report.duration_days} Hari
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Izin</span>
                    <span className="font-medium text-blue-600">
                      {report.summary.total_izin}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Total Sakit</span>
                    <span className="font-medium text-amber-600">
                      {report.summary.total_sakit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Alpa</span>
                    <span className="font-medium text-red-600">
                      {report.summary.total_tanpa_keterangan}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Tren Kehadiran (Per Bulan)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceChart
                    data={report.trend}
                    type="line"
                    xAxisKey="month"
                    height={250}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rekapitulasi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={report.student_stats || []}
                searchKey="student_name"
                searchPlaceholder="Cari nama siswa..."
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
          Tidak ada data laporan untuk semester ini
        </div>
      )}
    </div>
  );
}
