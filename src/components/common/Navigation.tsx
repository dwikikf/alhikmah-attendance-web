import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Settings as SettingsIcon, User as UserIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const roleLabel = user?.role === "admin"
    ? "Administrator"
    : user?.role === "teacher"
      ? "Guru Wali Kelas"
      : "Pengguna";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground mr-1">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              "flex items-center gap-3 rounded-full md:rounded-xl pl-1 pr-3 md:px-3 py-1.5 transition-colors border border-transparent",
              "hover:bg-muted/50 dark:hover:bg-muted/20",
              isProfileOpen && "bg-muted/80 dark:bg-muted/30 border-border/50",
            )}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-sm">
              {userInitials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-none text-foreground mb-1">
                {user?.name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {roleLabel}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "hidden h-4 w-4 text-muted-foreground transition-transform duration-200 md:block",
                isProfileOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 animate-scale-in rounded-xl border border-border bg-card py-1.5 shadow-lg z-50">
              {/* User info in mobile */}
              <div className="border-b border-border px-4 py-3 md:hidden">
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <Link
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Profil Saya
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                Pengaturan
              </Link>

              <div className="my-1.5 border-t border-border" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
