## Relevant Files

- `src/components/attendance/AttendanceHistory.tsx` - Komponen utama yang akan diperbarui untuk menambahkan tombol "Download QR" dan "Cetak Kartu", serta menghubungkan data riwayat absensi.
- `src/services/attendanceService.ts` - (Opsional) File service untuk mengambil data riwayat absensi dari API.
- `src/hooks/useAttendance.ts` - (Opsional) Custom hook (React Query) untuk manajemen state data riwayat absensi.
- `src/utils/qrUtils.ts` - (Opsional) Utility function untuk proses pembuatan dan pengunduhan QR code.
- `src/utils/printUtils.ts` - (Opsional) Utility function untuk proses cetak kartu absensi.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/attendance-history-features`)
- [ ] 1.0 Implementasi Data Fetching Riwayat Absensi
  - [ ] 1.1 Definisikan layanan endpoint API untuk mengambil riwayat absensi di `src/services/attendanceService.ts` (jika belum ada).
  - [ ] 1.2 Buat custom hook React Query (e.g. `useAttendanceHistory`) di `src/hooks/useAttendance.ts` untuk menghandle fetching, loading state, dan error.
  - [ ] 1.3 Sesuaikan mapping data dari API ke tipe data `AttendanceRecord` dan `AttendanceSummary`.
- [ ] 2.0 Implementasi Fitur Download QR
  - [ ] 2.1 Pastikan library untuk menghasilkan QR Code (misal: `qrcode.react` atau `html2canvas`) tersedia/diinstal.
  - [ ] 2.2 Buat fungsi `downloadQRCode` di utility file (`src/utils/qrUtils.ts`) untuk men-generate gambar QR dari canvas/data dan men-trigger unduhan file.
- [ ] 3.0 Implementasi Fitur Cetak Kartu Absensi
  - [ ] 3.1 Buat desain komponen printable untuk 'Kartu Absensi' (Print Layout).
  - [ ] 3.2 Buat fungsi `printCard` (bisa menggunakan `react-to-print` atau pengaturan khusus CSS `@media print`) untuk mencetak layout tersebut.
- [ ] 4.0 Pembaruan UI di AttendanceHistory.tsx dan Integrasi Semua Fitur
  - [ ] 4.1 Ganti mock data `records` dengan data asli yang di-return dari hook `useAttendanceHistory`.
  - [ ] 4.2 Integrasikan indikator loading dari hook ke render state `Skeleton` UI yang sudah tersedia di komponen.
  - [ ] 4.3 Tambahkan action buttons ("Download QR" dan "Cetak Kartu") pada antarmuka (misalnya di dalam `CardHeader` bagian kanan).
  - [ ] 4.4 Tautkan fungsi `onClick` pada tombol-tombol tersebut dengan utility `downloadQRCode` dan `printCard`.
  - [ ] 4.5 Pastikan fungsi filter tanggal dan status (filtering) tetap bekerja optimal dengan aliran data yang baru.
