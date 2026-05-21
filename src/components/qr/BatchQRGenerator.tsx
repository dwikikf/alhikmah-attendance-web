import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { formatQRData, type QRData } from "@/utils/qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileDown, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface BatchQRGeneratorProps {
  students: QRData[];
  className: string;
}

export default function BatchQRGenerator({
  students,
  className,
}: BatchQRGeneratorProps) {
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!containerRef.current || students.length === 0) return;

    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Grid settings (3x4 for QR codes on A4)
      const cols = 3;
      const rows = 4;
      const margin = 10;
      const cardWidth = (pageWidth - margin * 2) / cols;
      const cardHeight = (pageHeight - margin * 2) / rows;

      // Get all QR code elements
      const qrElements = containerRef.current.querySelectorAll(".qr-card");
      
      let currentItem = 0;
      
      while (currentItem < qrElements.length) {
        if (currentItem > 0 && currentItem % (cols * rows) === 0) {
          pdf.addPage();
        }

        for (let i = 0; i < cols * rows && currentItem < qrElements.length; i++) {
          const el = qrElements[currentItem] as HTMLElement;
          
          // Temporarily style for capture
          const originalTransform = el.style.transform;
          el.style.transform = "scale(1)";
          
          const canvas = await html2canvas(el, {
            scale: 2,
            backgroundColor: "#ffffff",
            logging: false,
          });
          
          el.style.transform = originalTransform;

          const imgData = canvas.toDataURL("image/jpeg", 0.95);
          
          const colIndex = i % cols;
          const rowIndex = Math.floor(i / cols);
          
          const x = margin + colIndex * cardWidth;
          const y = margin + rowIndex * cardHeight;
          
          // Leave small padding inside the grid cell
          const padding = 5;
          pdf.addImage(
            imgData,
            "JPEG",
            x + padding,
            y + padding,
            cardWidth - padding * 2,
            cardHeight - padding * 2
          );
          
          currentItem++;
        }
      }

      pdf.save(`QR_Kelas_${className.replace(/\s+/g, '_')}.pdf`);
      toast.success("PDF berhasil diunduh");
    } catch (error) {
      console.error("Failed to export PDF", error);
      toast.error("Gagal mengunduh PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-50 border-dashed">
        <p className="text-gray-500">Tidak ada data siswa untuk di-generate.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Batch QR - Kelas {className}
          </h2>
          <p className="text-sm text-gray-500">
            {students.length} QR Code siap dicetak
          </p>
        </div>
        
        <Button 
          onClick={handleExportPDF} 
          disabled={isExporting}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Memproses PDF..." : "Export Semua ke PDF"}
        </Button>
      </div>

      {/* Hidden container just for PDF generation layout if needed, but we render a visible grid here */}
      <div 
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {students.map((student) => (
          <div 
            key={student.nisn}
            className="qr-card bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center shadow-sm"
          >
            <QRCode
              value={formatQRData(student)}
              size={120}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
            <div className="mt-3 text-center w-full">
              <h3 className="font-bold text-xs text-gray-900 truncate" title={student.name}>
                {student.name}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 font-mono">
                {student.nisn}
              </p>
              <p className="text-[10px] font-medium text-emerald-600 mt-0.5">
                Kelas {student.className}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
