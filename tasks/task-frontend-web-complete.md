# Task List: Frontend Web - Aplikasi Absensi Siswa SD Berbasis QR Code

## Relevant Files

### Core Components

- `src/components/auth/LoginForm.tsx` - Login form component dengan JWT token handling
- `src/components/auth/PasswordResetForm.tsx` - Form untuk reset password
- `src/components/auth/RoleGuard.tsx` - Component untuk role-based access control
- `src/components/dashboard/Dashboard.tsx` - Main dashboard dengan overview data
- `src/components/dashboard/StatsCard.tsx` - Card untuk menampilkan statistik
- `src/components/dashboard/RecentActivity.tsx` - Component untuk menampilkan aktivitas terbaru
- `src/components/qr/QRScanner.tsx` - Real-time QR code scanner menggunakan html5-qrcode
- `src/components/qr/QRGenerator.tsx` - Generate QR code untuk siswa/kelas
- `src/components/qr/QRPreview.tsx` - Preview QR code sebelum digenerate
- `src/components/attendance/AttendanceForm.tsx` - Form untuk recording attendance (QR + manual)
- `src/components/attendance/AttendanceHistory.tsx` - History attendance siswa
- `src/components/attendance/BulkAttendanceUpload.tsx` - Upload bulk attendance data
- `src/components/attendance/AttendanceStatus.tsx` - Status badge untuk attendance
- `src/components/reports/DailyReportView.tsx` - Daily attendance report
- `src/components/reports/WeeklyReportView.tsx` - Weekly attendance report
- `src/components/reports/MonthlyReportView.tsx` - Monthly attendance report
- `src/components/reports/SemesterReportView.tsx` - Semester attendance report
- `src/components/reports/CustomReportBuilder.tsx` - Custom report dengan filter advanced
- `src/components/reports/ReportExporter.tsx` - Export report ke PDF/Excel/CSV
- `src/components/reports/AttendanceChart.tsx` - Chart menggunakan Recharts
- `src/components/students/StudentList.tsx` - List siswa dengan pagination
- `src/components/students/StudentForm.tsx` - Form CRUD untuk student
- `src/components/students/StudentDetail.tsx` - Detail view siswa
- `src/components/students/BulkStudentImport.tsx` - Import bulk siswa dari Excel
- `src/components/classes/ClassList.tsx` - List kelas
- `src/components/classes/ClassForm.tsx` - Form CRUD untuk class
- `src/components/classes/ClassDetail.tsx` - Detail view kelas
- `src/components/classes/ClassMembers.tsx` - List member dalam kelas
- `src/components/common/Navigation.tsx` - Main navigation/header component
- `src/components/common/Sidebar.tsx` - Sidebar navigation
- `src/components/common/BreadcrumbNav.tsx` - Breadcrumb navigation
- `src/components/common/DataTable.tsx` - Reusable data table component
- `src/components/common/SearchBar.tsx` - Search component dengan autocomplete
- `src/components/common/FilterPanel.tsx` - Advanced filtering panel
- `src/components/common/ExportButton.tsx` - Export data button dengan dropdown options
- `src/components/common/DateRangePicker.tsx` - Date range picker untuk reports
- `src/components/common/LoadingSpinner.tsx` - Loading indicator
- `src/components/common/ErrorBoundary.tsx` - Error boundary component
- `src/components/common/ConfirmDialog.tsx` - Confirmation dialog
- `src/components/common/NotificationToast.tsx` - Toast notification
- `src/components/common/ThemeToggle.tsx` - Dark mode toggle
- `src/components/settings/UserProfile.tsx` - User profile settings
- `src/components/settings/ChangePassword.tsx` - Change password component
- `src/components/settings/SystemSettings.tsx` - System settings untuk admin

### Hooks & Utils

