import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Search, Users, CheckCircle2, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import type { AttendanceStatus, ManualAttendanceRequest } from "@/types/attendance";
import AttendanceFeedbackModal, { type FeedbackStatus } from "@/components/attendance/AttendanceFeedbackModal";
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS } from "@/types/attendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/api";

import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/services/studentService";
import type { Student } from "@/types/student";

interface ManualAttendanceFormProps {
  classId: string;
  date: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// No more MOCK_STUDENTS

export default function ManualAttendanceForm({
  classId,
  date,
  onSuccess,
}: ManualAttendanceFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  
  // States for form per student
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  
  // Track successful submissions locally to show UI feedback
  const [submittedMap, setSubmittedMap] = useState<Record<string, AttendanceStatus>>({});
  
  // Modal state
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", "search", searchQuery],
    queryFn: () => getStudents({ search: searchQuery, limit: 10 }),
    enabled: searchQuery.trim().length >= 2,
  });

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return []; 
    return studentsData?.data || [];
  }, [searchQuery, studentsData]);

  const handleSubmit = async (studentId: string) => {
    const status = statusMap[studentId] || "hadir";
    
    setLoadingMap(prev => ({ ...prev, [studentId]: true }));
    try {
      const payload: ManualAttendanceRequest = {
        student_id: studentId,
        status: status,
        notes: notesMap[studentId] || undefined,
      };

      await api.post("/attendances/manual", payload);

      setSubmittedMap(prev => ({ ...prev, [studentId]: status }));
      setModalStatus("success");
      setModalTitle("Berhasil Absen!");
      setModalMessage(`Absen manual berhasil dicatat dengan status: ${ATTENDANCE_STATUS_LABELS[status]}`);
      onSuccess?.();
    } catch (error: unknown) {
      setModalStatus("error");
      setModalTitle("Gagal Absen");
      if (isAxiosError(error) && error.response?.data?.message) {
        setModalMessage(error.response.data.message);
      } else {
        const message = error instanceof Error ? error.message : "Gagal memproses absensi manual";
        setModalMessage(message);
      }
    } finally {
      setLoadingMap(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleStatusChange = (studentId: string, val: AttendanceStatus) => {
    setStatusMap(prev => ({ ...prev, [studentId]: val }));
  };

  const handleNoteChange = (studentId: string, val: string) => {
    setNotesMap(prev => ({ ...prev, [studentId]: val }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Absensi Manual
        </CardTitle>
        <CardDescription>
          Cari siswa dan tentukan status kehadirannya.
          <br />
          <span className="text-xs">
            Tanggal: <strong>{date}</strong>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Ketik NISN atau nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Separator />

        {/* Student list */}
        <div className="max-h-[500px] space-y-3 overflow-y-auto pr-2">
          {!searchQuery.trim() ? (
             <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
               <Search className="h-8 w-8 text-gray-300" />
               <p>Ketik setidaknya 2 karakter untuk mencari siswa...</p>
             </div>
          ) : isLoadingStudents ? (
             <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
               <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
               <p>Mencari siswa...</p>
             </div>
          ) : filteredStudents.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada siswa ditemukan dengan kata kunci "{searchQuery}"
            </p>
          ) : (
            filteredStudents.map((student) => {
              const isLoading = loadingMap[student.id];
              const submittedStatus = submittedMap[student.id];
              const currentStatus = statusMap[student.id] || "hadir";

              return (
                <div
                  key={student.id}
                  className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
                    submittedStatus ? "bg-emerald-50/30 border-emerald-100" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {student.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        NISN: {student.nisn}
                      </p>
                    </div>
                    
                    {submittedStatus && (
                       <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${ATTENDANCE_STATUS_COLORS[submittedStatus].bg} ${ATTENDANCE_STATUS_COLORS[submittedStatus].text} ${ATTENDANCE_STATUS_COLORS[submittedStatus].border}`}>
                         <CheckCircle2 className="w-3 h-3" />
                         Sudah Diabsen
                       </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                     <Select
                        value={currentStatus}
                        onValueChange={(val) => handleStatusChange(student.id, val as AttendanceStatus)}
                        disabled={isLoading || !!submittedStatus}
                      >
                        <SelectTrigger className="w-full sm:w-[140px] h-9">
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

                      <Input 
                        placeholder="Alasan (opsional)..."
                        className="h-9 flex-1 text-sm"
                        value={notesMap[student.id] || ""}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        disabled={isLoading || !!submittedStatus}
                      />
                      
                      <Button
                        size="sm"
                        className="h-9 bg-primary hover:bg-primary/90"
                        onClick={() => handleSubmit(student.id)}
                        disabled={isLoading || !!submittedStatus}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Submit"}
                      </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      <AttendanceFeedbackModal 
        isOpen={modalStatus !== null}
        status={modalStatus}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalStatus(null)}
      />
    </Card>
  );
}
