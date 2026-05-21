import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { formatQRData, type QRData } from "@/utils/qrcode";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface QRGeneratorProps {
  data: QRData;
  size?: number;
  showDetails?: boolean;
}

export default function QRGenerator({
  data,
  size = 200,
  showDetails = true,
}: QRGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const qrString = formatQRData(data);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure rendering is complete
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(qrRef.current, {
        scale: 4, // Higher resolution
        backgroundColor: "#ffffff",
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `QR_${data.nisn}_${data.name.replace(/\s+/g, '_')}.png`;
      link.click();
      
      toast.success("QR Code berhasil diunduh");
    } catch (error) {
      console.error("Failed to export QR Code", error);
      toast.error("Gagal mengunduh QR Code");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Container that will be captured by html2canvas */}
      <div 
        ref={qrRef}
        className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-sm border border-gray-100"
        style={{ width: size + 48 }}
      >
        <div className="bg-white p-2 rounded-xl">
          <QRCode
            value={qrString}
            size={size}
            level="H" // High error correction
            bgColor="#ffffff"
            fgColor="#022c22" // Dark emerald
          />
        </div>
        
        {showDetails && (
          <div className="mt-4 text-center w-full">
            <h3 className="font-bold text-gray-900 truncate" title={data.name}>
              {data.name}
            </h3>
            <p className="text-sm font-medium text-emerald-600 mt-0.5">
              Kelas {data.className}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono bg-gray-50 py-1 px-2 rounded-md inline-block">
              {data.nisn}
            </p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleDownload} 
        disabled={isExporting}
        variant="outline"
        className="w-full max-w-[200px]"
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Mengunduh..." : "Unduh PNG"}
      </Button>
    </div>
  );
}
