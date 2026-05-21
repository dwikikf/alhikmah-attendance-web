import api from "@/utils/api";
import type { ExportRequest } from "@/types";
import { toast } from "sonner";

/**
 * Request a report export from the API and trigger download
 */
export const exportReport = async (payload: ExportRequest, filename: string) => {
  try {
    const res = await api.post("/reports/export", payload, {
      responseType: "blob", // Important for receiving binary data
    });

    // Create a blob URL and trigger download
    const blob = new Blob([res.data], { 
      type: payload.format === 'pdf' ? 'application/pdf' : 
            payload.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 
            'text/csv' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Set appropriate extension based on format
    const extension = payload.format === 'excel' ? 'xlsx' : payload.format;
    link.setAttribute("download", `${filename}.${extension}`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Gagal mengunduh laporan");
    return false;
  }
};
