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
import type { BulkImportResult } from "@/types";

interface BulkStudentImportProps {
  onSuccess?: () => void;
}

interface ParsedStudentRow {
  nisn: string;
  full_name: string;
  class_name: string;
  gender: string;
  row: number;
}

export default function BulkStudentImport({ onSuccess }: BulkStudentImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedStudentRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setIsUploading(false);
    setImportResult(null);
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
      if (!header.includes("nisn") || !header.includes("nama") || !header.includes("kelas")) {
        setErrors(["Header CSV harus mengandung 'nisn', 'nama', dan 'kelas'"]);
        return;
      }

      const rows: ParsedStudentRow[] = [];
      const newErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Handle basic CSV parsing (ignoring complex quotes for this simple implementation)
        const columns = lines[i].split(",");
        if (columns.length < 3) continue;

        const nisn = columns[0]?.trim();
        const full_name = columns[1]?.trim();
        const class_name = columns[2]?.trim();
        let gender = columns[3]?.trim().toLowerCase() || "laki-laki";

        if (!nisn || !full_name || !class_name) {
          newErrors.push(`Baris ${i + 1}: NISN, Nama, dan Kelas wajib diisi`);
          continue;
        }

        if (gender === "l" || gender === "laki" || gender === "laki-laki") gender = "laki-laki";
        else if (gender === "p" || gender === "perempuan") gender = "perempuan";
        else gender = "laki-laki";

        rows.push({ nisn, full_name, class_name, gender, row: i + 1 });
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
      const formData = new FormData();
      formData.append("file", file!);

      const res = await api.post<{ success: boolean; data: BulkImportResult }>("/students/bulk-import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setImportResult(res.data.data);
      toast.success(`${res.data.data.success} data siswa berhasil diimpor`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Data Siswa Massal</DialogTitle>
          <DialogDescription>
            Unggah file CSV dengan format: <code className="bg-muted px-1 py-0.5 rounded text-xs">nisn,nama,kelas,jk</code>.
            Pastikan nama kelas sesuai persis dengan data kelas di sistem.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-4">
          {importResult ? (
            <div className="space-y-4">
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  Import selesai. {importResult.success} berhasil, {importResult.failed} gagal.
                </AlertDescription>
              </Alert>

              {importResult.errors.length > 0 && (
                <div className="border rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Baris</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.errors.map((err, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs text-muted-foreground">{err.row}</TableCell>
                          <TableCell className="font-mono text-xs">{err.nisn}</TableCell>
                          <TableCell className="text-xs text-red-600">{err.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ) : !file ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium">Klik untuk memilih file CSV</p>
              <p className="text-xs text-muted-foreground mt-1">Format kolom: nisn, nama, kelas, jk</p>
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
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs text-muted-foreground">{row.row}</TableCell>
                          <TableCell className="font-mono text-xs">{row.nisn}</TableCell>
                          <TableCell className="text-xs truncate max-w-[150px]">{row.full_name}</TableCell>
                          <TableCell className="text-xs">{row.class_name}</TableCell>
                        </TableRow>
                      ))}
                      {parsedData.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-xs text-muted-foreground">
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
          {importResult ? (
            <Button onClick={() => setIsOpen(false)}>Selesai</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
                Batal
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!file || errors.length > 0 || parsedData.length === 0 || isUploading}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Mulai Import
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
