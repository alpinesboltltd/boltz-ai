"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRecentActionsStore } from "@/store/recentActionsStore";
import { ChevronDown, Plus, Check, Briefcase, Building2 } from "lucide-react";
import {
  Menu,
  Transition,
  Dialog,
  MenuButton,
  MenuItems,
  MenuItem,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { cn } from "@/lib/utils";

interface WorkspaceSwitcherProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    fetchWorkspaces,
  } = useWorkspaceStore();
  const { addWorkspaceEntry } = useRecentActionsStore();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsLoading(true);
    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkspaceClick = (workspace: { id: string; name: string }) => {
    setCurrentWorkspace(workspace as any);
    addWorkspaceEntry(workspace.id, workspace.name);
    router.push(`/workspace/${workspace.id}`);
  };

  return (
    <div className="relative w-full">
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <MenuButton
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full",
              collapsed && "justify-center px-0"
            )}
            title={
              collapsed ? currentWorkspace?.name || "My Workspaces" : undefined
            }
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
              <Building2 className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </div>
            <span
              className={cn(
                "truncate text-left flex-1 transition-all duration-300",
                collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
              )}
            >
              {currentWorkspace?.name || "My Workspaces"}
            </span>
            {!collapsed && (
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-open:rotate-180" />
            )}
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            className={cn(
              "absolute z-50 mt-2 origin-top-left divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none w-64",
              collapsed ? "left-12 top-0" : "left-0 right-0"
            )}
          >
            <div className="p-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                My Workspaces
              </div>
              {workspaces.map((workspace) => (
                <MenuItem key={workspace.id}>
                  {({ focus }) => (
                    <button
                      onClick={() => handleWorkspaceClick(workspace)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        focus
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-700",
                        currentWorkspace?.id === workspace.id && "bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Briefcase
                          className={cn(
                            "h-4 w-4",
                            focus ? "text-primary-500" : "text-gray-400"
                          )}
                        />
                        <span className="truncate">{workspace.name}</span>
                      </div>
                      {currentWorkspace?.id === workspace.id && (
                        <Check className="ml-2 h-4 w-4 text-primary-600" />
                      )}
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
            <div className="p-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                      "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      focus ? "bg-gray-50 text-gray-900" : "text-gray-600"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white mr-3 group-hover:border-gray-400 group-hover:bg-gray-50">
                      <Plus className="h-4 w-4 text-gray-500" />
                    </div>
                    Create New Workspace
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkspace}
        name={newWorkspaceName}
        setName={setNewWorkspaceName}
        isLoading={isLoading}
      />
    </div>
  );
}

function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  isLoading: boolean;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                >
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  Create Workspace
                </DialogTitle>
                <form onSubmit={onSubmit} className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Create a new workspace to organize your agents and team
                    members.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="input"
                        placeholder="e.g. Acme Corp"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!name.trim() || isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Workspace"}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
