## Relevant Files

- `src/components/StudentCSVImportDialog.tsx` - Frontend component for the import dialog.
- `src/components/StudentCSVImportDialog.test.tsx` - Unit tests for the import dialog.
- `src/services/api/studentService.ts` - Frontend service to communicate with the import backend endpoint.
- `src/pages/api/students/import.ts` - (Or corresponding backend handler) API route to handle file upload and DB transactions.
- `src/utils/csv.ts` - Utility to generate sample CSV and parse uploaded CSV data.
- `src/utils/csv.test.ts` - Unit tests for CSV utilities.

### Notes

- Unit tests should typically be placed alongside the code files they are testing.
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

- [x] 0.0 Create feature branches
  - [x] 0.1 Create and checkout a new branch `feature/student-csv-import` in `alhikmah-attendance-api`
  - [x] 0.2 Create and checkout a new branch `feature/student-csv-import` in `alhikmah-attendance-web`

- [x] 1.0 Create API Endpoint for CSV Upload
  - [x] 1.1 Add route definition for student CSV import
  - [x] 1.2 Implement file upload handling middleware (e.g., to process `multipart/form-data`)
  - [x] 1.3 Validate request body to ensure `class_id` and `class_name` are provided along with the file
  - [x] 1.4 Write unit test for the endpoint request validation logic

- [x] 2.0 Implement Backend Import Logic (DB Transaction & Role Validation)
  - [x] 2.1 Parse the uploaded CSV file to extract `nisn`, `nama siswa`, and `gender`
  - [x] 2.2 Validate parsed CSV data format and required fields
  - [x] 2.3 Implement database transaction block for inserting students
  - [x] 2.4 Inside transaction: generate `uuid` for each student record, assign the `class_id`, and save to DB
  - [x] 2.5 Commit transaction on success, or rollback and return a detailed error on failure
  - [x] 2.6 Write unit tests for the CSV parsing and DB transaction logic

- [x] 3.0 Build Frontend CSV Import Dialog (Class Dropdown & UI)
  - [x] 3.1 Create a new UI component `StudentCSVImportDialog`
  - [x] 3.2 Add a dropdown menu for selecting the class
  - [x] 3.3 Implement logic to fetch/filter classes based on user role (`admin` sees all classes, `teacher` sees their assigned classes)
  - [x] 3.4 Add a file input area for selecting the `.csv` file
  - [x] 3.5 Add an "Import" submit button with a loading state

- [x] 4.0 Implement Sample CSV Download Feature
  - [x] 4.1 Create a utility function to generate the sample CSV format (columns: `nisn`, `nama siswa`, `gender`)
  - [x] 4.2 Add a "Download Template" button in the `StudentCSVImportDialog`
  - [x] 4.3 Trigger the sample CSV file download on button click

- [x] 5.0 Connect Frontend to API and Handle Import Flow
  - [x] 5.1 Implement form submission handler to post the file and selected class data to the import endpoint
  - [x] 5.2 Add success notification/toast upon a successful import
  - [x] 5.3 Handle and display API errors (e.g., invalid CSV format, DB error) gracefully to the user
  - [x] 5.4 Refresh the main students list after a successful import and close the dialog
