## Relevant Files

- `src/types/attendance.ts` - TypeScript interfaces that need to match the new API structure.
- `src/services/attendanceService.ts` - API client functions for QR and Manual attendance.
- `src/pages/AttendanceScannerPage.tsx` - Main page handling QR scanning payload.
- `src/components/attendance/ManualAttendanceForm.tsx` - UI form for manual attendance.

### Notes

- Gunakan `bun run dev` untuk menjalankan development server karena menggunakan bun.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Checkout a new branch `feature/attendance-web-qr-manual`
- [x] 1.0 Update TypeScript Interfaces (DTOs)
  - [x] 1.1 In `src/types/attendance.ts`, update `QRScanRequest` to only contain `nisn: string` (menyesuaikan perubahan di API).
  - [x] 1.2 In `src/types/attendance.ts`, update `ManualAttendanceRequest` to contain `student_id: string`, `class_id: string`, `status: AttendanceStatus`, dan `notes?: string`. Hapus array `students`.
- [x] 2.0 Update API Service Methods
  - [x] 2.1 In `src/services/attendanceService.ts`, pastikan fungsi `recordQRScan` mengirim struktur payload `QRScanRequest` yang baru.
  - [x] 2.2 In `src/services/attendanceService.ts`, pastikan fungsi `recordManualAttendance` mengirim struktur `ManualAttendanceRequest` untuk 1 siswa.
- [x] 3.0 Refactor QR Scanner Page Payload
  - [x] 3.1 In `src/pages/AttendanceScannerPage.tsx`, ubah payload di `handleScanSuccess` agar mengirimkan `{ nisn: data.nisn }` alih-alih `qr_code_data`.
- [x] 4.0 Refactor Manual Attendance Form (One-by-one Submission)
  - [x] 4.1 In `src/components/attendance/ManualAttendanceForm.tsx`, hapus fitur Checkbox "Pilih Semua" (bulk selection).
  - [x] 4.2 Ubah UI masing-masing baris siswa agar langsung menampilkan tombol aksi cepat (Hadir, Izin, Sakit) atau Dropdown yang memicu absensi secara individual (bukan tombol Simpan raksasa di bawah).
  - [x] 4.3 Buat fungsi `handleMarkAttendance(studentId, status)` yang langsung menembak API `api.post("/attendances/manual")` satu-per-satu saat tombol ditekan.
  - [x] 4.4 Tampilkan notifikasi toast sukses untuk setiap absensi individu yang di-klik.
