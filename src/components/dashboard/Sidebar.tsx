"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  MessageSquare,
  Bot,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { UserRoles } from "@/types";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/dashboard/market", icon: ShoppingBag },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Users", href: "/dashboard/users", icon: Users },
    ...(user?.role === UserRoles.superAdmin ||
    user?.email === "ebentim4@gmail.com"
      ? [
          { name: "Superadmin", href: "/superadmin", icon: Shield },
          { name: "AI Models", href: "/dashboard/models", icon: Bot },
          {
            name: "Instructions",
            href: "/dashboard/instructions",
            icon: FileText,
          },
          {
            name: "Agent Templates",
            href: "/dashboard/admin/templates",
            icon: Bot,
          },
        ]
      : []),
    { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    return pathname.startsWith(href) && href !== "/dashboard";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/logo.webp"
                alt="Boltz"
                fill
                className="object-contain"
              />
            </div>
            <span
              className={cn(
                "text-xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent transition-opacity duration-300",
                collapsed ? "opacity-0 w-0" : "opacity-100"
              )}
            >
              Boltz
            </span>
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Workspace Switcher */}
        <div
          className={cn(
            "p-4 transition-all duration-300",
            collapsed ? "px-2" : "px-4"
          )}
        >
          <div className={cn(collapsed && "hidden")}>
            <WorkspaceSwitcher />
          </div>
          {collapsed && (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active
                      ? "text-primary-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                <span
                  className={cn(
                    "truncate transition-all duration-300",
                    collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-100 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50",
              collapsed && "justify-center"
            )}
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-white shadow-sm">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-600 font-medium">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </div>

            <div
              className={cn(
                "flex flex-1 flex-col overflow-hidden transition-all duration-300",
                collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
              )}
            >
              <span className="truncate text-sm font-medium text-gray-900">
                {user?.name || "User"}
              </span>
              <span className="truncate text-xs text-gray-500">
                {user?.email}
              </span>
            </div>

            <button
              onClick={logout}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors",
                collapsed && "hidden"
              )}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
