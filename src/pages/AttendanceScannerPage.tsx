import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import QRScanner from "@/components/qr/QRScanner";
import ManualAttendanceForm from "@/components/attendance/ManualAttendanceForm";
import { recordQRScan } from "@/services/attendanceService";
import type { AttendanceRecord, QRScanRequest } from "@/types/attendance";
import type { QRData } from "@/utils/qrcode";
import { QrCode, Keyboard, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AttendanceScannerPage() {
  const [activeTab, setActiveTab] = useState("scan");
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>([]);

  const handleScanSuccess = useCallback(async (data: QRData, rawString: string) => {
    try {
      const payload: QRScanRequest = {
        qr_code_data: rawString,
        class_id: "", // Will be set from context/selection
        scanned_at: new Date().toISOString(),
      };
      const response = await recordQRScan(payload);
      
      // Add to recent scans list
      if (response.data) {
        setRecentScans(prev => [response.data, ...prev].slice(0, 50));
        toast.success(`Berhasil absen: ${data.name}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memproses absensi";
      toast.error(message);
    }
  }, []);

  const handleManualSuccess = () => {
    // Optionally switch back to scan tab or refresh recent list
    setActiveTab("scan");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pindai Kehadiran</h1>
          <p className="text-gray-500">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          Sesi Pagi (06:30 - 07:15)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Scanner / Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Scan QR
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scan" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scanner QR Code</CardTitle>
                  <CardDescription>
                    Arahkan QR Code siswa ke kamera. Sistem akan mencegah scan ganda secara otomatis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border bg-black/5">
                    <QRScanner 
                      onScanSuccess={(data) => handleScanSuccess(data, `${data.nisn}|${data.name}|${data.className}`)} 
                      cooldownMs={3000} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manual" className="mt-4">
              <ManualAttendanceForm
                classId=""
                date={format(new Date(), "yyyy-MM-dd")}
                onSuccess={handleManualSuccess} 
                onCancel={() => setActiveTab("scan")} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Recent Scans */}
        <div className="space-y-6">
          <Card className="h-full max-h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex justify-between items-center">
                Scan Terakhir
                <Badge variant="secondary">{recentScans.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {recentScans.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <QrCode className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm">Belum ada data scan</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentScans.map((scan) => (
                    <li key={scan.id} className="p-4 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-left-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{scan.student_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-gray-500">{scan.nisn}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-emerald-600">Kelas {scan.class_name}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-medium text-gray-500">
                            {format(new Date(scan.recorded_at), "HH:mm")}
                          </span>
                          {scan.status === "hadir" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 mt-1" />
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
