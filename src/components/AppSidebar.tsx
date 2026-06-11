import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useRole, useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, ClipboardList, Building2,
  User, ChevronLeft, Menu, LogOut,
} from "lucide-react";

const adminNavItems = [
  { to: "/dashboard",              icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/booking",       icon: ClipboardList,   label: "Kelola Peminjaman" },
  { to: "/labs",          icon: Building2,       label: "Data Lab"   },
  { to: "/admin/schedules", icon: CalendarDays,  label: "Jadwal Rutin" },
  { to: "/profil",        icon: User,            label: "Profil"     }, 
];

const guruNavItems = [
  { to: "/dashboard",        icon: LayoutDashboard, label: "Dashboard"  },
  { to: "/booking", icon: ClipboardList,   label: "Peminjaman" },
  { to: "/profil",  icon: User,            label: "Profil"     },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const { role, currentUser }     = useRole();
  const { logout }                = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const navItems = role === "admin" ? adminNavItems : guruNavItems;

  return (
    <>
      {/* ── Hamburger mobile ── */}
      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-elevated md:hidden"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Sidebar Container - MENGGUNAKAN bg-primary AGAR WARNANYA SAMA DENGAN LOGIN */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300",
        "bg-primary border-r border-primary-foreground/10 text-primary-foreground", 
        collapsed ? "w-16" : "w-60",
        "max-md:translate-x-[-100%]",
        !collapsed && "max-md:translate-x-0"
      )}>

        {/* ── Brand ── */}
        <div className={cn(
          "flex h-16 items-center border-b border-primary-foreground/10 px-4",
          collapsed && "justify-center"
        )}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">SIPLAB</h1>
                <p className="text-[10px] text-white/80">SMK SMART AR-RAHMAN</p>
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <Building2 className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.to
                  ? "bg-white/20 text-white shadow-sm" // Menu Aktif (Bening Keputihan)
                  : "text-white/70 hover:bg-white/10 hover:text-white", // Menu tidak aktif
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ── Tombol logout ── */}
        {!collapsed && (
          <div className="border-t border-primary-foreground/10 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-red-500/80 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        )}

        {/* ── Collapse button desktop ── */}
        <div className="border-t border-primary-foreground/10 p-3 max-md:hidden">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>

        {/* ── Info user ── */}
        <div className={cn("border-t border-primary-foreground/10 p-3", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
              {currentUser.initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-white/70">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}