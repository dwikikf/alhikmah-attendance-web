import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus as AttendanceStatusType } from "@/types/attendance";
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_COLORS,
} from "@/types/attendance";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatusType;
  size?: "sm" | "default";
}

export default function AttendanceStatusBadge({
  status,
  size = "default",
}: AttendanceStatusBadgeProps) {
  const colors = ATTENDANCE_STATUS_COLORS[status] || {
    bg: "bg-gray-50 dark:bg-gray-950/30",
    text: "text-gray-700 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-800",
  };
  const label = status ? (ATTENDANCE_STATUS_LABELS[status] || status) : "-";

  return (
    <Badge
      variant="outline"
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        size === "sm" && "h-4 px-1.5 text-[0.65rem]"
      )}
    >
      {label}
    </Badge>
  );
}

export { AttendanceStatusBadge };
export type { AttendanceStatusBadgeProps };