- `src/hooks/useAuth.ts` - Hook untuk authentication logic
- `src/hooks/useAttendance.ts` - Hook untuk attendance operations
- `src/hooks/useQRScanner.ts` - Hook untuk QR scanner logic
- `src/hooks/usePagination.ts` - Hook untuk pagination
- `src/hooks/useFilters.ts` - Hook untuk filter management
- `src/hooks/useDarkMode.ts` - Hook untuk dark mode management
- `src/hooks/useLocalStorage.ts` - Hook untuk local storage management
- `src/hooks/useDebounce.ts` - Hook untuk debouncing
- `src/utils/api.ts` - Axios instance dengan interceptors
- `src/utils/auth.ts` - Auth utilities (token management, JWT decode, etc)
- `src/utils/qrcode.ts` - QR code utilities (generate, validate, decode)
- `src/utils/export.ts` - Export utilities (PDF, Excel, CSV generation)
- `src/utils/formatters.ts` - Data formatters (date, number, percentage)
- `src/utils/validators.ts` - Form validators
- `src/utils/constants.ts` - Application constants
- `src/utils/errorHandler.ts` - Error handling utilities

### Services & API

- `src/services/authService.ts` - Authentication API service
- `src/services/attendanceService.ts` - Attendance API service
- `src/services/studentService.ts` - Student API service
- `src/services/classService.ts` - Class API service
- `src/services/reportService.ts` - Report API service
- `src/services/qrService.ts` - QR code API service

### State Management (React Query)

- `src/queries/useAuthQuery.ts` - Auth related queries dan mutations
- `src/queries/useAttendanceQuery.ts` - Attendance queries dan mutations
- `src/queries/useStudentQuery.ts` - Student queries dan mutations
- `src/queries/useClassQuery.ts` - Class queries dan mutations
- `src/queries/useReportQuery.ts` - Report queries

### Layouts & Pages

- `src/layouts/AuthLayout.tsx` - Layout untuk halaman auth
- `src/layouts/MainLayout.tsx` - Layout untuk halaman utama
- `src/pages/LoginPage.tsx` - Login page
- `src/pages/DashboardPage.tsx` - Dashboard page
- `src/pages/AttendancePage.tsx` - Attendance recording page
- `src/pages/ReportsPage.tsx` - Reports overview page
- `src/pages/StudentsPage.tsx` - Students management page
- `src/pages/ClassesPage.tsx` - Classes management page
- `src/pages/SettingsPage.tsx` - Settings page
- `src/pages/NotFoundPage.tsx` - 404 page
- `src/pages/UnauthorizedPage.tsx` - 403 page

### Configuration & Types

- `src/types/index.ts` - Global type definitions
- `src/types/api.ts` - API response types
- `src/types/auth.ts` - Authentication types
- `src/types/attendance.ts` - Attendance types
- `src/types/student.ts` - Student types
- `src/types/class.ts` - Class types
- `src/types/report.ts` - Report types
- `src/config/api.ts` - API configuration
- `src/config/constants.ts` - Application constants
- `src/config/theme.ts` - Theme configuration

### Styling & Assets

- `src/styles/globals.css` - Global styles
- `src/styles/components.css` - Component styles override
- `src/assets/icons/` - Icon assets
- `src/assets/images/` - Image assets

### Root Files

- `src/App.tsx` - Main App component dengan routing
- `src/main.tsx` - React entry point
- `src/index.css` - Index CSS
- `tailwind.config.ts` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `.env.example` - Environment variables template
- `package.json` - Dependencies dan scripts

### Test Files

- `src/components/auth/__tests__/LoginForm.test.tsx` - Tests untuk LoginForm
- `src/components/qr/__tests__/QRScanner.test.tsx` - Tests untuk QRScanner
- `src/hooks/__tests__/useAuth.test.ts` - Tests untuk useAuth hook
- `src/utils/__tests__/validators.test.ts` - Tests untuk validators
- `src/services/__tests__/attendanceService.test.ts` - Tests untuk attendanceService

### Notes

- Semua components menggunakan shadcn/ui components
- TypeScript strict mode diaktifkan untuk type safety
- Test files ditempatkan berdekatan dengan source files
- Gunakan `bun run test` untuk menjalankan tests
- Gunakan `bun run build` untuk production build
- Gunakan Bun sebagai package manager (bukan npm)

