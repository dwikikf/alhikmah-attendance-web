import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceChart from "@/components/reports/AttendanceChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface AttendanceTrendChartProps {
  data?: any[];
  isLoading?: boolean;
}

export default function AttendanceTrendChart({
  data,
  isLoading,
}: AttendanceTrendChartProps) {
  const [timeRange, setTimeRange] = useState("7days");

  // In a real app, changing the time range would trigger a refetch or filter the data
  // For this component, we'll just mock the behavior by displaying what's passed in

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div>
          <CardTitle className="text-lg">Tren Kehadiran</CardTitle>
          <CardDescription>
            Persentase kehadiran berdasarkan waktu
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(val) => setTimeRange(val || "7days")}
        >
          <SelectTrigger className="w-32.5 h-8 text-xs">
            <SelectValue placeholder="Pilih Waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Hari Terakhir</SelectItem>
            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
            <SelectItem value="semester">Semester Ini</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="w-full h-75 flex items-center justify-center">
            <Skeleton className="w-full h-62.5 rounded-lg" />
          </div>
        ) : (
          <AttendanceChart
            data={data || []}
            type="line"
            xAxisKey="date"
            height={300}
          />
        )}
      </CardContent>
    </Card>
  );
}
