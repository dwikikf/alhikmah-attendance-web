import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats, type CameraDevice } from "html5-qrcode";
import { parseQRData, type QRData } from "@/utils/qrcode";
import { playSuccessBeep, playErrorBuzzer } from "@/utils/audio";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerProps {
  onScanSuccess: (data: QRData) => void;
  cooldownMs?: number;
}

export default function QRScanner({
  onScanSuccess,
  cooldownMs = 3000,
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader";
  const lastScanTimeRef = useRef<number>(0);
  const lastScannedDataRef = useRef<string>("");

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      const now = Date.now();
      const timeSinceLastScan = now - lastScanTimeRef.current;
      const isSameData = decodedText === lastScannedDataRef.current;

      // Cooldown check: prevent duplicate scans within cooldown period
      if (isSameData && timeSinceLastScan < cooldownMs) {
        return;
      }

      const parsedData = parseQRData(decodedText);
      if (parsedData) {
        playSuccessBeep();
        lastScanTimeRef.current = now;
        lastScannedDataRef.current = decodedText;
        onScanSuccess(parsedData);
      } else {
        // Debounce error to not spam
        if (timeSinceLastScan > 2000) {
          playErrorBuzzer();
          toast.error("Format QR Code tidak valid atau tidak dikenali.");
          lastScanTimeRef.current = now;
        }
      }
    },
    [onScanSuccess, cooldownMs],
  );

  const handleScanError = (errorMessage: string) => {
    // html5-qrcode triggers error frequently when no code is visible
    // We ignore these to prevent spamming console
  };

  const startScanner = useCallback(async (cameraId?: string) => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }

    try {
      const scanner = new Html5Qrcode(regionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      if (cameraId) {
        await scanner.start(cameraId, config, handleScanSuccess, handleScanError);
      } else {
        await scanner.start(
          { facingMode: "environment" },
          config,
          handleScanSuccess,
          handleScanError,
        );
      }
      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner", err);
      toast.error("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
      setIsScanning(false);
    }
  }, [handleScanSuccess]);

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  useEffect(() => {
    // Request permission and get cameras
    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length > 0) {
          setHasPermission(true);
          setDevices(cameras);
          // Auto-select back camera if available, otherwise first camera
          const backCamera = cameras.find((c) =>
            c.label.toLowerCase().includes("back"),
          );
          const initialCameraId = backCamera ? backCamera.id : cameras[0].id;
          setSelectedCamera(initialCameraId);
          startScanner(initialCameraId);
        } else {
          setHasPermission(false);
        }
      })
      .catch((err) => {
        setHasPermission(false);
        console.error("Error getting cameras", err);
      });

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = async () => {
    if (devices.length <= 1) return;
    
    const currentIndex = devices.findIndex((c) => c.id === selectedCamera);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextCameraId = devices[nextIndex].id;
    
    setSelectedCamera(nextCameraId);
    await startScanner(nextCameraId);
  };

  if (hasPermission === false) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center h-64 border-dashed bg-gray-50/50">
        <Camera className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-900">Akses Kamera Ditolak</p>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Aplikasi membutuhkan akses kamera untuk scan QR Code. Silakan izinkan akses kamera di pengaturan browser Anda.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden relative bg-black shadow-lg ring-1 ring-black/5">
      {/* Scanner container */}
      <div id={regionId} className="w-full aspect-square md:aspect-video object-cover" />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
        <div className="flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm pointer-events-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {isScanning ? "Scanner Aktif" : "Scanner Berhenti"}
          </div>

          {devices.length > 1 && (
            <Button
              variant="secondary"
              size="icon"
              className="pointer-events-auto h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-0 shadow-sm"
              onClick={switchCamera}
              aria-label="Switch camera"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Scan target guide */}
        <div className="flex-1 flex items-center justify-center pointer-events-none opacity-50">
           {/* Custom scan area corners */}
        </div>

        <p className="text-center text-xs text-white/70 bg-black/40 backdrop-blur-sm rounded-full py-1.5 px-4 self-center mt-auto pointer-events-auto">
          Arahkan QR Code ke dalam kotak
        </p>
      </div>

      <style>{`
        #qr-reader {
          border: none !important;
        }
        #qr-reader img {
          display: none !important;
        }
        #qr-reader__scan_region {
          background-color: #000;
        }
        #qr-reader__dashboard {
          display: none !important;
        }
      `}</style>
    </Card>
  );
}
