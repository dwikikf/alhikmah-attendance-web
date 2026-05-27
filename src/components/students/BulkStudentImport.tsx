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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClasses } from "@/queries/useClassQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importStudents } from "@/services/studentService";

interface BulkStudentImportProps {
  onSuccess?: () => void;
}

interface ParsedStudentRow {
  nisn: string;
  full_name: string;
  gender: string;
  row: number;
}

export default function BulkStudentImport({
  onSuccess,
}: BulkStudentImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [classId, setClassId] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedStudentRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: classesData, isLoading: isLoadingClasses } = useClasses();

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setIsUploading(false);
    setClassId("");
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

  const handleDownloadSample = () => {
    const csvContent = "nisn,nama,gender\n1234567890,Budi Santoso,L\n0987654321,Siti Aminah,P";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "format_import_siswa.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (
      selectedFile.type !== "text/csv" &&
      !selectedFile.name.endsWith(".csv")
    ) {
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
      const lines = text.split(/\r?\n/).filter((line) => line.trim());

      if (lines.length < 2) {
        setErrors(["File CSV kosong atau tidak memiliki data"]);
        return;
      }

      // Check header
      const header = lines[0].toLowerCase();
      if (!header.includes("nisn") || !header.includes("nama") || !header.includes("gender")) {
        setErrors(["Header CSV harus mengandung 'nisn', 'nama', dan 'gender'"]);
        return;
      }

      const rows: ParsedStudentRow[] = [];
      const newErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",");
        if (columns.length < 3) continue;

        const nisn = columns[0]?.trim();
        const full_name = columns[1]?.trim();
        let gender = columns[2]?.trim().toUpperCase() || "";

        if (!nisn || !full_name) {
          newErrors.push(`Baris ${i + 1}: NISN dan Nama wajib diisi`);
          continue;
        }

        if (nisn.length !== 10) {
          newErrors.push(`Baris ${i + 1}: NISN harus tepat 10 digit`);
          continue;
        }

        if (full_name.length < 3) {
          newErrors.push(`Baris ${i + 1}: Nama minimal 3 karakter`);
          continue;
        }

        if (gender !== "L" && gender !== "P") {
          newErrors.push(`Baris ${i + 1}: Gender harus berupa 'L' atau 'P'`);
          continue;
        }

        // Frontend still maps 'L' and 'P' as required by internal props or just pass L/P if we send direct.
        // Actually, since we upload the file, backend handles the raw text. 
        // We just display it here. We can store it as L or P.
        const displayGender = gender === "L" ? "laki-laki" : "perempuan";
        rows.push({ nisn, full_name, gender: displayGender, row: i + 1 });
      }

      setParsedData(rows);
      setErrors(newErrors);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file || !classId || errors.length > 0) return;

    setIsUploading(true);
    try {
      await importStudents(classId, file);
      toast.success(`Data siswa berhasil diimpor`);
      if (onSuccess) onSuccess();
      resetState();
      setIsOpen(false);
    } catch (error: any) {
      // api.ts interceptor will handle the global toast message with the readable error
      // but just in case we need a fallback:
      const msg = error.response?.data?.message;
      if (!msg) {
        toast.error("Gagal mengimpor siswa");
      }
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Data Siswa Massal</DialogTitle>
          <DialogDescription>
            Pilih kelas dan unggah file CSV dengan format:{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              nisn,nama,gender
            </code>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex flex-col gap-2 flex-1 w-full">
              <label className="text-sm font-medium">Pilih Kelas</label>
              <Select
                value={classId}
                onValueChange={setClassId}
                disabled={isLoadingClasses}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas untuk siswa" />
                </SelectTrigger>
                <SelectContent>
                  {classesData?.data.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={handleDownloadSample}
            >
              <Download className="h-4 w-4" />
              Download Format CSV
            </Button>
          </div>

          {!file ? (
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer mt-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium">Klik untuk memilih file CSV</p>
              <p className="text-xs text-muted-foreground mt-1">
                Format kolom: nisn, nama, gender
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • {parsedData.length}{" "}
                      baris valid
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                    setErrors([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
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
                        <TableHead>Gender</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs text-muted-foreground">
                            {row.row}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {row.nisn}
                          </TableCell>
                          <TableCell className="text-xs truncate max-w-[200px]">
                            {row.full_name}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.gender === "laki-laki" ? "L" : "P"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {parsedData.length > 5 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-xs text-muted-foreground"
                          >
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
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Batal
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              !file ||
              !classId ||
              errors.length > 0 ||
              parsedData.length === 0 ||
              isUploading
            }
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Mulai Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
