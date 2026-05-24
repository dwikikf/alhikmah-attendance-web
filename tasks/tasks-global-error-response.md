## Relevant Files

### Backend (Golang)
- `pkg/response/response.go` - (New) Helper untuk standarisasi format response JSON.
- `internal/dto/auth_dto.go` - (New) DTO request/response untuk auth.
- `internal/dto/student_dto.go` - (New) DTO request/response untuk student.
- `internal/dto/class_dto.go` - (New) DTO request/response untuk class.
- `internal/dto/user_dto.go` - (New) DTO request/response untuk user.
- `internal/dto/attendance_dto.go` - (New) DTO request/response untuk attendance.
- `internal/handler/utils.go` - Centralized error mapping untuk DB errors.
- `internal/handler/auth.go` - Refactor response & DTO.
- `internal/handler/student_handler.go` - Refactor response & DTO.
- `internal/handler/class_handler.go` - Refactor response & DTO.
- `internal/handler/user_handler.go` - Refactor response & DTO.
- `internal/handler/attendance_handler.go` - Refactor response & DTO.
- `internal/handler/dashboard_handler.go` - Refactor response & DTO.
- `internal/handler/report_handler.go` - Refactor response & DTO.

### Frontend (React)
- `src/types/api.ts` - Update definisi interface response agar standar.
- `src/utils/api.ts` - Konfigurasi Axios Interceptor global.
- `src/queries/useStudentQuery.ts` - Refactor mutation untuk passing message.
- `src/queries/useClassQuery.ts` - Refactor mutation untuk passing message.
- `src/queries/useUserQuery.ts` - Refactor mutation untuk passing message.
- `src/queries/useAuthQuery.ts` - Refactor mutation untuk passing message.
- `src/components/students/StudentForm.tsx` - Refactor penanganan toast message.
- `src/components/classes/ClassForm.tsx` - Refactor penanganan toast message.
- `src/components/users/UserForm.tsx` - Refactor penanganan toast message.
- `src/components/auth/LoginForm.tsx` - Refactor penanganan toast message (jika ada).

### Notes
- Backend harus menggunakan Gin validation yang sudah ada (`binding` tags) tetapi digabungkan dengan DTO terpusat.
- Pesan error database jangan mengexpose raw log (seperti `pqErr.Detail`). Map error code PostgreSQL (23505 untuk unique, 23503 untuk foreign key) ke kalimat bahasa Indonesia yang ramah (contoh: "Data ini sudah terdaftar").
- Frontend Axios interceptor (response error) harus menangkap `error.response.data.message` dan mem-passingnya ke `error.message` agar try-catch di komponen selalu mendapatkan pesan yang seragam.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [x] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/global-error-handling`)

- [x] 1.0 Standarisasi Response & Error Handling Backend (Golang)
  - [x] 1.1 Buat file `pkg/response/response.go` yang berisi struktur baku JSON: `{ "success": boolean, "message": string, "data": any }` beserta helper function `Success`, `Error`, dan `ValidationError`.
  - [x] 1.2 Edit `internal/handler/utils.go`. Update fungsi `handleDBError` untuk tidak me-return raw `pqErr.Detail`. Gunakan helper `response.Error` dan buat pesan error berbahasa Indonesia yang ramah untuk user (misal: "Data yang dimasukkan sudah ada di sistem" untuk duplikat).

- [ ] 2.0 Pembuatan DTO (Data Transfer Object) Backend
  - [ ] 2.1 Buat folder `internal/dto`.
  - [ ] 2.2 Ekstrak inline struct dari `student_handler.go` ke dalam `internal/dto/student_dto.go` (misal: `CreateStudentRequest`, `UpdateStudentRequest`). Tambahkan tag validation (binding).
  - [ ] 2.3 Ekstrak inline struct dari `class_handler.go` ke dalam `internal/dto/class_dto.go`.
  - [ ] 2.4 Ekstrak inline struct dari `user_handler.go` ke dalam `internal/dto/user_dto.go`.
  - [ ] 2.5 Ekstrak inline struct dari `auth.go` ke dalam `internal/dto/auth_dto.go`.
  - [ ] 2.6 Ekstrak inline struct dari `attendance_handler.go` ke dalam `internal/dto/attendance_dto.go`.

- [ ] 3.0 Refactor Seluruh Handler Backend
  - [ ] 3.1 Refactor `internal/handler/student_handler.go`: Ganti penggunaan struct inline dengan DTO, kembalikan response menggunakan `response.Success()` atau `response.Error()`.
  - [ ] 3.2 Refactor `internal/handler/class_handler.go`: Ganti penggunaan struct inline dengan DTO, update seluruh response ke format standar.
  - [ ] 3.3 Refactor `internal/handler/user_handler.go`: Ganti penggunaan struct inline dengan DTO, update seluruh response ke format standar.
  - [ ] 3.4 Refactor `internal/handler/auth.go`: Ganti penggunaan struct inline dengan DTO, update seluruh response ke format standar.
  - [ ] 3.5 Refactor `internal/handler/attendance_handler.go`: Ganti penggunaan struct inline dengan DTO, update seluruh response ke format standar.
  - [ ] 3.6 Refactor `internal/handler/dashboard_handler.go` dan `report_handler.go` agar mematuhi format response standar.

- [ ] 4.0 Refactor Global Axios Interceptor (Frontend)
  - [ ] 4.1 Update `src/types/api.ts`: Pastikan interface `ApiResponse` wajib memiliki properti `message: string` dan menampung custom error format.
  - [ ] 4.2 Buka `src/utils/api.ts`. Di bagian interceptor response error, ekstrak `error.response.data.message` (atau fallback message lain jika undefined) lalu assign ke `error.message`.
  - [ ] 4.3 Kembalikan error yang dimodifikasi ini (`Promise.reject(error)`) agar dapat di-catch di komponen secara seragam.

- [ ] 5.0 Refactor Mutasi React Query & Komponen Form (Frontend)
  - [ ] 5.1 Periksa hook mutations (`useCreateStudent`, `useUpdateStudent`, dll) di dalam `src/queries/`. Pastikan object response (`res.data.message`) di-return jika komponen memerlukannya untuk toast success, atau set up agar UI bisa membacanya.
  - [ ] 5.2 Refactor `StudentForm.tsx`: Ubah `toast.success` dan `toast.error` untuk menggunakan `message` yang berasal dari Backend. Hapus hardcoded string seperti "Data siswa berhasil diperbarui".
  - [ ] 5.3 Refactor `ClassForm.tsx`: Ubah `toast.success` dan `toast.error` untuk menggunakan `message` yang berasal dari Backend.
  - [ ] 5.4 Refactor `UserForm.tsx`: Ubah `toast.success` dan `toast.error` untuk menggunakan `message` dari Backend.
  - [ ] 5.5 Periksa komponen lain yang memiliki form/mutasi (seperti Authentication Login, atau Bulk Import) dan pastikan menerapkan pola dynamic message yang sama.

- [ ] 6.0 Testing & Validasi End-to-End
  - [ ] 6.1 Jalankan tes buat student/kelas duplikat (mengirim data dengan constraint unique yang sama) dan pastikan form menampilkan error toast berupa teks bahasa Indonesia yang rapi (bukan raw SQL error).
  - [ ] 6.2 Buat data yang sukses, lalu pastikan toast pesan sukses juga sesuai dengan kalimat yang disuplai dari Backend.
  - [ ] 6.3 Pastikan API Response structure (Network Tab) konsisten mengembalikan `{ success, message, data }` pada setiap endpoint.
