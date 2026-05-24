import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser, useUpdateUser } from "@/queries/useUserQuery";
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
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import type {
  SystemUser as User,
  CreateUserDto,
  UpdateUserDto,
} from "@/types/user";

const userSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  full_name: z.string().min(3, "Nama minimal 3 karakter"),
  password: z.string().optional(),
  role: z.enum(["admin", "teacher"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({
  initialData,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
      full_name: initialData?.full_name || "",
      role: initialData?.role || "teacher",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (isEditing) {
        if (!initialData.id) return;
        const payload: UpdateUserDto = {
          full_name: data.full_name,
          email: data.email,
        };
        await updateMutation.mutateAsync({ id: initialData.id, data: payload });
        toast.success("Data pengguna berhasil diperbarui");
      } else {
        if (!data.password) {
          toast.error("Password wajib diisi untuk pengguna baru");
          return;
        }
        const payload: CreateUserDto = {
          username: data.username,
          email: data.email,
          full_name: data.full_name,
          password: data.password,
          role: data.role,
        };
        await createMutation.mutateAsync(payload);
        toast.success("Pengguna baru berhasil ditambahkan");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                disabled={isEditing || isPending}
                placeholder="Masukkan username"
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={isPending}
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
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
              <Label htmlFor="role">Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(val: any) => setValue("role", val)}
                disabled={isEditing || isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isPending}
                  placeholder="Masukkan password"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
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
