"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { workspacesAPI } from "@/lib/api";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();

  useEffect(() => {
    async function fetch() {
      const workspace = await workspacesAPI.getById(workspaceId);
      setCurrentWorkspace(workspace);
      if (!workspace) {
        router.push("/dashboard");
      }
    }
    fetch();
  }, [workspaceId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {currentWorkspace && (
        <WorkspaceDashboard workspaceId={currentWorkspace.id} />
      )}
    </div>
  );
}
