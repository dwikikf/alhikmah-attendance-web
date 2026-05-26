import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import QRScanner from "@/components/qr/QRScanner";
import ManualAttendanceForm from "@/components/attendance/ManualAttendanceForm";
import { recordQRScan } from "@/services/attendanceService";
import type { AttendanceRecord, QRScanRequest } from "@/types/attendance";
import type { QRData } from "@/utils/qrcode";
import { QrCode, Keyboard, CheckCircle2, XCircle } from "lucide-react";
import { isAxiosError } from "axios";
import AttendanceFeedbackModal, {
  type FeedbackStatus,
} from "@/components/attendance/AttendanceFeedbackModal";

export default function AttendanceScannerPage() {
  const [activeTab, setActiveTab] = useState("scan");
  const [recentScans, setRecentScans] = useState<AttendanceRecord[]>([]);

  // Modal State
  const [modalStatus, setModalStatus] = useState<FeedbackStatus>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleScanSuccess = useCallback(
    async (data: QRData, rawString: string) => {
      try {
        const payload: QRScanRequest = {
          nisn: data.nisn,
        };
        await recordQRScan(payload);

        // Always show success modal on 200 OK
        setModalStatus("success");
        setModalTitle("Berhasil Absen!");
        setModalMessage(
          `Siswa: ${data.name} dari kelas ${data.className} telah tercatat.`,
        );

        // Manually construct the recent scan entry since backend may return nil data for QR
        const newScan: AttendanceRecord = {
          id: Date.now().toString(),
          student_id: "",
          student_name: data.name,
          nisn: data.nisn,
          class_id: "",
          class_name: data.className,
          attendance_date: new Date().toISOString(),
          status: "hadir",
          notes: null,
          recorded_by: "",
          recorded_at: new Date().toISOString(),
          scanned_at: new Date().toISOString(),
          is_manual: false,
        };
        setRecentScans((prev) => [newScan, ...prev].slice(0, 50));
      } catch (error: unknown) {
        setModalStatus("error");
        setModalTitle("Gagal Absen");
        if (isAxiosError(error) && error.response?.data?.message) {
          setModalMessage(error.response.data.message);
        } else {
          const message =
            error instanceof Error ? error.message : "Gagal memproses absensi";
          setModalMessage(message);
        }
      }
    },
    [],
  );

  const handleManualSuccess = () => {
    // Keep user on the manual tab so they can see the success modal
    // and continue inputting other students manually if needed
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
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
        >
          Sesi Pagi (06:30 - 07:15)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Scanner / Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                    Arahkan QR Code siswa ke kamera. Sistem akan mencegah scan
                    ganda secara otomatis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border bg-black/5">
                    <QRScanner
                      onScanSuccess={(data) =>
                        handleScanSuccess(
                          data,
                          `${data.nisn}|${data.name}|${data.className}`,
                        )
                      }
                      cooldownMs={5000}
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
          <Card className="h-full max-h-[620px] flex flex-col">
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
                    <li
                      key={scan.id}
                      className="p-4 hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-left-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {scan.student_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-gray-500">
                              {scan.nisn}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-emerald-600">
                              Kelas {scan.class_name}
                            </span>
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

      <AttendanceFeedbackModal
        isOpen={modalStatus !== null}
        status={modalStatus}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalStatus(null)}
      />
    </div>
  );
}
