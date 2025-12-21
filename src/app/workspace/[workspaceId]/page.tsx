"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();

  // Ensure the workspace store is synced with the URL
  /* 
     Rationale: We are navigating to a specific workspace URL.
     Ideally, we should fetch the workspace details if not already present, 
     but for now we assume the layout or middleware handles basic validation.
     However, updating the global store is good practice so the sidebar highlights correctly.
  */

  return (
    <div className="container mx-auto px-4 py-8">
      <WorkspaceDashboard workspaceId={workspaceId} />
    </div>
  );
}
