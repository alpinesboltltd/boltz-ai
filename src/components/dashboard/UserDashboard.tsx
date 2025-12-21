"use client";

import { useCurrentUser } from "@/store/authStore";
import { RecentActions } from "@/components/dashboard/RecentActions";
import { useRecentActionsStore } from "@/store/recentActionsStore";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowRight, BarChart, Users } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";

export function UserDashboard() {
  const user = useCurrentUser();
  const router = useRouter();
  const { actions } = useRecentActionsStore();
  const { workspaces } = useWorkspaceStore();

  const lastVisitedWorkspace = actions.find(
    (action) => action.type === "workspace_entry"
  );

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="mt-1 text-gray-500">
          Here is an overview of your activity across all workspaces.
        </p>
      </div>

      {/* Quick Access / Last Visited */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Visited Workspace Card */}
        <div
          onClick={() =>
            lastVisitedWorkspace &&
            router.push(`/workspace/${lastVisitedWorkspace.workspaceId}`)
          }
          className={`card relative overflow-hidden group cursor-pointer transition-all hover:shadow-md ${!lastVisitedWorkspace ? "opacity-70 pointer-events-none" : ""}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-24 h-24 text-primary-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900">Last Visited</h3>
            </div>
            {lastVisitedWorkspace ? (
              <div>
                <p className="text-lg font-medium text-gray-900 truncate">
                  {lastVisitedWorkspace.workspaceName}
                </p>
                <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                  Go to Workspace{" "}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No recent workspace visited
              </p>
            )}
          </div>
        </div>

        {/* Global Stats - Placeholders */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <BarChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Workspaces</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {workspaces?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Platform Role</p>
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {user?.role || "Member"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200 my-8"></div>

      {/* Global Activity */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            All Recent Activity
          </h2>
          <p className="text-sm text-gray-500">
            Activity trace across all your workspaces.
          </p>
        </div>
        <RecentActions />
      </div>
    </div>
  );
}