---

## Tasks

- [x] 0.0 Create Feature Branch
  - [x] 0.1 Checkout feature branch baru: `git checkout -b feature/frontend-web-complete`
  - [] 0.2 Push branch ke repository: `git push -u origin feature/frontend-web-complete`

- [ ] 1.0 Project Setup & Dependencies Installation
  - [x] 1.1 Inisialisasi project Vite dengan React + TypeScript menggunakan Bun
  - [x] 1.2 Install core dependencies: react, react-dom, react-router-dom, typescript
  - [x] 1.3 Install state management: @tanstack/react-query
  - [x] 1.4 Install HTTP client: axios
  - [x] 1.5 Install UI & styling: tailwindcss, postcss, autoprefixer
  - [x] 1.6 Setup shadcn/ui components dengan components.json dan lib/utils.ts
  - [x] 1.7 Install QR code libraries: html5-qrcode, qrcode.react
  - [x] 1.8 Install charting library: recharts
  - [x] 1.9 Install export libraries: jspdf, xlsx, papaparse
  - [x] 1.10 Install date utilities: date-fns
  - [x] 1.11 Install form validation: zod, react-hook-form, @hookform/resolvers
  - [x] 1.12 Install additional utilities: jwt-decode, clsx, tailwind-merge, @tailwindcss/postcss, terser
  - [x] 1.13 Configure TypeScript dengan strict mode & path aliases di tsconfig.json
  - [x] 1.14 Setup Tailwind CSS configuration dengan @tailwindcss/postcss dan components.json setup
  - [x] 1.15 Konfigurasi Vite untuk asset optimization & environment variables di vite.config.ts
  - [x] 1.16 Verify project build (bun run build) dan dev server (bun run dev) berjalan lancar

- [ ] 2.0 Authentication System Implementation
  - [ ] 2.1 Buat type definitions untuk auth di src/types/auth.ts (User, AuthToken, LoginRequest, etc)
  - [ ] 2.2 Setup Axios instance dengan interceptor untuk JWT token di src/utils/api.ts
  - [ ] 2.3 Buat auth utility functions di src/utils/auth.ts (setToken, getToken, removeToken, decodeToken, isTokenExpired)
  - [ ] 2.4 Setup Auth Context untuk global auth state di src/contexts/AuthContext.tsx
  - [ ] 2.5 Buat custom hook useAuth() di src/hooks/useAuth.ts untuk mudah akses auth context
  - [ ] 2.6 Buat authService.ts dengan login, logout, refreshToken, getCurrentUser methods
  - [ ] 2.7 Implementasi LoginForm component dengan email/password fields dan form validation
  - [ ] 2.8 Buat RoleGuard component untuk role-based access control
  - [ ] 2.9 Setup PrivateRoute wrapper untuk protected routes
  - [ ] 2.10 Implementasi auto logout ketika token expired
  - [ ] 2.11 Buat PasswordResetForm component dengan email verification
  - [ ] 2.12 Setup refresh token mechanism dengan automatic refresh sebelum expire
  - [ ] 2.13 Implementasi "Remember Me" functionality dengan localStorage
  - [ ] 2.14 Setup error interceptor untuk handle 401 responses

