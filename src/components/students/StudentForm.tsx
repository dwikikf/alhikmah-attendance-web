import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateStudent, useUpdateStudent } from "@/queries/useStudentQuery";
import { useClasses } from "@/queries/useClassQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Student, CreateStudentDto, UpdateStudentDto } from "@/types";

type Gender = "laki-laki" | "perempuan";

const studentSchema = z.object({
  nisn: z.string().regex(/^\d{10}$/, "NISN harus berupa 10 digit angka"),
  full_name: z.string().min(3, "Nama minimal 3 karakter"),
  class_id: z.string().min(1, "Kelas harus dipilih"),
  gender: z.enum(["laki-laki", "perempuan"]),
  date_of_birth: z.string().optional(),
  is_active: z.boolean().default(true),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StudentForm({
  initialData,
  onSuccess,
  onCancel,
}: StudentFormProps) {
  const isEditing = !!initialData;
  const { data: classesData } = useClasses();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nisn: initialData?.nisn || "",
      full_name: initialData?.full_name || "",
      class_id: initialData?.class_id || "",
      gender: (initialData?.gender as Gender) || "laki-laki",
      date_of_birth: initialData?.date_of_birth?.split("T")[0] || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    try {
      if (isEditing) {
        // Update
        const payload: UpdateStudentDto = {
          full_name: data.full_name,
          class_id: data.class_id,
          gender: data.gender as Gender,
          date_of_birth: data.date_of_birth || undefined,
          is_active: data.is_active,
        };
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Data siswa berhasil diperbarui");
      } else {
        // Create
        const payload: CreateStudentDto = {
          nisn: data.nisn,
          full_name: data.full_name,
          class_id: data.class_id,
          gender: data.gender as Gender,
          date_of_birth: data.date_of_birth || undefined,
        };
        await createMutation.mutateAsync(payload);
        toast.success("Siswa baru berhasil ditambahkan");
      }
      onSuccess();
    } catch (error) {
      // Error is handled globally by Axios interceptor
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input
                id="nisn"
                {...register("nisn")}
                disabled={isEditing || isPending}
                placeholder="Masukkan NISN"
              />
              {errors.nisn && (
                <p className="text-xs text-red-500">{errors.nisn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                {...register("full_name")}
                disabled={isPending}
                placeholder="Masukkan nama lengkap"
              />
              {errors.full_name && (
                <p className="text-xs text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_id">Kelas</Label>
              <Select
                value={watch("class_id")}
                onValueChange={(val: string) =>
                  setValue("class_id", val || "", { shouldValidate: true })
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classesData?.data.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.class_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class_id && (
                <p className="text-xs text-red-500">
                  {errors.class_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={watch("gender")}
                onValueChange={(val) => setValue("gender", val as Gender)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Tanggal Lahir (Opsional)</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register("date_of_birth")}
                disabled={isPending}
              />
            </div>

            {isEditing && (
              <div className="space-y-2 flex flex-col justify-end pb-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={watch("is_active")}
                    onCheckedChange={(checked) =>
                      setValue("is_active", checked)
                    }
                    disabled={isPending}
                  />
                  <Label htmlFor="is_active" className="font-normal">
                    Status Aktif
                  </Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            <X className="mr-2 h-4 w-4" /> Batal
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Data
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
