import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2, Search } from "lucide-react";
import { useDailyReport } from "@/queries/useReportQuery";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatus";
import ReportExporter from "./ReportExporter";
import AttendanceChart from "./AttendanceChart";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types";

export default function DailyReportView() {
  const [date, setDate] = useState<Date>(new Date());
  const [classId, setClassId] = useState<string>("class-1"); // Defaulting to class-1 for now

  // Fetch report data
  const { data: report, isLoading, error } = useDailyReport({
    class_id: classId,
    date: format(date, "yyyy-MM-dd"),
  });

  const columns = [
    { key: "nisn", header: "NISN" },
    { key: "student_name", header: "Nama Siswa", sortable: true },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => <AttendanceStatusBadge status={row.status as AttendanceStatus} />
    },
    { 
      key: "scanned_at", 
      header: "Waktu Absen",
      cell: (row: any) => row.scanned_at ? format(new Date(row.scanned_at), "HH:mm") : "-"
    },
    {
      key: "is_manual",
      header: "Metode",
      cell: (row: any) => (
        <span className="text-xs text-muted-foreground">
          {row.is_manual ? "Manual" : "QR Scan"}
        </span>
      )
    }
  ];

  const summaryChartData = report ? [{
    date: format(date, "dd MMM", { locale: id }),
    hadir: report.summary.hadir,
    izin: report.summary.izin,
    sakit: report.summary.sakit,
    tanpa_keterangan: report.summary.tanpa_keterangan,
  }] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={classId} onValueChange={(val) => setClassId(val || "class-1")}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class-1">Kelas 10A</SelectItem>
              <SelectItem value="class-2">Kelas 10B</SelectItem>
              <SelectItem value="class-3">Kelas 11A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal bg-background",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "EEEE, dd MMMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
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
            reportType="harian"
            classId={classId}
            filename={`Laporan_Harian_${classId}_${format(date, "yyyyMMdd")}`}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground text-sm">Memuat laporan harian...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center border border-red-200 bg-red-50 text-red-600 rounded-lg">
          Terjadi kesalahan saat memuat data.
        </div>
      ) : report ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan</CardTitle>
                <CardDescription>Persentase: <span className="font-semibold text-foreground">{report.summary.hadir_percentage}%</span></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-emerald-50 text-emerald-700 rounded-lg p-3">
                    <p className="text-2xl font-bold">{report.summary.hadir}</p>
                    <p className="text-xs">Hadir</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 rounded-lg p-3">
                    <p className="text-2xl font-bold">{report.summary.izin}</p>
                    <p className="text-xs">Izin</p>
                  </div>
                  <div className="bg-amber-50 text-amber-700 rounded-lg p-3">
                    <p className="text-2xl font-bold">{report.summary.sakit}</p>
                    <p className="text-xs">Sakit</p>
                  </div>
                  <div className="bg-red-50 text-red-700 rounded-lg p-3">
                    <p className="text-2xl font-bold">{report.summary.tanpa_keterangan}</p>
                    <p className="text-xs">Alpa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visualisasi</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceChart data={summaryChartData} type="bar" height={200} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Data Absensi Siswa</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columns} 
                  data={report.records} 
                  searchKey="student_name" 
                  searchPlaceholder="Cari nama siswa..." 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 border border-dashed rounded-lg bg-muted/10 text-muted-foreground">
          Tidak ada data laporan untuk tanggal ini
        </div>
      )}
    </div>
  );
}
