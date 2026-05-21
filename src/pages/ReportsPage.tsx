import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyReportView from "@/components/reports/DailyReportView";
import MonthlyReportView from "@/components/reports/MonthlyReportView";
import SemesterReportView from "@/components/reports/SemesterReportView";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<string>("harian");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Laporan Kehadiran</h1>
        <p className="text-muted-foreground">Lihat dan unduh laporan kehadiran siswa</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 p-1">
          <TabsTrigger value="harian">Harian</TabsTrigger>
          <TabsTrigger value="bulanan">Bulanan</TabsTrigger>
          <TabsTrigger value="semesteran">Semesteran</TabsTrigger>
        </TabsList>
        
        <TabsContent value="harian" className="mt-6 border-none p-0 outline-none">
          <DailyReportView />
        </TabsContent>
        
        <TabsContent value="bulanan" className="mt-6 border-none p-0 outline-none">
          <MonthlyReportView />
        </TabsContent>
        
        <TabsContent value="semesteran" className="mt-6 border-none p-0 outline-none">
          <SemesterReportView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
