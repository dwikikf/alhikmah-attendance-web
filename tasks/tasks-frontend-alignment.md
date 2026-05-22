## Relevant Files

- `src/types/class.ts` - Update `ClassDetail` interface to reflect separation of class data and student data.
- `src/services/studentService.ts` - Add missing `getClassStudents` service call.
- `src/queries/useStudentQuery.ts` - Add `useClassStudents` query hook.
- `src/components/classes/ClassDetail.tsx` - Update to use the separate `useClassStudents` query to populate the student table.
- `src/components/students/StudentDetail.tsx` - Update to use backend QR code download endpoint.
- `src/services/attendanceService.ts` - Remove redundant `getStudentAttendance` function.
- `src/services/reportService.ts` - Consolidate student report fetching here.

### Notes

- The backend `GET /classes/:id` does **not** return the `students` array to avoid large payloads. You must fetch `GET /classes/:id/students` separately.
- While the frontend generates QR codes locally for UI display, the backend provides `GET /students/:id/qrcode` returning an image Blob. This should be used for the "Download QR" or "Export" functionality to ensure consistency.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/frontend-backend-alignment`)
- [x] 1.0 Class Details Alignment
  - [x] 1.1 Update `src/services/studentService.ts` to include `getClassStudents(classId)` pointing to `GET /classes/:class_id/students`
  - [x] 1.2 Create `useClassStudents(classId)` in `src/queries/useStudentQuery.ts`
  - [x] 1.3 Update `src/components/classes/ClassDetail.tsx` to fetch class data and student data separately, combining them for the view
- [x] 2.0 QR Code Download Alignment
  - [x] 2.1 Update QR code UI components (e.g., `StudentDetail.tsx` or related download buttons) to utilize the `getStudentQRCode(id)` service for downloading the QR image Blob
- [x] 3.0 Service Cleanup
  - [x] 3.1 Remove the redundant `getStudentAttendance` from `src/services/attendanceService.ts`
  - [x] 3.2 Ensure any component needing student history uses `getStudentReport` from `src/services/reportService.ts`
