## Relevant Files

- `src/components/dashboard/index.tsx` (or relevant dashboard files) - Update recent activity, attendance trend, and profile.
- `src/pages/Users/index.tsx` - Main page for Users CRUD (Admin).
- `src/components/users/UserForm.tsx` - Form for adding/editing users.
- `src/pages/Classes/index.tsx` (and related form component) - Update homeroom teacher dropdown.
- `src/pages/Students/index.tsx` - Data table updates to include Class and Gender.
- `src/components/students/StudentForm.tsx` - Fix edit form submission behavior.
- `src/components/students/StudentDetail.tsx` - Add Class and Gender fields.
- `src/pages/Reports/index.tsx` - Role-based class dropdown and fix monthly report datatable error.
- `src/services/api.ts` (or relevant API files) - Ensure endpoints for dashboard, users, classes, students, and reports are correctly set up.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

- [ ] 0.0 Create feature branch
  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/dashboard-and-crud-updates`)
- [ ] 1.0 Update Dashboard Features (Recent activity, Attendance trend, My profile)
  - [ ] 1.1 Integrate API to fetch real "recent activity" data and display it.
  - [ ] 1.2 Integrate API to fetch real "attendance trend" data.
  - [ ] 1.3 Add options to filter attendance trend by 7 days, 30 days, or semester.
  - [ ] 1.4 Update "My Profile" section to dynamically display the logged-in user's profile (name, role: teacher/admin).
- [ ] 2.0 Implement Users CRUD (Admin only)
  - [ ] 2.1 Create the Users list page with a data table displaying user information.
  - [ ] 2.2 Create a form component for adding new users (fields: name, username, password, role).
  - [ ] 2.3 Create a form component for editing existing users.
  - [ ] 2.4 Implement delete functionality for users with a confirmation dialog.
  - [ ] 2.5 Integrate frontend CRUD operations with the corresponding backend API endpoints.
- [ ] 3.0 Fix Classes Page (Add class form homeroom teacher dropdown)
  - [ ] 3.1 Modify the "add class" form component to fetch the list of users with the 'teacher' role.
  - [ ] 3.2 Update the dropdown to display the teacher's name as the label and use their user ID as the value.
  - [ ] 3.3 Ensure the form payload correctly sends the selected teacher's ID when submitting.
- [ ] 4.0 Fix Student Page (Edit form save behavior, Data table and detail fields)
  - [ ] 4.1 Debug and fix the student "edit data" form to update the existing record (PUT/PATCH) instead of creating a new one.
  - [ ] 4.2 Update the student data table columns to include "Class" (kelas) and "Gender" (jenis kelamin).
  - [ ] 4.3 Update the student detail view component to ensure "Class" and "Gender" fields are visible and populated correctly.
- [ ] 5.0 Update Report Page (Class dropdown filtering by role, Fix monthly report error)
  - [ ] 5.1 Modify the class dropdown on the report page to fetch data from the classes API.
  - [ ] 5.2 Implement role-based logic: Admins see all classes, Teachers only see classes assigned to them.
  - [ ] 5.3 Investigate and resolve the "data table length error" occurring specifically on the monthly report view.
  - [ ] 5.4 Ensure proper state management when switching between different classes and report types.
