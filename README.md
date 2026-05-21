# Al Hikmah Attendance Web Frontend

A modern web application for managing student attendance, built with React, Vite, and Shadcn UI.

## Features

- **RBAC Authentication**: Secure login with role-based access control (Admin, Teacher, Operator)
- **Dashboard**: Overview of daily attendance and system metrics
- **Attendance Management**: QR code scanning and bulk manual attendance
- **Class & Student Management**: Full CRUD capabilities with CSV import/export
- **Reporting**: Daily, monthly, and semester reports with export to Excel/PDF
- **PWA Ready**: Can be installed on mobile devices for offline access
- **Dark Mode**: Supports light, dark, and system themes
- **Responsive Design**: Mobile-first UI using Tailwind CSS

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (Radix UI)
- **Routing**: React Router v6
- **State Management & Fetching**: React Query, Zustand
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, React Testing Library

## Prerequisites

- Node.js >= 18.x
- Bun package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and update the values:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_APP_NAME="Al Hikmah Attendance"
   VITE_ENVIRONMENT=development
   ```

## Running Locally

To start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

## Testing

Run unit tests with Vitest:

```bash
bun run test
```

For coverage report:

```bash
bun run test:coverage
```

## Build & Deployment

To build the application for production:

```bash
bun run build
```

The output will be in the `dist` directory, which can be deployed to any static hosting provider (e.g., Vercel, Netlify, Nginx).

### Deployment on Nginx (Example)

1. Build the app (`bun run build`)
2. Copy `dist` folder to `/var/www/alhikmah-web`
3. Configure Nginx:
   ```nginx
   server {
       listen 80;
       server_name attendance.alhikmah.sch.id;
       root /var/www/alhikmah-web;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## License

Copyright © 2026 SDIT Al Hikmah. All rights reserved.
