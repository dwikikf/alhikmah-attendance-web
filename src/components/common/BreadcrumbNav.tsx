// BreadcrumbNav Component - Page navigation tracking

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

/** Map of path segments to display labels */
const pathLabels: Record<string, string> = {
  "": "Dashboard",
  attendance: "Absensi",
  students: "Siswa",
  classes: "Kelas",
  reports: "Laporan",
  settings: "Pengaturan",
  profile: "Profil",
  add: "Tambah",
  edit: "Edit",
  detail: "Detail",
  "not-found": "Tidak Ditemukan",
  unauthorized: "Akses Ditolak",
};

interface BreadcrumbNavProps {
  className?: string;
  /** Custom breadcrumb items to override auto-detection */
  customItems?: Array<{ label: string; path?: string }>;
}

export default function BreadcrumbNav({
  className,
  customItems,
}: BreadcrumbNavProps) {
  const location = useLocation();

  // Build breadcrumb items from current path
  const items = customItems || buildBreadcrumbs(location.pathname);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-4", className)}
      id="breadcrumb-nav"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}

              {isLast || !item.path ? (
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-500 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function buildBreadcrumbs(
  pathname: string,
): Array<{ label: string; path: string }> {
  const segments = pathname.split("/").filter(Boolean);

  // Always start with Dashboard
  const breadcrumbs: Array<{ label: string; path: string }> = [
    { label: "Dashboard", path: "/" },
  ];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = pathLabels[segment] || decodeURIComponent(segment);
    breadcrumbs.push({ label, path: currentPath });
  }

  return breadcrumbs;
}
