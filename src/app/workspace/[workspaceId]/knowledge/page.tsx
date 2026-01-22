"use client";

import { use } from "react";
import { Sources } from "@/components/dashboard/Sources";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Database } from "lucide-react";

export default function KnowledgeBasePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary-600" />
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage training data and sources for all agents in{" "}
            {currentWorkspace?.name || "this workspace"}.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <Sources workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
