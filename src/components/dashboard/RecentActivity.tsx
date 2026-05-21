import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceStatusBadge from "@/components/attendance/AttendanceStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AttendanceRecord } from "@/types";
import { QrCode, Keyboard } from "lucide-react";

interface RecentActivityProps {
  records?: AttendanceRecord[];
  isLoading?: boolean;
}

export default function RecentActivity({ records, isLoading }: RecentActivityProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Aktivitas Terkini</CardTitle>
        <CardDescription>Scan kehadiran terakhir hari ini</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : !records || records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <p>Belum ada aktivitas hari ini</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {records.map((record) => (
                <div key={record.id} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-muted rounded-full p-2">
                      {record.is_manual ? (
                        <Keyboard className="h-4 w-4 text-blue-500" />
                      ) : (
                        <QrCode className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{record.student_name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-xs text-muted-foreground">Kelas {record.class_name}</p>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(record.scanned_at || record.recorded_at), "HH:mm", { locale: idLocale })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <AttendanceStatusBadge status={record.status} size="sm" />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