- [ ] 3.0 UI Foundation & Navigation System
  - [ ] 3.1 Setup Tailwind CSS configuration dengan custom colors dan theme di tailwind.config.ts
  - [ ] 3.2 Buat global styles di src/styles/globals.css dengan Tailwind directives
  - [ ] 3.3 Implementasi Navigation header component dengan logo, user menu, logout
  - [ ] 3.4 Buat Sidebar navigation dengan menu items berdasarkan role (guru vs admin)
  - [ ] 3.5 Setup routing structure dengan React Router v6 di src/App.tsx
  - [ ] 3.6 Buat AuthLayout untuk halaman login/register/password reset
  - [ ] 3.7 Buat MainLayout dengan sidebar + header + main content area
  - [ ] 3.8 Implementasi responsive layout (mobile, tablet, desktop) menggunakan Tailwind breakpoints
  - [ ] 3.9 Buat BreadcrumbNav component untuk page navigation tracking
  - [ ] 3.10 Implementasi active menu item highlighting
  - [ ] 3.11 Setup NotFound (404) dan Unauthorized (403) pages
  - [ ] 3.12 Buat mobile hamburger menu untuk sidebar pada layar kecil
  - [ ] 3.13 Implementasi smooth transitions untuk sidebar collapse/expand
  - [ ] 3.14 Setup route structure dengan public dan protected routes

- [ ] 4.0 QR Code Management System
  - [ ] 4.1 Setup html5-qrcode library di src/utils/qrcode.ts dengan QR decoder logic
  - [ ] 4.2 Buat QRScanner component dengan real-time camera capture dan live preview
  - [ ] 4.3 Implementasi camera permission handling dan error states di QRScanner
  - [ ] 4.4 Setup QR code validation untuk student ID dan class code format
  - [ ] 4.5 Buat QRGenerator component menggunakan qrcode.react library
  - [ ] 4.6 Implementasi QR code generation untuk siswa dengan embedded data (ID, name, class)
  - [ ] 4.7 Buat QRPreview component untuk preview sebelum generate/download/print
  - [ ] 4.8 Implementasi batch QR generation untuk seluruh kelas dalam 1 aksi
  - [ ] 4.9 Buat qrService.ts untuk API calls: generate QR, validate QR, get QR history
  - [ ] 4.10 Setup custom hook useQRScanner() untuk reusable QR scanning logic
  - [ ] 4.11 Implementasi error handling untuk invalid QR codes dengan user-friendly messages
  - [ ] 4.12 Implementasi duplicate scan detection untuk prevent recording attendance 2x

- [ ] 5.0 Attendance Recording System
  - [ ] 5.1 Buat type definitions untuk attendance di src/types/attendance.ts (AttendanceRecord, AttendanceStatus, etc)
  - [ ] 5.2 Implementasi AttendanceForm component dengan QR scan input sebagai primary method
  - [ ] 5.3 Buat manual attendance entry method sebagai fallback jika QR gagal scan
  - [ ] 5.4 Implementasi time tracking (check-in time, check-out time, duration)
  - [ ] 5.5 Setup attendance validation (duplicate records, late attendance detection, etc)
  - [ ] 5.6 Buat AttendanceStatus component untuk show present/absent/late/sick status dengan color coding
  - [ ] 5.7 Implementasi real-time attendance updates menggunakan React Query polling
  - [ ] 5.8 Buat attendanceService.ts dengan CRUD operations: recordAttendance, getAttendance, updateAttendance
  - [ ] 5.9 Implementasi bulk attendance upload dari CSV file dengan validation
  - [ ] 5.10 Buat AttendanceHistory component menampilkan attendance records siswa
  - [ ] 5.11 Implementasi confirmation dialog sebelum submit attendance dengan review data
  - [ ] 5.12 Setup attendance reason/notes field untuk absence/late attendance dengan dropdown options
  - [ ] 5.13 Implementasi undo/edit attendance records dengan permission checks dan audit trail

