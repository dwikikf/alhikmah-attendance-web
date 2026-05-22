import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useClass, useClassStudents } from "@/queries/useClassQuery";
import { useClassAttendance } from "@/queries/useAttendanceQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Loader2, BookOpen, User, Download, FileSpreadsheet } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatus";
import type { Class, ClassDetail as ClassDetailType } from "@/types";

interface ClassDetailProps {
  classId: string;
  onBack: () => void;
  onEdit: (classData: Class) => void;
}

export default function ClassDetail({ classId, onBack, onEdit }: ClassDetailProps) {
  const { data: classData, isLoading: isLoadingClass, error: classError } = useClass(classId);
  const { data: students, isLoading: isLoadingStudents, error: studentsError } = useClassStudents(classId);
  const { data: attendanceData, isLoading: isLoadingAttendance } = useClassAttendance({
    class_id: classId,
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const isLoading = isLoadingClass || isLoadingStudents || isLoadingAttendance;
  const error = classError || studentsError;

  const studentsWithAttendance = students?.map((student: any) => {
    // Determine if attendanceData is an array. If backend returns single object or something else, handle it.
    // Usually it returns an array of attendances.
    const attendances = Array.isArray(attendanceData) ? attendanceData : [];
    const record = attendances.find((a: any) => a.student_id === student.id);
    return {
      ...student,
      attendance_today: record ? record.status : null,
      scanned_at: record ? record.scanned_at : null,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground text-sm">Memuat data kelas...</p>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
          Terjadi kesalahan saat memuat data atau kelas tidak ditemukan.
        </div>
        <Button variant="outline" onClick={onBack}>Kembali</Button>
      </div>
    );
  }

  const studentColumns = [
    { key: "nisn", header: "NISN", sortable: true },
    { key: "full_name", header: "Nama Siswa", sortable: true },
    { 
      key: "attendance_today", 
      header: "Status Hari Ini",
      cell: (row: any) => row.attendance_today ? (
        <AttendanceStatusBadge status={row.attendance_today} />
      ) : (
        <span className="text-muted-foreground text-xs italic">Belum absen</span>
      )
    },
    { 
      key: "scanned_at", 
      header: "Waktu Absen",
      cell: (row: any) => row.scanned_at ? format(new Date(row.scanned_at), "HH:mm") : "-"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{classData.class_name}</h2>
            <p className="text-muted-foreground">Tahun Ajaran {classData.academic_year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(classData as Class)}>Edit Kelas</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Wali Kelas</p>
                <p className="text-sm text-muted-foreground">{classData.teacher_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Tahun Ajaran</p>
                <p className="text-sm text-muted-foreground">{classData.academic_year}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Kapasitas</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{classData.student_count}</span> dari {classData.capacity} siswa
                </p>
              </div>
            </div>
            
            {classData.description && (
              <div className="pt-4 border-t mt-4">
                <p className="text-sm font-medium mb-1">Deskripsi</p>
                <p className="text-sm text-muted-foreground">{classData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-lg">Daftar Siswa</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                <Download className="h-3 w-3" /> QR Codes (PDF)
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                <FileSpreadsheet className="h-3 w-3" /> Export Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable 
              columns={studentColumns} 
              data={studentsWithAttendance} 
              searchKey="full_name"
              searchPlaceholder="Cari siswa..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
