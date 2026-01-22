"use client";

import { useState } from "react";
import {
  useRecentActionsStore,
  RecentAction,
} from "@/store/recentActionsStore";
import { useRouter } from "next/navigation";
import { Clock, Briefcase, Bot, ChevronRight, History } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RecentActions({ workspaceId }: { workspaceId?: string }) {
  const { getRecentActions } = useRecentActionsStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all actions first, then filter if workspaceId is present
  const allActions = getRecentActions(20); // Fetch more to ensure we have enough after filtering
  const filteredActions = workspaceId
    ? allActions.filter((action) => action.workspaceId === workspaceId)
    : allActions;

  const recentActions = filteredActions.slice(0, 10);
  const topActions = recentActions.slice(0, 3);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleActionClick = (action: RecentAction) => {
    if (action.type === "workspace_entry") {
      router.push(`/workspace/${action.workspaceId}/analytics`);
    } else if (action.type === "agent_interaction" && action.agentId) {
      router.push(`/workspace/${action.workspaceId}/agent/${action.agentId}`);
    }
    setIsModalOpen(false);
  };

  const renderAction = (action: RecentAction, compact = false) => (
    <button
      key={action.id}
      onClick={() => handleActionClick(action)}
      className={cn(
        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
        "hover:bg-gray-50 group text-left",
        compact && "px-3"
      )}
    >
      <div
        className={cn(
          "p-2 rounded-lg shrink-0",
          action.type === "workspace_entry"
            ? "bg-blue-50 text-blue-600"
            : "bg-purple-50 text-purple-600"
        )}
      >
        {action.type === "workspace_entry" ? (
          <Briefcase className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {action.type === "workspace_entry"
            ? action.workspaceName
            : action.agentName}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {action.type === "agent_interaction"
            ? action.workspaceName
            : formatTime(action.timestamp)}
        </p>
      </div>
      {!compact && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">
            {action.type === "agent_interaction" &&
              formatTime(action.timestamp)}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      )}
    </button>
  );

  if (topActions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Compact List */}
      <div className="space-y-1">
        {topActions.map((action) => renderAction(action, true))}

        {/* View All Button */}
        {recentActions.length > 3 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-2 rounded-lg mt-2",
              "text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              "transition-all duration-200 border border-gray-200 hover:border-gray-300"
            )}
          >
            <History className="h-4 w-4" />
            View All Activity
          </button>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              Recent Activity
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-96 overflow-y-auto scrollbar-hide space-y-1">
            {recentActions.map((action) => renderAction(action))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
