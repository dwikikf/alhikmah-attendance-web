import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/common/Navigation";
import { AppSidebar } from "@/components/common/Sidebar";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function MainLayout() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/30">
        {/* Navigation Header */}
        <Navigation />

        {/* Main Content */}
        <div
          id="main-content"
          className="flex flex-1 flex-col p-4 md:p-6 lg:p-8"
        >
          {/* Offline Banner */}
          {isOffline && (
            <div className="mb-4 rounded-md bg-amber-500 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m2 2 20 20" />
                <path d="M8.53 8.53a9.23 9.23 0 0 1 11.23 2.11" />
                <path d="M12.92 12.92a4.97 4.97 0 0 1 3.51 1.08" />
                <path d="M4.66 4.66a9.23 9.23 0 0 0-.42 14.65" />
                <path d="M7.74 7.74a4.97 4.97 0 0 0-1.42 8.42" />
                <path d="M10.82 10.82a1 1 0 0 0-1.42 1.42" />
              </svg>
              Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.
            </div>
          )}

          {/* Breadcrumb */}
          <div className="mb-4">
            <BreadcrumbNav />
          </div>

          {/* Page content */}
          <div className="flex-1 page-enter">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
