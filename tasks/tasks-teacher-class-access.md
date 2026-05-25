## Relevant Files

- `src/middleware.ts` - Update route protection to allow teacher role access to classes
- `src/components/Sidebar.tsx` - Update navigation menu to show classes for teachers
- `src/app/classes/page.tsx` - Ensure teacher can view and interact with the classes page

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
- [ ] 1.0 Update route and API access control for teacher role
- [ ] 2.0 Update navigation UI for teachers
- [ ] 3.0 Verify teacher access to classes
