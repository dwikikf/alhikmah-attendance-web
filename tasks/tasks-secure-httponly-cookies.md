## Relevant Files

- `../alhikmah-attendance-api/internal/handler/auth.go` - Backend handler for login and refresh token.
- `src/utils/auth.ts` - Frontend utility for token management.
- `src/utils/api.ts` - Frontend axios instance and interceptors.
- `src/hooks/useAuth.ts` - Frontend context for checking authentication.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 `git checkout -b feature/secure-httponly-cookies` di repositori API
  - [x] 0.2 `git checkout -b feature/secure-httponly-cookies` di repositori Web
- [x] 1.0 Update Backend API to Use HttpOnly Cookies
  - [x] 1.1 Tambahkan variabel `APP_ENV` (development/production) ke file konfigurasi dan parser di `config/config.go`
  - [x] 1.2 Ubah `AuthHandler.Login` agar mengatur *Refresh Token* ke dalam `HttpOnly Cookie` (dengan logika `Secure` dan `SameSite` yang dinamis berdasarkan `APP_ENV`).
  - [x] 1.3 Ubah `AuthHandler.Login` agar hanya mengembalikan *Access Token* dan data *User* di body JSON respons.
  - [x] 1.4 Ubah `AuthHandler.Refresh` agar mengambil *Refresh Token* dari *Cookie* alih-alih dari body JSON.
  - [x] 1.5 Tambahkan fungsi hapus *Cookie* (menyetel masa aktif negatif) pada `AuthHandler.Logout`.
  - [x] 1.6 Pastikan konfigurasi CORS di `cmd/api/main.go` mengizinkan pengiriman *credentials* (Cookie).
- [x] 2.0 Refactor Frontend Token Management
  - [x] 2.1 Hapus logika penyimpanan dan pengambilan `refreshToken` dari `localStorage` di `src/utils/auth.ts`.
  - [x] 2.2 Pastikan `getAccessToken` dan `setAccessToken` tetap ada, namun hanya digunakan di memori aplikasi jika memungkinkan, atau minimal `refreshToken` sudah sepenuhnya dibersihkan dari *storage*.
- [x] 3.0 Refactor Frontend Axios Interceptor
  - [x] 3.1 Ubah instance Axios di `src/utils/api.ts` agar menyertakan `withCredentials: true` secara bawaan supaya *cookie* selalu dikirim ke *backend*.
  - [x] 3.2 Ubah fungsi `refreshTokenSilently` agar tidak lagi mengirim *refresh token* via body JSON, melainkan mengandalkan *cookie* yang dikirim otomatis.
- [x] 4.0 Test and Verify Authentication Flow
  - [x] 4.1 Lakukan pengujian proses Login (pastikan Set-Cookie muncul di tab Network).
  - [x] 4.2 Lakukan pengujian proses navigasi / muat ulang halaman (pastikan *interceptor* berhasil memanggil endpoint refresh dan mendapatkan *Access Token* baru).
  - [x] 4.3 Lakukan pengujian proses Logout (pastikan *cookie* terhapus dari *browser*).
