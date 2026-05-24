# Task: Standarisasi Global Error Response & Handling

## Objective
Melakukan audit dan refactoring secara global di Backend (Golang) dan Frontend (React) untuk menstandarisasi API Response dan Error Handling.

## Checklist

- [x] 0.0 Create feature branch `feature/global-error-handling`
- [x] 1.0 Standarisasi Response Backend
  - [x] 1.1 Buat `pkg/response/response.go`
  - [x] 1.2 Refactor `internal/handler/utils.go` (handleDBError)
- [x] 2.0 Pembuatan DTO Backend
  - [x] 2.1 Buat `internal/dto/student_dto.go`
  - [x] 2.2 Buat `internal/dto/class_dto.go`
  - [x] 2.3 Buat `internal/dto/user_dto.go`
  - [x] 2.4 Buat `internal/dto/auth_dto.go`
  - [x] 2.5 Buat `internal/dto/attendance_dto.go`
- [x] 3.0 Refactor Handler Backend
  - [x] 3.1 Refactor `student_handler.go`
  - [x] 3.2 Refactor `class_handler.go`
  - [x] 3.3 Refactor `user_handler.go`
  - [x] 3.4 Refactor `auth.go`
  - [x] 3.5 Refactor `attendance_handler.go`
  - [x] 3.6 Refactor `dashboard_handler.go`
  - [x] 3.7 Refactor `report_handler.go`
- [x] 4.0 Standarisasi API Client & Interceptor Frontend
  - [x] 4.1 Tambahkan global error handler di Axios interceptor (`api.ts`)
  - [x] 4.2 Hapus redundant error handling di form components (`StudentForm`, `ClassForm`, dsb)
- [x] 5.0 Testing & Validasi
  - [x] 5.1 Verifikasi build backend
  - [x] 5.2 Verifikasi build frontend
- [ ] 6.0 Penyelesaian & Pull Request
  - [ ] 6.1 Pastikan semua file masuk dalam commit
  - [ ] 6.2 Buat instruksi pull request/merge
