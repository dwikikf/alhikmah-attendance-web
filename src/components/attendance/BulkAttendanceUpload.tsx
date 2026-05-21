import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/utils/api";

interface BulkAttendanceUploadProps {
  classId: string;
  onSuccess?: () => void;
}

interface ParsedRow {
  nisn: string;
  status: string;
  notes: string;
  row: number;
}

export default function BulkAttendanceUpload({ classId, onSuccess }: BulkAttendanceUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetState();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      toast.error("Format file tidak didukung. Harap unggah file CSV.");
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(["File CSV kosong atau tidak memiliki data"]);
        return;
      }

      // Check header
      const header = lines[0].toLowerCase();
      if (!header.includes("nisn") || !header.includes("status")) {
        setErrors(["Header CSV harus mengandung 'nisn' dan 'status'"]);
        return;
      }

      const rows: ParsedRow[] = [];
      const newErrors: string[] = [];
      const validStatuses = ["hadir", "izin", "sakit", "tanpa_keterangan"];

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",");
        if (columns.length < 2) continue;

        const nisn = columns[0]?.trim();
        let status = columns[1]?.trim().toLowerCase();
        const notes = columns[2]?.trim() || "";

        if (!nisn) {
          newErrors.push(`Baris ${i + 1}: NISN kosong`);
          continue;
        }

        // Normalize status
        if (status === "alpa" || status === "alpha") status = "tanpa_keterangan";
        if (status === "present") status = "hadir";
        if (status === "sick") status = "sakit";
        if (status === "excused") status = "izin";

        if (!validStatuses.includes(status)) {
          newErrors.push(`Baris ${i + 1}: Status tidak valid ('${status}') untuk NISN ${nisn}`);
          continue;
        }

        rows.push({ nisn, status, notes, row: i + 1 });
      }

      setParsedData(rows);
      setErrors(newErrors);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0 || errors.length > 0) return;
    
    setIsUploading(true);
    try {
      // Create FormData with the actual file
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("class_id", classId);

      // We use a mock endpoint for now since the PRD doesn't strictly specify bulk CSV upload for attendance
      // but if the backend implements it, it would look like this
      await api.post("/attendances/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success(`${parsedData.length} data absensi berhasil diunggah`);
      setIsOpen(false);
      onSuccess?.();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Absensi Massal</DialogTitle>
          <DialogDescription>
            Unggah file CSV dengan format: <code className="bg-muted px-1 py-0.5 rounded text-xs">nisn,status,keterangan</code>.
            Status yang valid: hadir, izin, sakit, tanpa_keterangan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-4">
          {!file ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium">Klik untuk memilih file CSV</p>
              <p className="text-xs text-muted-foreground mt-1">Maksimal ukuran file: 2MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length} baris valid
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetState}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1 mt-2 text-xs">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {parsedData.length > 0 && errors.length === 0 && (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Baris</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs text-muted-foreground">{row.row}</TableCell>
                          <TableCell className="font-mono text-xs">{row.nisn}</TableCell>
                          <TableCell className="text-xs">{row.status}</TableCell>
                        </TableRow>
                      ))}
                      {parsedData.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-xs text-muted-foreground">
                            ... dan {parsedData.length - 5} baris lainnya
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
            Batal
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || errors.length > 0 || parsedData.length === 0 || isUploading}
            className="gap-2"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Upload Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
