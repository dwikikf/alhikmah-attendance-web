## Relevant Files

### Backend (alhikmah-attendance-api)
- `internal/dto/user_dto.go` - Tambah field `password` (opsional) pada `UpdateUserRequest`.
- `internal/domain/user.go` - Tambah method `UpdatePassword` atau extend interface `UserService`/`UserRepository` bila diperlukan.
- `internal/service/user_service.go` - Tangani hashing password baru saat field `password` diisi pada saat update.
- `internal/repository/user_postgres.go` - Update query SQL untuk menyertakan `password_hash` secara kondisional ketika ada perubahan password.
- `internal/handler/user_handler.go` - Teruskan field password dari request ke domain model saat update.

### Frontend (alhikmah-attendance-web)
- `src/types/user.ts` - Tambah field `password` (opsional) pada `UpdateUserDto`.
- `src/services/userService.ts` - Tidak ada perubahan signifikan (payload sudah melewati `UpdateUserDto`).
- `src/queries/useUserQuery.ts` - Tidak ada perubahan (mutation sudah ada).
- `src/components/users/UserForm.tsx` - Tampilkan field password (opsional) saat mode edit, lengkap dengan konfirmasi password dan validasi Zod.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` dan `MyComponent.test.tsx` dalam direktori yang sama).
- Gunakan `npx jest [optional/path/to/test/file]` untuk menjalankan tests.
- Password **bersifat opsional** saat update — jika dikosongkan, password pengguna tidak berubah. Hanya jika field password diisi, password akan di-hash dan diperbarui.
- Password baru harus minimal 6 karakter (sesuai validasi yang ada pada `CreateUserRequest`).
- Untuk keamanan, sertakan field `confirm_password` di frontend sebagai konfirmasi tambahan — tetapi **tidak** dikirim ke API.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Buat feature branch
  - [x] 0.1 Buat dan checkout branch baru: `git checkout -b feature/update-user-password`

- [x] 1.0 Backend — Perbarui DTO `UpdateUserRequest`
  - [x] 1.1 Buka `internal/dto/user_dto.go`
  - [x] 1.2 Tambah field `Password string` (opsional, tidak required) ke struct `UpdateUserRequest`:
        ```go
        Password string `json:"password" binding:"omitempty,min=6"`
        ```

- [x] 2.0 Backend — Perbarui Handler `Update`
  - [x] 2.1 Buka `internal/handler/user_handler.go`
  - [x] 2.2 Di fungsi `Update`, setelah binding request, set field `PasswordHash` pada domain object dari `req.Password` (nilai mentah — service akan meng-hash):
        ```go
        user := &domain.User{
            ID:           id,
            FullName:     req.FullName,
            Email:        req.Email,
            PasswordHash: req.Password, // kosong jika tidak diubah
        }
        ```

- [x] 3.0 Backend — Perbarui Service `Update`
  - [x] 3.1 Buka `internal/service/user_service.go`
  - [x] 3.2 Di fungsi `Update`, tambahkan logika: jika `user.PasswordHash` tidak kosong, hash password baru menggunakan `utils.HashPassword()`, kemudian tetapkan hasilnya ke `user.PasswordHash`; jika kosong, biarkan password tidak berubah (service meneruskan string kosong ke repository sebagai sinyal "tidak diubah").

- [x] 4.0 Backend — Perbarui Repository `Update`
  - [x] 4.1 Buka `internal/repository/user_postgres.go`
  - [x] 4.2 Perbarui fungsi `Update` agar menggunakan query SQL kondisional:
        - Jika `user.PasswordHash` tidak kosong: sertakan `password_hash = $N` dalam `SET` clause.
        - Jika `user.PasswordHash` kosong: hanya update `full_name` dan `email` (perilaku sekarang).
  - [x] 4.3 Pastikan `password_hash` di database tidak ikut ter-update jika field kosong.

- [x] 5.0 Frontend — Perbarui Type `UpdateUserDto`
  - [x] 5.1 Buka `src/types/user.ts`
  - [x] 5.2 Tambah field opsional `password?: string` ke interface `UpdateUserDto`.

- [x] 6.0 Frontend — Perbarui Form `UserForm.tsx`
  - [x] 6.1 Buka `src/components/users/UserForm.tsx`
  - [x] 6.2 Perbarui Zod schema (`userSchema`) untuk mode edit: tambah field `password` dan `confirm_password` sebagai optional string dengan validasi:
        - Jika `password` diisi, minimal 6 karakter.
        - `confirm_password` harus sama dengan `password` jika `password` diisi (gunakan `z.superRefine` atau `.refine`).
  - [x] 6.3 Tambah section "Ubah Password" di dalam form saat `isEditing === true`, berisi:
        - Input **Password Baru** (type `password`, opsional — placeholder: *"Kosongkan jika tidak ingin mengubah password"*)
        - Input **Konfirmasi Password Baru** (type `password`)
        - Pesan error validasi di bawah masing-masing input.
  - [x] 6.4 Di fungsi `onSubmit`, saat mode edit: sertakan field `password` ke payload `UpdateUserDto` **hanya** jika field password tidak kosong (biarkan kosong = tidak dikirim atau kirim string kosong).
  - [x] 6.5 Pastikan field `confirm_password` **tidak** dikirim ke API.

- [x] 7.0 Verifikasi End-to-End
  - [x] 7.1 Jalankan backend: pastikan endpoint `PUT /users/:user_id` menerima field `password` opsional dan merespons 200 OK.
  - [x] 7.2 Test case: update user **tanpa** mengisi password → password di database tidak berubah.
  - [x] 7.3 Test case: update user **dengan** mengisi password baru yang valid (≥6 karakter) → password baru berhasil di-hash dan disimpan; login dengan password baru berhasil.
  - [x] 7.4 Test case: validasi frontend — isi password tetapi `confirm_password` berbeda → form menampilkan error validasi dan tidak submit.
  - [x] 7.5 Test case: validasi frontend — isi password kurang dari 6 karakter → form menampilkan error validasi.
  - [x] 7.6 Test case: validasi backend — kirim `password` dengan panjang < 6 karakter langsung via API tool (Postman/curl) → API mengembalikan 400 Bad Request.
