import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  School,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["admin", "teacher"],
  },
  {
    label: "Absensi",
    path: "/attendance",
    icon: CalendarCheck,
    roles: ["admin", "teacher"],
  },
  {
    label: "Siswa",
    path: "/students",
    icon: Users,
    roles: ["admin", "teacher"],
  },
  {
    label: "Kelas",
    path: "/classes",
    icon: School,
    roles: ["admin"],
  },
  {
    label: "Pengguna",
    path: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Laporan",
    path: "/reports",
    icon: FileBarChart,
    roles: ["admin", "teacher"],
  },
  {
    label: "Pengaturan",
    path: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter((item) => {
    if (!user) return true; // fallback to show all if user is not loaded yet
    const role = user.role?.toLowerCase() as UserRole;
    return item.roles.includes(role);
  });

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
            <School className="h-5 w-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="truncate text-sm font-bold text-foreground">
              SDIT Al Hikmah
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Sistem Absensi
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <SidebarMenuButton onClick={() => logout()} variant="outline" className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </SidebarMenuButton>
      </SidebarFooter> */}
    </Sidebar>
  );
}

// Keep the old component signature for compatibility, though MainLayout will use AppSidebar directly
export default function SidebarWrapper({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return <AppSidebar />;
}
