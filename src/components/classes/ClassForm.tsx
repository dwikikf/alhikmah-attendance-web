import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateClass, useUpdateClass } from "@/queries/useClassQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useUsers } from "@/queries/useUserQuery";
import type { Class, CreateClassDto, UpdateClassDto } from "@/types";

const classSchema = z.object({
  class_name: z.string().min(2, "Nama kelas minimal 2 karakter"),
  teacher_id: z.string().min(1, "ID Wali Kelas wajib diisi"), // In a real app, this would be a select from teachers list
  academic_year: z.string().min(4, "Tahun ajaran wajib diisi"),
  capacity: z.coerce.number().min(1).max(50),
  description: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormProps {
  initialData?: Class;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClassForm({ initialData, onSuccess, onCancel }: ClassFormProps) {
  const isEditing = !!initialData;
  
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: usersData, isLoading: isLoadingUsers } = useUsers({ role: "teacher", is_active: true });
  const teachers = usersData?.data || [];

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      class_name: initialData?.class_name || "",
      teacher_id: initialData?.teacher_id || "teacher-1", // Mock default
      academic_year: initialData?.academic_year || "2024/2025",
      capacity: initialData?.capacity || 30,
      description: initialData?.description || "",
    }
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (isEditing) {
        // Update
        const payload: UpdateClassDto = {
          class_name: data.class_name,
          teacher_id: data.teacher_id,
          capacity: data.capacity,
          description: data.description,
        };
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Data kelas berhasil diperbarui");
      } else {
        // Create
        const payload: CreateClassDto = {
          class_name: data.class_name,
          teacher_id: data.teacher_id,
          academic_year: data.academic_year,
          capacity: data.capacity,
          description: data.description,
        };
        await createMutation.mutateAsync(payload);
        toast.success("Kelas baru berhasil ditambahkan");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Data Kelas" : "Tambah Kelas Baru"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class_name">Nama Kelas</Label>
            <Input 
              id="class_name" 
              {...register("class_name")} 
              disabled={isPending} 
              placeholder="Contoh: Kelas 10A"
            />
            {errors.class_name && <p className="text-xs text-red-500">{errors.class_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academic_year">Tahun Ajaran</Label>
              <Input 
                id="academic_year" 
                {...register("academic_year")} 
                disabled={isEditing || isPending} 
                placeholder="Contoh: 2024/2025"
              />
              {errors.academic_year && <p className="text-xs text-red-500">{errors.academic_year.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasitas Maksimal</Label>
              <Input 
                id="capacity" 
                type="number"
                {...register("capacity")} 
                disabled={isPending} 
              />
              {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher_id">Wali Kelas</Label>
            <Select 
              value={watch("teacher_id")} 
              onValueChange={(val: any) => setValue("teacher_id", val)}
              disabled={isPending || isLoadingUsers}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingUsers ? "Memuat guru..." : "Pilih Wali Kelas"} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacher_id && <p className="text-xs text-red-500">{errors.teacher_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              disabled={isPending} 
              placeholder="Catatan tambahan tentang kelas ini"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            <X className="mr-2 h-4 w-4" /> Batal
          </Button>
          <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Data
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
