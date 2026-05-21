import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Search, Users } from "lucide-react";
import api from "@/utils/api";
import type {
  AttendanceStatus,
  ManualAttendanceRequest,
  ManualAttendanceEntry,
} from "@/types/attendance";
import { ATTENDANCE_STATUS_LABELS } from "@/types/attendance";

interface ManualAttendanceFormProps {
  classId: string;
  date: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface StudentItem {
  id: string;
  nisn: string;
  full_name: string;
}

// Mock student list — will be replaced with API data
const MOCK_STUDENTS: StudentItem[] = [
  { id: "s1", nisn: "0012345601", full_name: "Ahmad Fauzi" },
  { id: "s2", nisn: "0012345602", full_name: "Siti Aisyah" },
  { id: "s3", nisn: "0012345603", full_name: "Muhammad Rizki" },
  { id: "s4", nisn: "0012345604", full_name: "Fatimah Zahra" },
  { id: "s5", nisn: "0012345605", full_name: "Abdullah Rahman" },
];

interface SelectedStudentData {
  status: AttendanceStatus;
  notes: string;
}

export default function ManualAttendanceForm({
  classId,
  date,
  onSuccess,
  onCancel,
}: ManualAttendanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<
    Map<string, SelectedStudentData>
  >(new Map());

  // Default status for newly selected students
  const [defaultStatus, setDefaultStatus] =
    useState<AttendanceStatus>("hadir");

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return MOCK_STUDENTS;
    const q = searchQuery.toLowerCase();
    return MOCK_STUDENTS.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudents.has(s.id));

  const toggleStudent = (student: StudentItem) => {
    setSelectedStudents((prev) => {
      const next = new Map(prev);
      if (next.has(student.id)) {
        next.delete(student.id);
      } else {
        next.set(student.id, { status: defaultStatus, notes: "" });
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedStudents((prev) => {
      const next = new Map(prev);
      if (isAllSelected) {
        // Deselect all filtered
        filteredStudents.forEach((s) => next.delete(s.id));
      } else {
        // Select all filtered
        filteredStudents.forEach((s) => {
          if (!next.has(s.id)) {
            next.set(s.id, { status: defaultStatus, notes: "" });
          }
        });
      }
      return next;
    });
  };

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setSelectedStudents((prev) => {
      const next = new Map(prev);
      const existing = next.get(studentId);
      if (existing) {
        next.set(studentId, { ...existing, status });
      }
      return next;
    });
  };

  const updateStudentNotes = (studentId: string, notes: string) => {
    setSelectedStudents((prev) => {
      const next = new Map(prev);
      const existing = next.get(studentId);
      if (existing) {
        next.set(studentId, { ...existing, notes });
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudents.size === 0) {
      toast.error("Pilih minimal satu siswa");
      return;
    }

    setIsLoading(true);
    try {
      const students: ManualAttendanceEntry[] = [];
      selectedStudents.forEach((data, studentId) => {
        students.push({
          student_id: studentId,
          status: data.status,
          notes: data.notes || undefined,
        });
      });

      const payload: ManualAttendanceRequest = {
        class_id: classId,
        attendance_date: date,
        students,
      };

      await api.post("/attendances/manual", payload);

      toast.success(
        `Kehadiran ${students.length} siswa berhasil dicatat secara manual`
      );
      setSelectedStudents(new Map());
      onSuccess?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mencatat kehadiran manual.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Absensi Manual
        </CardTitle>
        <CardDescription>
          Pilih siswa yang belum ter-scan dan tentukan status kehadiran mereka.
          <br />
          <span className="text-xs">
            Tanggal: <strong>{date}</strong>
          </span>
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Default status for batch selection */}
          <div className="space-y-2">
            <Label>Status default untuk siswa baru dipilih</Label>
            <Select
              value={defaultStatus}
              onValueChange={(val) =>
                setDefaultStatus(val as AttendanceStatus)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(ATTENDANCE_STATUS_LABELS) as [
                    AttendanceStatus,
                    string
                  ][]
                ).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari siswa berdasarkan nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              disabled={isLoading}
            />
          </div>

          {/* Select all */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleAll}
                disabled={isLoading}
              />
              <Label className="text-sm font-medium cursor-pointer">
                Pilih semua ({filteredStudents.length} siswa)
              </Label>
            </div>
            {selectedStudents.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedStudents.size} dipilih
              </span>
            )}
          </div>

          {/* Student list */}
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada siswa ditemukan
              </p>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudents.has(student.id);
                const studentData = selectedStudents.get(student.id);

                return (
                  <div
                    key={student.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary/30 bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleStudent(student)}
                        disabled={isLoading}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          NISN: {student.nisn}
                        </p>
                      </div>

                      {/* Per-student status (only when selected) */}
                      {isSelected && studentData && (
                        <Select
                          value={studentData.status}
                          onValueChange={(val) =>
                            updateStudentStatus(
                              student.id,
                              val as AttendanceStatus
                            )
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.entries(ATTENDANCE_STATUS_LABELS) as [
                                AttendanceStatus,
                                string
                              ][]
                            ).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Per-student notes (only when selected) */}
                    {isSelected && studentData && (
                      <div className="mt-2 pl-7">
                        <Textarea
                          placeholder="Keterangan (opsional)..."
                          value={studentData.notes}
                          onChange={(e) =>
                            updateStudentNotes(student.id, e.target.value)
                          }
                          disabled={isLoading}
                          className="min-h-[60px] text-xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading || selectedStudents.size === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Absensi ({selectedStudents.size})
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
