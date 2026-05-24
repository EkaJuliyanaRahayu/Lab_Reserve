import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  User,
  ChevronLeft,
  Menu,
  ArrowLeftRight,
} from "lucide-react";

const adminNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/booking", icon: ClipboardList, label: "Peminjaman" },
  { to: "/labs", icon: Building2, label: "Data Lab" },
];

const guruNavItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/booking", icon: ClipboardList, label: "Peminjaman" },
  { to: "/labs", icon: User, label: "Profil" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role, setRole, currentUser } = useRole();

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-elevated md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-60",
          "max-md:translate-x-[-100%]",
          !collapsed && "max-md:translate-x-0"
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && "justify-center")}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">LabReserve</h1>
                <p className="text-[10px] text-muted-foreground">SMK Manajemen Lab</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {(role === "admin" ? adminNavItems : guruNavItems).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Role switcher */}
        {!collapsed && (
          <div className="border-t border-border p-3">
            <button
              onClick={() => setRole(role === "admin" ? "guru" : "admin")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Ganti ke {role === "admin" ? "Guru" : "Admin"}
            </button>
          </div>
        )}

        <div className="border-t border-border p-3 max-md:hidden">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <div className={cn("border-t border-border p-3", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {currentUser.initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
