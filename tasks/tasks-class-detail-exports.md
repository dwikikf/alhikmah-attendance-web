## Relevant Files

- `src/app/classes/[id]/page.tsx` - Class detail page to add export buttons
- `src/app/api/classes/[id]/export/pdf/route.ts` - API route for QR Code PDF generation
- `src/app/api/classes/[id]/export/excel/route.ts` - API route for Excel export
- `src/components/ExportButtons.tsx` - Component for export actions

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch
- [ ] 1.0 Implement QR Code generation and PDF export
- [ ] 2.0 Implement Excel export for class details
- [ ] 3.0 Update UI on class detail page to add export buttons
- [ ] 4.0 Test export functionality
