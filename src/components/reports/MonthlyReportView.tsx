import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useMonthlyReport } from "@/queries/useReportQuery";
import { useClasses } from "@/queries/useClassQuery";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";

export default function MonthlyReportView() {
  const [date, setDate] = useState<Date>(new Date()); // Using date just for selecting month/year
  const [classId, setClassId] = useState<string>("");

  const { user } = useAuth();
  const { data: classesData } = useClasses();
  
  const availableClasses = classesData?.data?.filter(c => {
    if (user?.role === "admin") return true;
    return c.teacher_id === user?.id;
  }) || [];

  const selectedClass = availableClasses.find(c => c.id === classId);
  const className = selectedClass ? selectedClass.class_name : classId;

  const monthParam = format(date, "yyyy-MM");

  // Fetch report data
  const {
    data: report,
    isLoading,
    error,
  } = useMonthlyReport({
    class_id: classId,
    month: monthParam,
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
          {Number(row.attendance_percentage).toFixed(2)}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={classId}
            onValueChange={(val) => setClassId(val || "")}
          >
            <SelectTrigger className="w-45 bg-background">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Note: React Day Picker v8 doesn't have a strict month-only picker built-in that's simple to use,
              so we just use the normal calendar and take the selected month/year. */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-60 justify-start text-left font-normal bg-background",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "MMMM yyyy", { locale: id })
                ) : (
                  <span>Pilih bulan</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="sm:ml-auto">
          <ReportExporter
            reportType="bulanan"
            classId={classId}
            month={monthParam}
            filename={`Laporan Kehadiran Bulanan Kelas ${className}`}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground text-sm">
            Memuat laporan bulanan...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-red-200 bg-red-50 text-red-600 rounded-lg">
          Terjadi kesalahan saat memuat data.
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Rata-rata Kehadiran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {Number(report.summary.avg_hadir_percentage).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Total Izin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {report.summary.total_izin}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Total Sakit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {report.summary.total_sakit}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  Total Alpa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {report.summary.total_tanpa_keterangan}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Siswa ({report.period})</CardTitle>
              <CardDescription>
                Total {report.total_days} hari aktif
              </CardDescription>
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
          Tidak ada data laporan untuk bulan ini
        </div>
      )}
    </div>
  );
}