- [ ] 6.0 Advanced Reporting & Analytics
  - [ ] 6.1 Buat type definitions untuk reports di src/types/report.ts (ReportData, ReportMetrics, etc)
  - [ ] 6.2 Implementasi DailyReportView component dengan date picker dan sortable data table
  - [ ] 6.3 Buat WeeklyReportView component dengan week navigation dan week-over-week comparison
  - [ ] 6.4 Implementasi MonthlyReportView component dengan calendar view dan monthly aggregations
  - [ ] 6.5 Buat SemesterReportView component dengan semester selection dan trend analysis
  - [ ] 6.6 Implementasi CustomReportBuilder dengan advanced filters (date range, students, classes, status)
  - [ ] 6.7 Buat report statistics calculation (attendance percentage, tardiness trends, patterns)
  - [ ] 6.8 Implementasi AttendanceChart component menggunakan Recharts (bar, line, pie charts)
  - [ ] 6.9 Buat PDF export functionality menggunakan jsPDF dengan formatted report layout dan branding
  - [ ] 6.10 Implementasi Excel export menggunakan xlsx library dengan multiple sheets
  - [ ] 6.11 Buat CSV export menggunakan papaparse dengan proper formatting dan BOM handling
  - [ ] 6.12 Implementasi report caching di React Query untuk performance optimization
  - [ ] 6.13 Buat ReportExporter component dengan export format options (PDF, Excel, CSV)
  - [ ] 6.14 Setup reportService.ts dengan API calls untuk setiap report type
  - [ ] 6.15 Implementasi print functionality dengan print-optimized layout dan page breaks

- [ ] 7.0 Data Management CRUD Operations
  - [ ] 7.1 Buat type definitions untuk students di src/types/student.ts (Student, CreateStudentDto, etc)
  - [ ] 7.2 Implementasi StudentList component dengan data table dan pagination (20 per page)
  - [ ] 7.3 Buat StudentForm component untuk add/edit student dengan validation rules
  - [ ] 7.4 Implementasi StudentDetail component untuk view detail siswa dan attendance history
  - [ ] 7.5 Buat studentService.ts dengan create, read, update, delete operations
  - [ ] 7.6 Implementasi BulkStudentImport component dengan CSV/Excel upload dan preview before import
  - [ ] 7.7 Buat type definitions untuk classes di src/types/class.ts (Class, CreateClassDto, etc)
  - [ ] 7.8 Implementasi ClassList component dengan data table dan pagination
  - [ ] 7.9 Buat ClassForm component untuk add/edit class dengan validation
  - [ ] 7.10 Implementasi ClassDetail component dengan ClassMembers sub-component showing all students in class
  - [ ] 7.11 Buat classService.ts dengan CRUD operations
  - [ ] 7.12 Implementasi data validation untuk student dan class inputs dengan zod schemas
  - [ ] 7.13 Buat soft delete functionality untuk data preservation dan recovery option
  - [ ] 7.14 Implementasi bulk actions (delete, export, activate/deactivate) untuk students dan classes

- [ ] 8.0 Dashboard & Real-time Features
  - [ ] 8.1 Buat Dashboard component sebagai landing page setelah login
  - [ ] 8.2 Implementasi StatsCard component untuk KPI display (total students, today attendance, pending actions)
  - [ ] 8.3 Buat real-time attendance counter yang auto-refresh setiap 10 detik
  - [ ] 8.4 Implementasi RecentActivity component menampilkan latest 10 attendance records
  - [ ] 8.5 Buat quick action buttons (scan QR, record attendance, view reports) dengan icons
  - [ ] 8.6 Implementasi role-specific dashboard content (teacher vs admin vs principal views)
  - [ ] 8.7 Setup React Query polling dengan proper cache invalidation untuk real-time data
  - [ ] 8.8 Buat attendance trend chart di dashboard menggunakan Recharts line chart
  - [ ] 8.9 Implementasi search functionality untuk quick student/class lookup dengan autocomplete
  - [ ] 8.10 Buat dashboard filters (date range, class, status) dengan apply/reset buttons
  - [ ] 8.11 Implementasi loading states dan skeleton loaders untuk dashboard cards
  - [ ] 8.12 Setup cache invalidation strategies untuk fresh data setelah create/update/delete

