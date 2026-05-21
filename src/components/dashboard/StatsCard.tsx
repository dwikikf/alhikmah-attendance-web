import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  isLoading = false,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-md bg-emerald-50 p-2">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            
            {(description || trend) && (
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                {trend && (
                  <span className={cn(
                    "font-medium",
                    trend.positive ? "text-emerald-600" : "text-red-600"
                  )}>
                    {trend.positive ? "+" : ""}{trend.value}%
                  </span>
                )}
                {trend ? trend.label : description}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
