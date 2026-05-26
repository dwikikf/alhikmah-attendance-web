import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { exportReport } from "@/utils/export";
import type { ReportType } from "@/types/report";

interface ReportExporterProps {
  reportType: ReportType;
  classId: string;
  date?: string;
  month?: string;
  semester?: string;
  academicYear?: string;
  filename: string;
}

export default function ReportExporter({ 
  reportType, 
  classId, 
  date,
  month, 
  semester, 
  academicYear,
  filename 
}: ReportExporterProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(format);
    await exportReport({
      report_type: reportType,
      class_id: classId,
      date,
      month,
      semester,
      academic_year: academicYear,
      format
    }, filename);
    setIsExporting(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={!!isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? "Mengunduh..." : "Unduh Laporan"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Pilih Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-gray-500" />
          <span>CSV Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
