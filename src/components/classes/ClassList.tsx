import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { useClasses, useDeleteClass } from "@/queries/useClassQuery";
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
import DataTable from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import type { Class } from "@/types";

interface ClassListProps {
  onAdd: () => void;
  onEdit: (classData: Class) => void;
  onViewDetail: (classData: Class) => void;
}

export default function ClassList({
  onAdd,
  onEdit,
  onViewDetail,
}: ClassListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<string[]>([]);

  // Queries
  const { data: classesData, isLoading } = useClasses({
    academic_year:
      academicYearFilter !== "all" ? academicYearFilter : undefined,
  });

  // Filter local search since the API might not support searching by class name directly
  const filteredClasses =
    classesData?.data.filter(
      (c) =>
        c.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Mutations
  const deleteMutation = useDeleteClass();

  const handleDelete = async () => {
    if (!deleteClassId) return;
    try {
      await deleteMutation.mutateAsync(deleteClassId);
      toast.success("Kelas berhasil dihapus");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus kelas");
    } finally {
      setDeleteClassId(null);
    }
  };

  const columns = [
    {
      key: "class_name",
      header: "Nama Kelas",
      sortable: true,
      cell: (row: Class) => (
        <div
          className="font-medium cursor-pointer hover:underline text-emerald-700"
          onClick={() => onViewDetail(row)}
        >
          {row.class_name}
        </div>
      ),
    },
    { key: "teacher_name", header: "Wali Kelas", sortable: true },
    { key: "academic_year", header: "Tahun Ajaran" },
    {
      key: "student_count",
      header: "Jumlah Siswa",
      cell: (row: Class) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {row.student_count} / {row.capacity}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row: Class) => (
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
              <Users className="h-4 w-4 text-emerald-600" /> Lihat Detail Kelas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(row)}
              className="cursor-pointer gap-2"
            >
              <Pencil className="h-4 w-4 text-blue-600" /> Edit Kelas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteClassId(row.id)}
              className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Get unique academic years for filter
  // Jangan Ubah ini
  useEffect(() => {
    if (academicYearFilter === "all" && classesData?.data) {
      const uniqueYears = Array.from(
        new Set(classesData.data.map((c) => c.academic_year)),
      );
      setAcademicYears(uniqueYears);
    }
  }, [classesData, academicYearFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kelas atau wali kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background"
            />
          </div>
          <Select
            value={academicYearFilter}
            onValueChange={(val) => setAcademicYearFilter(val || "all")}
          >
            <SelectTrigger className="w-full sm:w-45 bg-background">
              <SelectValue placeholder="Tahun Ajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun Ajaran</SelectItem>
              {academicYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={onAdd}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Tambah Kelas
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={filteredClasses} />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteClassId}
        onOpenChange={(open) => !open && setDeleteClassId(null)}
        title="Hapus Kelas"
        description="Apakah Anda yakin ingin menghapus kelas ini? Menghapus kelas mungkin akan berdampak pada data siswa yang terkait dengan kelas ini."
        confirmLabel="Hapus Kelas"
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
