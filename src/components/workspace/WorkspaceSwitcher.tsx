"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { ChevronDown, Plus, Check, X } from "lucide-react";

export function WorkspaceSwitcher() {
    const {
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        fetchWorkspaces,
        createWorkspace,
    } = useWorkspaceStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) return;
        await createWorkspace(newWorkspaceName);
        setNewWorkspaceName("");
        setIsModalOpen(false);
        setIsOpen(false);
    };

    if (!currentWorkspace && workspaces.length === 0) {
        return (
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-between w-[200px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Create Workspace
                <Plus className="ml-2 h-4 w-4" />
            </button>
        );
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex justify-between w-[200px] rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <span className="truncate">{currentWorkspace?.name || "Select Workspace"}</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            My Workspaces
                        </div>
                        {workspaces.map((workspace) => (
                            <button
                                key={workspace.id}
                                onClick={() => {
                                    setCurrentWorkspace(workspace);
                                    setIsOpen(false);
                                }}
                                className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <span className="truncate flex-1 text-left">{workspace.name}</span>
                                {currentWorkspace?.id === workspace.id && (
                                    <Check className="ml-2 h-4 w-4 text-primary-600" />
                                )}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <Plus className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                            Create Workspace
                        </button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Create Workspace
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Add a new workspace to manage your agents and teams.
                                            </p>
                                            <div className="mt-4">
                                                <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
                                                    Workspace Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="workspace-name"
                                                    id="workspace-name"
                                                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md mt-1 p-2 border"
                                                    placeholder="Acme Corp."
                                                    value={newWorkspaceName}
                                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCreateWorkspace}
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