- [ ] 9.0 Error Handling & User Feedback System
  - [ ] 9.1 Buat ErrorBoundary component untuk catch React errors dengan error recovery UI
  - [ ] 9.2 Implementasi NotificationToast component dengan success/error/warning/info types
  - [ ] 9.3 Buat errorHandler utility di src/utils/errorHandler.ts untuk standardize error handling
  - [ ] 9.4 Implementasi error messages yang user-friendly dan informatif dengan actionable steps
  - [ ] 9.5 Buat retry mechanisms untuk failed API requests dengan exponential backoff
  - [ ] 9.6 Implementasi ConfirmDialog component untuk destructive actions dengan warning text
  - [ ] 9.7 Setup global error interceptor di Axios untuk consistent error handling
  - [ ] 9.8 Buat LoadingSpinner component dengan spinner animation dan loading text
  - [ ] 9.9 Implementasi form error display dengan field-level validation messages
  - [ ] 9.10 Setup network error handling dan offline mode detection dengan user notification

- [ ] 10.0 Responsive Design & Mobile Optimization
  - [ ] 10.1 Setup Tailwind breakpoints di tailwind.config.ts (mobile, tablet, desktop)
  - [ ] 10.2 Implementasi mobile-first responsive layouts untuk semua pages
  - [ ] 10.3 Buat responsive Navigation header dengan hamburger menu untuk mobile
  - [ ] 10.4 Implementasi responsive Sidebar dengan collapsible option on mobile
  - [ ] 10.5 Buat responsive data tables dengan horizontal scroll fallback untuk mobile
  - [ ] 10.6 Implementasi responsive forms dengan proper spacing dan touch-friendly inputs
  - [ ] 10.7 Test semua components di mobile (320px), tablet (768px), desktop (1024px), dan large desktop (1440px) viewports
  - [ ] 10.8 Buat responsive grid layouts untuk dashboard cards dengan proper wrapping
  - [ ] 10.9 Implementasi responsive modals dan dialogs dengan proper sizing
  - [ ] 10.10 Setup viewport meta tags dan responsive CSS di index.html
  - [ ] 10.11 Optimasi QR scanner untuk mobile devices dengan proper camera handling

- [ ] 11.0 Dark Mode Implementation
  - [ ] 11.1 Setup dark mode support di tailwind.config.ts dengan class strategy
  - [ ] 11.2 Buat theme configuration di src/config/theme.ts dengan light/dark color schemes
  - [ ] 11.3 Implementasi ThemeToggle component di Navigation header untuk switch between modes
  - [ ] 11.4 Buat useDarkMode hook di src/hooks/useDarkMode.ts untuk theme management
  - [ ] 11.5 Setup localStorage persistence untuk dark mode preference dengan auto-detect system preference
  - [ ] 11.6 Implementasi system preference detection (prefers-color-scheme media query)
  - [ ] 11.7 Update semua shadcn/ui components untuk proper dark mode styling consistency
  - [ ] 11.8 Test dark mode across semua pages dan components untuk consistency
  - [ ] 11.9 Ensure proper contrast ratios dalam dark mode untuk accessibility

- [ ] 12.0 Performance Optimization
  - [ ] 12.1 Implementasi code splitting dengan React.lazy() untuk route-based lazy loading
  - [ ] 12.2 Setup React Query dengan proper cache configurations dan stale time settings
  - [ ] 12.3 Optimasi API calls dengan debouncing untuk search dan filters
  - [ ] 12.4 Implementasi pagination untuk large datasets di StudentList dan reports
  - [ ] 12.5 Buat useMemo dan useCallback untuk prevent unnecessary re-renders dalam expensive components
  - [ ] 12.6 Setup image optimization dan lazy loading untuk assets
  - [ ] 12.7 Implementasi virtual scrolling untuk long lists menggunakan windowing techniques
  - [ ] 12.8 Optimize bundle size dengan tree-shaking dan production build
  - [ ] 12.9 Setup performance monitoring dengan Lighthouse scores
  - [ ] 12.10 Implementasi request batching untuk multiple API calls

