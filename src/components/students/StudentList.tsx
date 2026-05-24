import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  QrCode,
  Loader2,
  FileDown,
  MoreHorizontal,
} from "lucide-react";
import { useStudents, useDeleteStudent } from "@/queries/useStudentQuery";
import { useClasses } from "@/queries/useClassQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BulkStudentImport from "./BulkStudentImport";
import { toast } from "sonner";
import type { Student } from "@/types";

interface StudentListProps {
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onViewDetail: (student: Student) => void;
}

export default function StudentList({
  onAdd,
  onEdit,
  onViewDetail,
}: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(1);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);

  // Queries
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({
    search: searchTerm,
    class_id: classFilter !== "all" ? classFilter : undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    page,
    limit: 10,
  });

  const { data: classesData, isLoading: isLoadingClasses } = useClasses();

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, classFilter, statusFilter]);

  // Mutations
  const deleteMutation = useDeleteStudent();

  const handleDelete = async () => {
    if (!deleteStudentId) return;
    try {
      await deleteMutation.mutateAsync(deleteStudentId);
      toast.success("Siswa berhasil dihapus");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus siswa");
    } finally {
      setDeleteStudentId(null);
    }
  };

  const columns = [
    { key: "nisn", header: "NISN" },
    {
      key: "full_name",
      header: "Nama Siswa",
      sortable: true,
      cell: (row: Student) => (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() => onViewDetail(row)}
        >
          {row.full_name}
        </div>
      ),
    },
    { key: "class_name", header: "Kelas", sortable: true },
    {
      key: "gender",
      header: "L/P",
      cell: (row: Student) =>
        row.gender === "laki-laki"
          ? "L"
          : row.gender === "perempuan"
            ? "P"
            : "-",
    },
    {
      key: "is_active",
      header: "Status",
      cell: (row: Student) => (
        <Badge
          variant={row.is_active ? "default" : "secondary"}
          className={row.is_active ? "bg-emerald-500 hover:bg-emerald-600" : ""}
        >
          {row.is_active ? "Aktif" : "Non-aktif"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onViewDetail(row)}
              className="cursor-pointer gap-2"
            >
              <QrCode className="h-4 w-4 text-emerald-600" /> Lihat Detail & QR
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="cursor-pointer gap-2"
            >
              <Pencil className="h-4 w-4 text-blue-600" /> Edit Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteStudentId(row.id)}
              className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background"
            />
          </div>
          <Select
            value={classFilter}
            onValueChange={(val) => setClassFilter(val || "all")}
          >
            <SelectTrigger className="w-full sm:w-37.5 bg-background">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classesData?.data.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.class_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val || "active")}
          >
            <SelectTrigger className="w-full sm:w-37.5 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Non-aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <BulkStudentImport onSuccess={() => {}} />
          <Button
            onClick={onAdd}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Tambah Siswa
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        {isLoadingStudents ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={studentsData?.data || []} 
            page={page}
            totalPages={studentsData?.pagination?.totalPages || 1}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteStudentId}
        onOpenChange={(open) => !open && setDeleteStudentId(null)}
        title="Hapus Siswa"
        description="Apakah Anda yakin ingin menghapus data siswa ini? Data absensi yang terkait dengan siswa ini mungkin akan tetap tersimpan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
