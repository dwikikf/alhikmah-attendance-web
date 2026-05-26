import { useState, useMemo, useEffect } from "react";
import { useAttendanceHistory } from "@/hooks/useAttendanceHistory";
import { QRCodeCanvas } from "qrcode.react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Filter,
  QrCode,
  PenLine,
} from "lucide-react";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatus";
import type {
  AttendanceStatus,
  AttendanceRecord,
  AttendanceSummary,
} from "@/types/attendance";
import { ATTENDANCE_STATUS_LABELS } from "@/types/attendance";
import { format, subDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface AttendanceHistoryProps {
  studentId: string;
  className?: string;
}

export default function AttendanceHistory({
  studentId,
  className,
}: AttendanceHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: subDays(new Date(), 7),
    to: new Date(),
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fromDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const toDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  const { records, student, isLoading } = useAttendanceHistory(
    studentId,
    fromDate,
    toDate,
  );

  // Filter records
  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (dateRange?.from) {
      const from = dateRange.from;
      filtered = filtered.filter((r) => new Date(r.attendance_date) >= from);
    }

    if (dateRange?.to) {
      const to = dateRange.to;
      filtered = filtered.filter((r) => new Date(r.attendance_date) <= to);
    }

    return filtered;
  }, [records, statusFilter, dateRange]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateRange]);

  // Calculate summary from all records (not filtered)
  const summary: AttendanceSummary = useMemo(() => {
    const s: AttendanceSummary = {
      hadir: 0,
      izin: 0,
      sakit: 0,
      tanpa_keterangan: 0,
    };
    records.forEach((r) => {
      if (r.status !== "belum_absen") {
        s[r.status]++;
      }
    });
    const total = records.filter((r) => r.status !== "belum_absen").length;
    s.hadir_percentage = total > 0 ? Math.round((s.hadir / total) * 100) : 0;
    return s;
  }, [records]);

  const totalRecords = records.length;

  const summaryCards: {
    label: string;
    value: number | string;
    color: string;
  }[] = [
    {
      label: "Hadir",
      value: summary.hadir,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Izin",
      value: summary.izin,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Sakit",
      value: summary.sakit,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Alpha",
      value: summary.tanpa_keterangan,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Persentase",
      value: `${summary.hadir_percentage ?? 0}%`,
      color: "text-foreground",
    },
  ];

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (isoStr: string | null) => {
    if (!isoStr) return "-";
    try {
      return format(new Date(isoStr), "HH:mm");
    } catch {
      return "-";
    }
  };

  const dateRangeLabel = useMemo(() => {
    if (!dateRange?.from) return "Pilih tanggal";
    if (!dateRange.to)
      return format(dateRange.from, "dd MMM yyyy", { locale: localeId });
    return `${format(dateRange.from, "dd MMM", { locale: localeId })} - ${format(dateRange.to, "dd MMM yyyy", { locale: localeId })}`;
  }, [dateRange]);

  // Loading state
  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Riwayat Kehadiran</CardTitle>
          <CardDescription>Memuat data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
          {/* Table skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <CardTitle>Riwayat Kehadiran</CardTitle>
          <CardDescription>
            {totalRecords > 0
              ? `Total ${totalRecords} catatan kehadiran`
              : "Belum ada catatan kehadiran"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border bg-muted/30 p-3 text-center"
            >
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className={cn("text-xl font-bold", card.color)}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>

          {/* Date range filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-1.5 text-left font-normal"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="truncate">{dateRangeLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
              {dateRange?.from && (
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setDateRange(undefined)}
                  >
                    Hapus filter tanggal
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val || "all")}
          >
            <SelectTrigger className="h-8 w-40">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {(
                Object.entries(ATTENDANCE_STATUS_LABELS) as [
                  AttendanceStatus,
                  string,
                ][]
              ).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Waktu</TableHead>
                <TableHead className="hidden sm:table-cell">Metode</TableHead>
                <TableHead className="hidden md:table-cell">
                  Keterangan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data kehadiran
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {formatDate(record.attendance_date)}
                    </TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={record.status} size="sm" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatTime(record.scanned_at ?? record.recorded_at)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="gap-1">
                        {record.is_manual ? (
                          <>
                            <PenLine className="h-3 w-3" />
                            Manual
                          </>
                        ) : (
                          <>
                            <QrCode className="h-3 w-3" />
                            QR
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-50 truncate md:table-cell">
                      {record.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredRecords.length)}{" "}
              dari {filteredRecords.length} catatan
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

export { AttendanceHistory };