- [ ] 13.0 Testing & Quality Assurance
  - [ ] 13.1 Setup Bun test runner configuration di package.json dan vitest.config.ts
  - [ ] 13.2 Buat test utilities dan custom render function di src/utils/test-utils.tsx
  - [ ] 13.3 Write unit tests untuk LoginForm component (mounting, input validation, form submission)
  - [ ] 13.4 Write unit tests untuk useAuth hook (login, logout, token refresh scenarios)
  - [ ] 13.5 Write unit tests untuk validators utility functions dengan various input scenarios
  - [ ] 13.6 Write unit tests untuk QRScanner component (camera, error handling, validation)
  - [ ] 13.7 Write unit tests untuk AttendanceForm component (QR input, manual entry, validation)
  - [ ] 13.8 Write integration tests untuk authentication flow (login to dashboard navigation)
  - [ ] 13.9 Write tests untuk API error handling dan retry mechanisms
  - [ ] 13.10 Setup coverage reporting dengan Bun coverage untuk target minimal 70% code coverage

- [ ] 14.0 Documentation & Code Quality
  - [ ] 14.1 Buat comprehensive README.md dengan setup instructions, features, tech stack overview
  - [ ] 14.2 Dokumentasi environment variables template di .env.example dengan descriptions
  - [ ] 14.3 Buat ARCHITECTURE.md menjelaskan project structure dan design patterns
  - [ ] 14.4 Dokumentasi API endpoints dan integration points di docs/API.md
  - [ ] 14.5 Buat USER_GUIDE.md untuk end-users menjelaskan fitur dan cara penggunaan
  - [ ] 14.6 Dokumentasi development setup dan local development process dengan troubleshooting
  - [ ] 14.7 Buat COMPONENT_GUIDE.md mendokumentasikan reusable components dan usage examples
  - [ ] 14.8 Dokumentasi troubleshooting guide dan common issues dengan solutions

- [ ] 15.0 Deployment & Final Checks
  - [ ] 15.1 Setup production build configuration di vite.config.ts dengan optimization
  - [ ] 15.2 Konfigurasi environment variables untuk production (API endpoint, timeout settings)
  - [ ] 15.3 Test production build locally: `bun run build && bun run preview`
  - [ ] 15.4 Optimasi bundle size dan check untuk unused dependencies dengan analysis
  - [ ] 15.5 Setup deployment CI/CD pipeline configuration (GitHub Actions/GitLab CI)
  - [ ] 15.6 Test seluruh features di production environment dengan production API
  - [ ] 15.7 Setup security checks (CORS, headers, input validation, XSS protection)
  - [ ] 15.8 Dokumentasi deployment instructions di DEPLOYMENT.md dengan step-by-step guide
  - [ ] 15.9 Setup monitoring dan error tracking (Sentry integration atau similar)
  - [ ] 15.10 Final code review dan merge feature branch ke main dengan changelog

---

## Summary & Implementation Estimates

### Total Tasks: 152 sub-tasks across 15 parent tasks

### Estimated Timeline:

- Phase 1 (Core Setup + Auth + UI): 1 week (Tasks 0-3)
- Phase 2 (QR + Attendance + Reporting): 1.5 weeks (Tasks 4-6)
- Phase 3 (Data Management + Dashboard): 1 week (Tasks 7-8)
- Phase 4 (Polish + Testing + Deploy): 1 week (Tasks 9-15)

**Total: ~4-5 weeks** untuk complete implementation dengan quality

### Key Technologies:

✅ React 18 + Vite + TypeScript
✅ shadcn/ui + Tailwind CSS
✅ React Router v6 + React Query
✅ Axios dengan JWT interceptor
✅ html5-qrcode + qrcode.react
✅ Recharts untuk visualization
✅ jsPDF + xlsx + papaparse untuk export
✅ Bun package manager
✅ Dark mode support
✅ Responsive design (mobile-first)

### Next Steps:

1. Start dengan Task 0.0 - Create feature branch
2. Proceed sequentially melalui setiap task
3. Check off `- [ ]` → `- [x]` setiap menyelesaikan sub-task
4. Commit regularly dengan meaningful commit messages
5. Test incrementally sambil developing

---

**File ini ready untuk langsung digunakan sebagai development roadmap!**
