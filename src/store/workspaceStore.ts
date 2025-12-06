import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Workspace } from "@/types";
import { workspacesAPI } from "@/lib/api";

interface WorkspaceState {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;
    fetchWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, description?: string) => Promise<Workspace | null>;
    setCurrentWorkspace: (workspace: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
    persist(
        (set, get) => ({
            workspaces: [],
            currentWorkspace: null,
            isLoading: false,
            error: null,

            fetchWorkspaces: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await workspacesAPI.getAll();
                    const workspaces = response as Workspace[]; // Assuming API returns array directly or we adjust
                    // Wait, apiRequest returns response.json(). If backend returns array, this is fine.
                    // If backend returns { data: [] }, we need to adjust.
                    // My backend handler returns c.JSON(http.StatusOK, workspaces) which is an array.
                    set({ workspaces, isLoading: false });

                    // Set default workspace if none selected
                    if (!get().currentWorkspace && workspaces.length > 0) {
                        set({ currentWorkspace: workspaces[0] });
                    }
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            createWorkspace: async (name: string, description?: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await workspacesAPI.create(name, description);
                    const newWorkspace = response as Workspace;
                    set((state) => ({
                        workspaces: [...state.workspaces, newWorkspace],
                        currentWorkspace: newWorkspace,
                        isLoading: false,
                    }));
                    return newWorkspace;
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    return null;
                }
            },

            setCurrentWorkspace: (workspace: Workspace) => {
                set({ currentWorkspace: workspace });
            },
        }),
        {
            name: "workspace-storage",
            partialize: (state) => ({ currentWorkspace: state.currentWorkspace }),
        }
    )
);
