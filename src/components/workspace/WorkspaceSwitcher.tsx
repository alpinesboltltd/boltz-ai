"use client";

import { useState, useEffect, Fragment } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { ChevronDown, Plus, Check, Briefcase, Building2 } from "lucide-react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
    const {
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        fetchWorkspaces,
        createWorkspace,
    } = useWorkspaceStore();
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

    if (!currentWorkspace && workspaces.length === 0) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex w-full items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                >
                    <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Workspace
                    </span>
                </button>
                <CreateWorkspaceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateWorkspace}
                    name={newWorkspaceName}
                    setName={setNewWorkspaceName}
                    isLoading={isLoading}
                />
            </>
        );
    }

    return (
        <div className="relative w-full">
            <Menu as="div" className="relative inline-block text-left w-full">
                <div>
                    <Menu.Button className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <span className="truncate text-left font-semibold text-gray-900">
                                {currentWorkspace?.name || "Select Workspace"}
                            </span>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 group-data-open:rotate-180" />
                    </Menu.Button>
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
                    <Menu.Items className="absolute left-0 right-0 z-50 mt-2 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none">
                        <div className="p-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                My Workspaces
                            </div>
                            {workspaces.map((workspace) => (
                                <Menu.Item key={workspace.id}>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setCurrentWorkspace(workspace)}
                                            className={cn(
                                                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                                                active ? "bg-primary-50 text-primary-700" : "text-gray-700",
                                                currentWorkspace?.id === workspace.id && "bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Briefcase className={cn("h-4 w-4", active ? "text-primary-500" : "text-gray-400")} />
                                                <span className="truncate">{workspace.name}</span>
                                            </div>
                                            {currentWorkspace?.id === workspace.id && (
                                                <Check className="ml-2 h-4 w-4 text-primary-600" />
                                            )}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                        <div className="p-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={cn(
                                            "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            active ? "bg-gray-50 text-gray-900" : "text-gray-600"
                                        )}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white mr-3 group-hover:border-gray-400 group-hover:bg-gray-50">
                                            <Plus className="h-4 w-4 text-gray-500" />
                                        </div>
                                        Create New Workspace
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
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
    isLoading
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
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                                >
                                    <div className="p-2 bg-primary-50 rounded-lg">
                                        <Building2 className="h-5 w-5 text-primary-600" />
                                    </div>
                                    Create Workspace
                                </Dialog.Title>
                                <form onSubmit={onSubmit} className="mt-4">
                                    <p className="text-sm text-gray-500 mb-4">
                                        Create a new workspace to organize your agents and team members.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
