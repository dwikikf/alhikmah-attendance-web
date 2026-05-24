import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AttendanceChart from "@/components/reports/AttendanceChart";

interface AttendanceTrendChartProps {
  data?: any[];
  isLoading?: boolean;
  timeRange: number;
  onTimeRangeChange: (val: number) => void;
}

export default function AttendanceTrendChart({
  data,
  isLoading,
  timeRange,
  onTimeRangeChange,
}: AttendanceTrendChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div>
          <CardTitle className="text-lg">Tren Kehadiran</CardTitle>
          <CardDescription>
            Persentase kehadiran berdasarkan waktu
          </CardDescription>
        </div>
        <div>
          <Select value={timeRange.toString()} onValueChange={(v) => onTimeRangeChange(parseInt(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih Rentang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Hari Terakhir</SelectItem>
              <SelectItem value="30">30 Hari Terakhir</SelectItem>
              <SelectItem value="180">Semester (180 Hari)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
