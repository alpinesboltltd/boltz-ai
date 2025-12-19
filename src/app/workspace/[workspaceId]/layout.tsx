"use client";

import { useState } from "react";
import { PrimarySidebar } from "@/components/layout/PrimarySidebar";
import { WorkspaceSidebar } from "@/components/layout/WorkspaceSidebar";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Primary Sidebar (Global) */}
      <PrimarySidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area Wrapper */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "ml-20" : "ml-72"
        }`}
      >
        <div className="flex flex-1 h-screen overflow-hidden">
          {/* Secondary Sidebar (Workspace Specific) */}
          <WorkspaceSidebar workspaceId={params.workspaceId} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            <div className="px-4 py-8 sm:px-6 lg:px-8">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
