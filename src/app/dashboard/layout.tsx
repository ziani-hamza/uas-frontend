"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  Wrench,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Command Center",
    href: "/dashboard/command-center",
    icon: LayoutDashboard,
    roles: ["owner", "manager", "sales", "technician", "support"],
  },
  {
    label: "Marketing",
    href: "/dashboard/marketing",
    icon: Megaphone,
    roles: ["owner", "manager"],
  },
  {
    label: "Sales",
    href: "/dashboard/sales",
    icon: TrendingUp,
    roles: ["owner", "manager", "sales"],
  },
  {
    label: "Operations",
    href: "/dashboard/operations",
    icon: Wrench,
    roles: ["owner", "manager", "technician"],
  },
  {
    label: "Financial",
    href: "/dashboard/financial",
    icon: DollarSign,
    roles: ["owner"],
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
    roles: ["owner", "manager"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["owner"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">UAS</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm leading-tight">
              Upstate Auto
            </h2>
            <p className="text-xs text-gray-500">Dashboard v1.0</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-900">UAS Dashboard</span>
          <div className="w-6" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
