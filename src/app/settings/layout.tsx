"use client";

import { useState } from "react";
import { useCurrentUser } from "@/store/authStore";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PrimarySidebar } from "@/components/layout/PrimarySidebar";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/common/Spinner";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Show loading or redirect if no user
  if (!user) {
    if (typeof window !== "undefined") {
      const hasToken = localStorage.getItem("boltz_by_alpinesbolt_auth_token");
      if (!hasToken) {
        window.location.href = "/login?action=logout";
      }
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PrimarySidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:pl-20" : "md:pl-72"
        )}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logo.webp"
                  alt="Level-x"
                  height={32}
                  width={32}
                  className="h-8 w-8"
                />
                <span className="text-lg font-bold text-gray-900">Level-x</span>
              </Link>
            </div>
          </div>
        </div>

        <main className="flex-1 py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
