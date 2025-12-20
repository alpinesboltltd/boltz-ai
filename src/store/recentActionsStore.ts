import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentAction {
    id: string;
    type: "workspace_entry" | "agent_interaction";
    timestamp: number;
    workspaceId: string;
    workspaceName: string;
    agentId?: string;
    agentName?: string;
}

interface RecentActionsState {
    actions: RecentAction[];
    addWorkspaceEntry: (workspaceId: string, workspaceName: string) => void;
    addAgentInteraction: (
        workspaceId: string,
        workspaceName: string,
        agentId: string,
        agentName: string
    ) => void;
    getRecentActions: (limit?: number) => RecentAction[];
    clearActions: () => void;
}

const MAX_ACTIONS = 10;

export const useRecentActionsStore = create<RecentActionsState>()(
    persist(
        (set, get) => ({
            actions: [],

            addWorkspaceEntry: (workspaceId: string, workspaceName: string) => {
                const newAction: RecentAction = {
                    id: `workspace-${workspaceId}`,
                    type: "workspace_entry",
                    timestamp: Date.now(),
                    workspaceId,
                    workspaceName,
                };

                set((state) => {
                    // Remove any existing workspace entry with the same workspaceId
                    const filteredActions = state.actions.filter(
                        (action) =>
                            !(action.type === "workspace_entry" && action.workspaceId === workspaceId)
                    );

                    // Add new action to top
                    return {
                        actions: [newAction, ...filteredActions].slice(0, MAX_ACTIONS),
                    };
                });
            },

            addAgentInteraction: (
                workspaceId: string,
                workspaceName: string,
                agentId: string,
                agentName: string
            ) => {
                const newAction: RecentAction = {
                    id: `${workspaceId}-${agentId}`,
                    type: "agent_interaction",
                    timestamp: Date.now(),
                    workspaceId,
                    workspaceName,
                    agentId,
                    agentName,
                };

                set((state) => {
                    // Remove any existing agent interaction with the same agentId
                    const filteredActions = state.actions.filter(
                        (action) =>
                            !(action.type === "agent_interaction" && action.agentId === agentId)
                    );

                    // Add new action to top
                    return {
                        actions: [newAction, ...filteredActions].slice(0, MAX_ACTIONS),
                    };
                });
            },

            getRecentActions: (limit = 5) => {
                return get().actions.slice(0, limit);
            },

            clearActions: () => {
                set({ actions: [] });
            },
        }),
        {
            name: "lx-workspace-recent-actions-log",
        }
    )
);
