import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

const chartConfig = {
  hadir: {
    label: "Hadir",
    color: "hsl(var(--chart-2))", // emerald
  },
  izin: {
    label: "Izin",
    color: "hsl(var(--chart-1))", // blue
  },
  sakit: {
    label: "Sakit",
    color: "hsl(var(--chart-3))", // amber
  },
  tanpa_keterangan: {
    label: "Alpa",
    color: "hsl(var(--chart-4))", // red
  },
} satisfies ChartConfig;

interface AttendanceChartProps {
  data: any[];
  type?: "bar" | "line";
  xAxisKey?: string;
  height?: number;
}

export default function AttendanceChart({ 
  data, 
  type = "bar", 
  xAxisKey = "date",
  height = 300 
}: AttendanceChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center border border-dashed rounded-lg bg-muted/10 text-muted-foreground"
        style={{ height }}
      >
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisKey} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              fontSize={12}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              fontSize={12}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="hadir" stackId="a" fill="var(--color-hadir)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="izin" stackId="a" fill="var(--color-izin)" />
            <Bar dataKey="sakit" stackId="a" fill="var(--color-sakit)" />
            <Bar dataKey="tanpa_keterangan" stackId="a" fill="var(--color-tanpa_keterangan)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisKey} 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              fontSize={12}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={10} 
              fontSize={12}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="hadir" stroke="var(--color-hadir)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="izin" stroke="var(--color-izin)" strokeWidth={2} />
            <Line type="monotone" dataKey="sakit" stroke="var(--color-sakit)" strokeWidth={2} />
            <Line type="monotone" dataKey="tanpa_keterangan" stroke="var(--color-tanpa_keterangan)" strokeWidth={2} />
          </LineChart>
        )}
      </ChartContainer>
    </div>
  );
}
