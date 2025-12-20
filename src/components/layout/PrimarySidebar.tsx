"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { UserRoles } from "@/types";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";

interface PrimarySidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function PrimarySidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: PrimarySidebarProps) {
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const sidebarRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  // Animate sidebar on collapse/expand
  useEffect(() => {
    if (!sidebarRef.current) return;

    const timeline = gsap.timeline();

    // Animate sidebar width
    timeline.to(sidebarRef.current, {
      width: collapsed ? 80 : 288, // w-20 = 80px, w-72 = 288px
      duration: 0.35,
      ease: "power2.inOut",
    });

    // Animate text elements opacity
    const allTextElements = textRefs.current.filter(Boolean);

    if (collapsed) {
      // Fade out text first, then shrink sidebar
      timeline.to(
        allTextElements,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        0
      );
    } else {
      // Expand sidebar first, then fade in text
      timeline.to(
        allTextElements,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.in",
        },
        0.15
      );
    }
  }, [collapsed]);

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
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ width: collapsed ? 80 : 288 }}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src="/images/logo.webp"
                alt="Level-x"
                fill
                className="object-contain"
              />
            </div>
            <span
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className={cn(
                "text-xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent",
                collapsed && "w-0"
              )}
            >
              Level-x
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              collapsed && "justify-center px-0"
            )}
            title="Dashboard"
          >
            <LayoutDashboard className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
            <span
              ref={(el) => {
                textRefs.current[1] = el;
              }}
              className={cn(
                "truncate",
                collapsed && "w-0 hidden"
              )}
            >
              Dashboard
            </span>
          </Link>

          <WorkspaceSwitcher collapsed={collapsed} />

          {user?.role === UserRoles.superAdmin && (
            <Link
              href="/superadmin"
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                collapsed && "justify-center px-0"
              )}
              title="Super Admin"
            >
              <Shield className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
              <span
                ref={(el) => {
                  textRefs.current[2] = el;
                }}
                className={cn(
                  "truncate",
                  collapsed && "w-0 hidden"
                )}
              >
                Super Admin
              </span>
            </Link>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-100 p-3">
          {/* Settings Link */}
          <Link
            href="/settings"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 mb-2",
              collapsed && "justify-center px-0"
            )}
            title="Settings"
          >
            <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
            <span
              ref={(el) => {
                textRefs.current[3] = el;
              }}
              className={cn(
                "truncate",
                collapsed && "w-0 hidden"
              )}
            >
              Settings
            </span>
          </Link>

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
              ref={(el) => {
                textRefs.current[4] = el;
              }}
              className={cn(
                "flex flex-1 flex-col overflow-hidden",
                collapsed && "w-0 hidden"
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
