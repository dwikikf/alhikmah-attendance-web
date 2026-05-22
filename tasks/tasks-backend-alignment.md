## Relevant Files

- `alhikmah-attendance-api/migrations/[timestamp]_update_schema_for_frontend.up.sql` - Database migration for roles and password reset.
- `alhikmah-attendance-api/pkg/jwt/jwt.go` - Adjust JWT claims (`sub`, `email`, `name`, `role`).
- `alhikmah-attendance-api/internal/handler/auth.go` - Update login payload, refresh route, and add password reset endpoints.
- `alhikmah-attendance-api/internal/handler/user_handler.go` - Update role logic and user payload structure.
- `alhikmah-attendance-api/internal/handler/attendance_handler.go` - Rename QR scan endpoint and add attendance update endpoint.
- `alhikmah-attendance-api/internal/service/attendance_service.go` - Implement logic for fetching `old_status` on attendance update.
- `alhikmah-attendance-api/internal/handler/student_handler.go` - Add student update and QR code download endpoints.
- `alhikmah-attendance-api/internal/handler/report_handler.go` - Add student report and export endpoints.
- `alhikmah-attendance-api/cmd/api/main.go` - Update route definitions to match frontend expectations.

### Notes

- The frontend expects specific structures for paginated responses (`page`, `pageSize`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage`). Ensure the backend helper functions are updated globally.
- The JWT payload must strictly use `sub` for user ID to match frontend expectations.
- Ensure all API responses are wrapped in `{ success, data, message }`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/backend-frontend-alignment`)
- [ ] 1.0 Database Schema & Migration Updates
  - [ ] 1.1 Create migration to update `user_role` enum: rename `guru` to `teacher`, add `principal`
  - [ ] 1.2 Create migration to add `password_reset_token` and `reset_token_expires` to `users` table
  - [ ] 1.3 Apply the new database migrations
- [ ] 2.0 Core Response & Pagination Alignment
  - [ ] 2.1 Update standard response format in handlers to strictly use `success`, `data`, and `message` structure
  - [ ] 2.2 Update pagination meta format to use `page`, `pageSize`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage` instead of `limit`, `total`, `total_pages`
  - [ ] 2.3 Refactor existing paginated responses in all handlers (users, classes, students) to use the new pagination structure
- [ ] 3.0 Authentication & Auth Flow Alignment
  - [ ] 3.1 Update JWT Payload in `pkg/jwt/jwt.go` to use `sub`, `email`, `name`, `role` (frontend expected keys)
  - [ ] 3.2 Update `/auth/login` handler to return `{ data: { token, refresh_token, user: { ... } } }`
  - [ ] 3.3 Change refresh token endpoint path from `POST /auth/refresh` to `POST /auth/refresh-token`
  - [ ] 3.4 Implement `POST /auth/reset-password` endpoint
  - [ ] 3.5 Implement `POST /auth/reset-password/confirm` endpoint
  - [ ] 3.6 Implement `POST /auth/reset-password/change` endpoint
- [ ] 4.0 User & Role Management Alignment
  - [ ] 4.1 Update `User` model mapping to ensure `full_name` is correctly returned in JSON
  - [ ] 4.2 Update Role restrictions in `middleware/auth.go` to handle `admin`, `teacher`, and `principal`
- [ ] 5.0 Attendance Endpoints Alignment
  - [ ] 5.1 Rename QR scan endpoint in router from `POST /attendances/scan` to `POST /attendances/qr-scan`
  - [ ] 5.2 Create `PUT /attendances/{attendance_id}` endpoint handler for updating attendance status
  - [ ] 5.3 Implement `UpdateAttendance` logic in service layer to accurately fetch `old_status` before logging to audit table
- [ ] 6.0 Students Endpoints Alignment
  - [ ] 6.1 Create `PUT /students/{id}` endpoint and service method to update student details
  - [ ] 6.2 Create `GET /students/{id}/qrcode` endpoint to generate and return the QR code as an image Blob
- [ ] 7.0 Reports & Export Features
  - [ ] 7.1 Create `GET /reports/student/{student_id}` endpoint to fetch attendance history for a specific student
  - [ ] 7.2 Create `POST /reports/export` endpoint to generate and return exported reports as a Blob (CSV/Excel/PDF)
- [ ] 8.0 Testing & Final Verification
  - [ ] 8.1 Test the new login and JWT generation flow
  - [ ] 8.2 Verify pagination structure across all list endpoints
  - [ ] 8.3 Verify new endpoints (student update, attendance update, export) via Postman or curl
