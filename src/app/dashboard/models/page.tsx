"use client";

import { useState, useEffect } from "react";
import { aiModelsAPI } from "@/lib/api";
import { AIModelResponse } from "@/types/aiModels";
import { Spinner } from "@/components/common/Spinner";
import { toast } from "@/store/toastStore";
import { useCurrentUser } from "@/store/authStore";
import { UserRoles } from "@/types";

export default function ModelsPage() {
    const user = useCurrentUser();
    const [models, setModels] = useState<AIModelResponse["ai_model"][]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<AIModelResponse["ai_model"] | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        provider: "",
        credits_per_1k: 0,
        supports_text: true,
        supports_vision: false,
        supports_voice: false,
        is_reasoning: false,
    });

    const isAdmin = user?.role === UserRoles.superAdmin;

    const fetchModels = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;
            const response = await aiModelsAPI.getAll(token);
            if (response && response.ai_models) {
                setModels(response.ai_models);
            }
        } catch (error) {
            console.error("Failed to fetch models:", error);
            toast.error("Error", "Failed to load AI models");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            if (editingModel) {
                await aiModelsAPI.update(editingModel.id, formData, token);
                toast.success("Success", "Model updated successfully");
            } else {
                await aiModelsAPI.create(formData, token);
                toast.success("Success", "Model created successfully");
            }
            setIsModalOpen(false);
            setEditingModel(null);
            setFormData({
                name: "",
                provider: "",
                credits_per_1k: 0,
                supports_text: true,
                supports_vision: false,
                supports_voice: false,
                is_reasoning: false,
            });
            fetchModels();
        } catch (error) {
            console.error("Failed to save model:", error);
            toast.error("Error", "Failed to save model");
        }
    };

    const handleEdit = (model: AIModelResponse["ai_model"]) => {
        setEditingModel(model);
        setFormData({
            name: model.name,
            provider: model.provider,
            credits_per_1k: model.credits_per_1k,
            supports_text: model.supports_text,
            supports_vision: model.supports_vision,
            supports_voice: model.supports_voice,
            is_reasoning: model.is_reasoning,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this model?")) return;
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            await aiModelsAPI.delete(id, token);
            toast.success("Success", "Model deleted successfully");
            fetchModels();
        } catch (error) {
            console.error("Failed to delete model:", error);
            toast.error("Error", "Failed to delete model");
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
                    <h1 className="text-2xl font-semibold text-gray-900">AI Models</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage available AI models for agents.
                    </p>
                </div>
                {isAdmin && (
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingModel(null);
                                setFormData({
                                    name: "",
                                    provider: "",
                                    credits_per_1k: 0,
                                    supports_text: true,
                                    supports_vision: false,
                                    supports_voice: false,
                                    is_reasoning: false,
                                });
                                setIsModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
                        >
                            Add Model
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Provider</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Credits/1k</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Capabilities</th>
                                        {isAdmin && <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {models.map((model) => (
                                        <tr key={model.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{model.name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{model.provider}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{model.credits_per_1k}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="flex gap-2">
                                                    {model.supports_text && <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Text</span>}
                                                    {model.supports_vision && <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Vision</span>}
                                                    {model.supports_voice && <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Voice</span>}
                                                    {model.is_reasoning && <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Reasoning</span>}
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button onClick={() => handleEdit(model)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                                                    <button onClick={() => handleDelete(model.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{editingModel ? "Edit Model" : "Add Model"}</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Provider</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.provider}
                                            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Credits per 1k</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.credits_per_1k}
                                            onChange={(e) => setFormData({ ...formData, credits_per_1k: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.supports_text}
                                                onChange={(e) => setFormData({ ...formData, supports_text: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Supports Text</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.supports_vision}
                                                onChange={(e) => setFormData({ ...formData, supports_vision: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Supports Vision</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.supports_voice}
                                                onChange={(e) => setFormData({ ...formData, supports_voice: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Supports Voice</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_reasoning}
                                                onChange={(e) => setFormData({ ...formData, is_reasoning: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Is Reasoning Model</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    >
                                        {editingModel ? "Update" : "Create"}
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
