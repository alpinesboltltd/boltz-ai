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
  createWorkspace: (
    name: string,
    description?: string
  ) => Promise<Workspace | null>;
  setCurrentWorkspace: (workspace: Workspace) => void;
  clearCurrentWorkspace: () => void;
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
          const workspaces = response as Workspace[];
          set({ workspaces, isLoading: false });

          // No auto-selection - user must explicitly choose a workspace
        } catch (error: unknown) {
          set({ error: (error as Error).message, isLoading: false });
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
        } catch (error: unknown) {
          set({ error: (error as Error).message, isLoading: false });
          return null;
        }
      },

      setCurrentWorkspace: (workspace: Workspace) => {
        set({ currentWorkspace: workspace });
      },

      clearCurrentWorkspace: () => {
        set({ currentWorkspace: null });
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({ currentWorkspace: state.currentWorkspace }),
    }
  )
);
