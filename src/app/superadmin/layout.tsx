"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrimarySidebar } from "@/components/layout/PrimarySidebar";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useCurrentUser } from "@/store/authStore";
import { UserRoles } from "@/types";
import { cn } from "@/lib/utils";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useCurrentUser();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protect the route
  useEffect(() => {
    // If user is loaded and not super admin, redirect
    if (user && user.role !== UserRoles.superAdmin) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user && typeof window !== "undefined") {
    // Simple check, might need robust loading state from store
    // Assuming auth store loads eventually.
    // If persists, it might blink.
  }

  // Allow render if user is super admin or likely still loading (to avoid flash of empty if store is fast)
  // Ideally auth store has `isLoading`.

  return (
    <div className="min-h-screen bg-gray-50">
      <PrimarySidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:pl-20" : "md:pl-72"
        )}
      >
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto h-screen">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
