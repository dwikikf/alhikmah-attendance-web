import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useStudent } from "@/queries/useStudentQuery";
import { getStudentQRCode } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, QrCode as QrCodeIcon, Loader2, Calendar as CalendarIcon, Download, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import type { Student } from "@/types";

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
  onEdit: (student: Student) => void;
}

export default function StudentDetail({ studentId, onBack, onEdit }: StudentDetailProps) {
  const { data: student, isLoading, error } = useStudent(studentId);
  const [activeTab, setActiveTab] = useState("info");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    if (!student) return;
    try {
      setIsDownloading(true);
      const blob = await getStudentQRCode(studentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode_${student.nisn}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download QR code", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground text-sm">Memuat data siswa...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
          Terjadi kesalahan saat memuat data atau siswa tidak ditemukan.
        </div>
        <Button variant="outline" onClick={onBack}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{student.full_name}</h2>
            <p className="text-muted-foreground">NISN: {student.nisn}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(student)}>Edit Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-muted rounded-full w-24 h-24 flex items-center justify-center mb-2 overflow-hidden border">
                {student.photo_url ? (
                  <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <CardTitle>{student.full_name}</CardTitle>
              <CardDescription>
                <Badge variant={student.is_active ? "default" : "secondary"} className={student.is_active ? "bg-emerald-500" : "mt-2"}>
                  {student.is_active ? "Siswa Aktif" : "Non-aktif"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 border-t text-sm">
              <div className="grid grid-cols-2 gap-y-3">
                <div className="text-muted-foreground">Kelas</div>
                <div className="font-medium text-right">{student.class_name}</div>
                
                <div className="text-muted-foreground">Jenis Kelamin</div>
                <div className="font-medium text-right capitalize">{student.gender || "-"}</div>
                
                <div className="text-muted-foreground">Tanggal Lahir</div>
                <div className="font-medium text-right">
                  {student.date_of_birth ? format(new Date(student.date_of_birth), "dd MMM yyyy", { locale: idLocale }) : "-"}
                </div>
                
                <div className="text-muted-foreground">Terdaftar</div>
                <div className="font-medium text-right">
                  {student.created_at ? format(new Date(student.created_at), "dd MMM yyyy") : "-"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="info" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <QrCodeIcon className="h-4 w-4 mr-2" />
                QR Code Siswa
              </TabsTrigger>
              <TabsTrigger 
                value="attendance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent px-4 py-3"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Riwayat Absensi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kartu QR Code Absensi</CardTitle>
                  <CardDescription>
                    Scan kode QR ini menggunakan perangkat scanner di sekolah
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border rounded-lg max-w-sm mx-auto">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border">
                      <QRCodeSVG 
                        value={student.qr_code_data} 
                        size={200}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center space-y-1 w-full">
                      <p className="font-bold text-lg">{student.full_name}</p>
                      <p className="text-muted-foreground font-mono text-sm">{student.nisn}</p>
                      <div className="pt-2 border-t mt-3 text-sm font-medium text-emerald-700">
                        Kelas {student.class_name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-3 mt-6">
                    <Button variant="outline" className="gap-2" onClick={handleDownloadQR} disabled={isDownloading}>
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
                      Download
                    </Button>
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <Printer className="h-4 w-4" /> Cetak Kartu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="pt-6 m-0">
              <AttendanceHistory studentId={student.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
