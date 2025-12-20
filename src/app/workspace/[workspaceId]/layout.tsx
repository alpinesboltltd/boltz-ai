"use client";

import { useState, use, useEffect } from "react";
import { PrimarySidebar } from "@/components/layout/PrimarySidebar";
import { WorkspaceSidebar } from "@/components/layout/WorkspaceSidebar";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRecentActionsStore } from "@/store/recentActionsStore";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { addWorkspaceEntry } = useRecentActionsStore();
  const [primarySidebarCollapsed, setPrimarySidebarCollapsed] = useState(false);
  const [secondarySidebarCollapsed, setSecondarySidebarCollapsed] =
    useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Track workspace entry when layout mounts
  useEffect(() => {
    const workspace = workspaces.find((w) => w.id === resolvedParams.workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      // Don't track here as it's already tracked in WorkspaceSwitcher when user clicks
    }
  }, [resolvedParams.workspaceId, workspaces, setCurrentWorkspace]);

  // Mutual exclusion: when expanding one sidebar, collapse the other
  const handlePrimarySidebarToggle = (collapsed: boolean) => {
    setPrimarySidebarCollapsed(collapsed);
    // If expanding primary sidebar, collapse secondary sidebar
    if (!collapsed) {
      setSecondarySidebarCollapsed(true);
    }
  };

  const handleSecondarySidebarToggle = (collapsed: boolean) => {
    setSecondarySidebarCollapsed(collapsed);
    // If expanding secondary sidebar, collapse primary sidebar
    if (!collapsed) {
      setPrimarySidebarCollapsed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Primary Sidebar (Global) */}
      <PrimarySidebar
        collapsed={primarySidebarCollapsed}
        setCollapsed={handlePrimarySidebarToggle}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area Wrapper */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${primarySidebarCollapsed ? "ml-20" : "ml-72"
          }`}
      >
        <div className="flex flex-1 h-screen overflow-hidden">
          {/* Secondary Sidebar (Workspace Specific) */}
          <WorkspaceSidebar
            workspaceId={resolvedParams.workspaceId}
            collapsed={secondarySidebarCollapsed}
            setCollapsed={handleSecondarySidebarToggle}
          />

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
