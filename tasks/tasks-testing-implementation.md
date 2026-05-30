## Relevant Files

### Web (React / Vite)
- `vitest.config.ts` - Konfigurasi Vitest (sudah ada, coverage sudah terkonfigurasi).
- `src/setupTests.ts` - Global test setup (sudah ada).
- `src/utils/test-utils.tsx` - Custom render helper dengan provider (sudah ada).
- `src/utils/validators.ts` - Fungsi validasi form.
- `src/utils/__tests__/validators.test.ts` - ✅ **Sudah ada** — test untuk validators.
- `src/utils/auth.ts` - Fungsi `decodeToken`, `isTokenExpired`, dsb.
- `src/utils/__tests__/auth.test.ts` - **[BUAT BARU]** Test untuk utility auth.
- `src/utils/formatters.ts` - Fungsi format tanggal, nama, status absensi.
- `src/utils/__tests__/formatters.test.ts` - **[BUAT BARU]** Test untuk formatters.
- `src/hooks/useAuth.ts` - Custom hook untuk autentikasi.
- `src/hooks/__tests__/useAuth.test.tsx` - ✅ **Sudah ada** — perlu di-review dan diperluas.
- `src/hooks/useLocalStorage.ts` - Custom hook untuk local storage.
- `src/hooks/__tests__/useLocalStorage.test.ts` - **[BUAT BARU]** Test untuk hook localStorage.
- `src/hooks/useAttendanceHistory.ts` - Custom hook untuk fetch riwayat absensi.
- `src/hooks/__tests__/useAttendanceHistory.test.ts` - **[BUAT BARU]** Test untuk hook ini.
- `src/components/auth/__tests__/LoginForm.test.tsx` - ✅ **Sudah ada** — perlu di-review.
- `src/pages/DashboardPage.tsx` - Halaman dashboard utama.
- `src/pages/__tests__/DashboardPage.test.tsx` - **[BUAT BARU]** Render/smoke test dashboard.
- `src/pages/LoginPage.tsx` - Halaman login.
- `src/pages/__tests__/LoginPage.test.tsx` - **[BUAT BARU]** Test halaman login.
- `package.json` - Tambahkan script `test:coverage`.

### Notes

- Jalankan semua tests: `bun run test` atau `npx vitest run`
- Jalankan dengan watch mode: `npx vitest`
- Jalankan dengan coverage: `npx vitest run --coverage`
- Test sudah dikonfigurasi menggunakan `jsdom` environment (lihat `vitest.config.ts`).
- Gunakan custom render dari `src/utils/test-utils.tsx` agar `React Query`, `Router`, dan provider lain tersedia di test.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Buat dan checkout branch baru: `git checkout -b test/unit-tests`

- [x] 1.0 Expand testing configuration
  - [x] 1.1 Tambahkan script `"test:coverage": "vitest run --coverage"` ke `package.json`
  - [x] 1.2 Jalankan test yang sudah ada untuk memastikan baseline berjalan: `npx vitest run`
  - [x] 1.3 Review isi `src/utils/test-utils.tsx` — pastikan semua provider yang dibutuhkan (AuthContext, React Query, Router) sudah di-wrap di custom render helper
  - [x] 1.4 Jika ada provider yang belum ada di `test-utils.tsx`, tambahkan sekarang

- [x] 2.0 Expand existing tests & add missing hook/utility tests
  - [x] 2.1 Review `src/hooks/__tests__/useAuth.test.tsx` yang sudah ada — tambahkan test case untuk skenario token expired dan logout
  - [x] 2.2 Review `src/components/auth/__tests__/LoginForm.test.tsx` yang sudah ada — tambahkan test untuk validasi form (submit dengan field kosong)
  - [x] 2.3 Buat file `src/utils/__tests__/auth.test.ts`
  - [x] 2.4 Tulis test untuk fungsi `decodeToken`: kirim JWT valid, pastikan payload ter-decode dengan benar
  - [x] 2.5 Tulis test untuk skenario token tidak valid / malformed: pastikan fungsi tidak crash dan return `null`
  - [x] 2.6 Buat file `src/utils/__tests__/formatters.test.ts`
  - [x] 2.7 Tulis test untuk fungsi format status absensi: input `"hadir"` → output label yang sesuai
  - [x] 2.8 Tulis test untuk fungsi format tanggal (jika ada di `formatters.ts` atau `date.ts`)
  - [x] 2.9 Buat file `src/hooks/__tests__/useLocalStorage.test.ts`
  - [x] 2.10 Tulis test `setsAndGetsValue`: set nilai, pastikan `get` mengembalikan nilai yang sama
  - [x] 2.11 Tulis test `returnsDefaultValue`: jika key tidak ada di localStorage, pastikan default value dikembalikan

- [x] 3.0 Implement page-level component tests (`src/pages`)
  - [x] 3.1 Buat file `src/pages/__tests__/LoginPage.test.tsx`
  - [x] 3.2 Mock `useNavigate` dari `react-router-dom`: `vi.mock('react-router-dom', ...)`
  - [x] 3.3 Tulis test `renders_loginPage`: render `<LoginPage />` dan pastikan elemen utama ter-render tanpa crash (smoke test)
  - [x] 3.4 Buat file `src/pages/__tests__/DashboardPage.test.tsx`
  - [x] 3.5 Setup mock untuk React Query: gunakan `QueryClientProvider` dari `test-utils.tsx` atau buat mock `useQuery`
  - [x] 3.6 Mock `useAuth` hook agar mengembalikan user yang sudah login: `vi.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ user: mockUser, isLoading: false }) }))`
  - [x] 3.7 Tulis test `renders_dashboardPage`: render `<DashboardPage />` dan pastikan tidak crash (smoke test)

- [x] 4.0 Implement critical component tests (`src/components`)
  - [x] 4.1 Identifikasi komponen kompleks yang belum ada testnya (misal: komponen attendance scanner, form tambah siswa)
  - [x] 4.2 Buat file test di dalam folder `__tests__/` berdampingan dengan komponen tersebut
  - [x] 4.3 Tulis minimal satu smoke test (`renders_withoutCrashing`) dan satu interaction test per komponen yang diprioritaskan

- [x] 5.0 Verify test coverage & run all tests
  - [x] 5.1 Jalankan `npx vitest run --coverage` dan lihat laporan coverage di terminal
  - [x] 5.2 Buka laporan HTML: `open coverage/index.html` (atau lihat di browser)
  - [x] 5.3 Pastikan coverage keseluruhan `src/` (kecuali `src/components/ui`) minimal **60%** untuk baris (lines)
  - [x] 5.4 Identifikasi file dengan coverage rendah (< 30%) yang penting dan tambahkan test
  - [x] 5.5 Pastikan semua test lulus dengan `npx vitest run` (tidak ada FAIL)
