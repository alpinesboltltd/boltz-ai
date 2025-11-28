"use client";

import { useState, useEffect } from "react";
import { systemAPI } from "@/lib/api";
import { SystemInstruction } from "@/types/system";
import { Spinner } from "@/components/common/Spinner";
import { toast } from "@/store/toastStore";
import { useCurrentUser } from "@/store/authStore";
import { UserRoles } from "@/types";

export default function InstructionsPage() {
    const user = useCurrentUser();
    const [instructions, setInstructions] = useState<SystemInstruction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInstruction, setEditingInstruction] = useState<SystemInstruction | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    const isAdmin = user?.role === UserRoles.superAdmin;

    const fetchInstructions = async () => {
        try {
            const response = await systemAPI.listInstructions();
            if (response && response.instructions) {
                setInstructions(response.instructions);
            }
        } catch (error) {
            console.error("Failed to fetch instructions:", error);
            toast.error("Error", "Failed to load system instructions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingInstruction) {
                await systemAPI.updateInstruction(editingInstruction.id, formData.title, formData.content);
                toast.success("Success", "Instruction updated successfully");
            } else {
                await systemAPI.createInstruction(formData.title, formData.content);
                toast.success("Success", "Instruction created successfully");
            }
            setIsModalOpen(false);
            setEditingInstruction(null);
            setFormData({
                title: "",
                content: "",
            });
            fetchInstructions();
        } catch (error) {
            console.error("Failed to save instruction:", error);
            toast.error("Error", "Failed to save instruction");
        }
    };

    const handleEdit = (instruction: SystemInstruction) => {
        setEditingInstruction(instruction);
        setFormData({
            title: instruction.title,
            content: instruction.content,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this instruction?")) return;

        try {
            await systemAPI.deleteInstruction(id);
            toast.success("Success", "Instruction deleted successfully");
            fetchInstructions();
        } catch (error) {
            console.error("Failed to delete instruction:", error);
            toast.error("Error", "Failed to delete instruction");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">System Instructions</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage system instructions for agents.
                    </p>
                </div>
                {isAdmin && (
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingInstruction(null);
                                setFormData({
                                    title: "",
                                    content: "",
                                });
                                setIsModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Add Instruction
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Content Preview</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                                        {isAdmin && <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {instructions.map((instruction) => (
                                        <tr key={instruction.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{instruction.title}</td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">{instruction.content}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(instruction.created_at).toLocaleDateString()}</td>
                                            {isAdmin && (
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button onClick={() => handleEdit(instruction)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                                                    <button onClick={() => handleDelete(instruction.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)} />
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{editingInstruction ? "Edit Instruction" : "Add Instruction"}</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Content</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    >
                                        {editingInstruction ? "Update" : "Create"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
