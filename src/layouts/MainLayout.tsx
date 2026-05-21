// MainLayout - Layout with sidebar + header + main content area

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/common/Navigation";
import Sidebar from "@/components/common/Sidebar";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { cn } from "@/lib/utils";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Navigation Header */}
      <Navigation
        onMenuToggle={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-[var(--header-height)] transition-all duration-300",
          "lg:ml-[var(--sidebar-width)]",
        )}
        id="main-content"
      >
        <div className="p-4 md:p-6 lg:p-8">
          {/* Breadcrumb */}
          <BreadcrumbNav />

          {/* Page content */}
          <div className="page-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
