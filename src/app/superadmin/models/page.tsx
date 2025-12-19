"use client";

import { useState, useEffect } from "react";
import { aiModelsAPI } from "@/lib/api";
import { AIModelResponse } from "@/types/aiModels";
import { Spinner } from "@/components/common/Spinner";
import { toast } from "@/store/toastStore";
import { useCurrentUser } from "@/store/authStore";
import { UserRoles } from "@/types";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mic,
  MessageSquare,
  BrainCircuit,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function ModelsPage() {
  const user = useCurrentUser();
  const [models, setModels] = useState<AIModelResponse["ai_model"][]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<
    AIModelResponse["ai_model"] | null
  >(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
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
      const token = localStorage.getItem("boltz_by_alpinesbolt_auth_token");
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
    const token = localStorage.getItem("boltz_by_alpinesbolt_auth_token");
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

  const handleDeleteClick = (id: string) => {
    setModelToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!modelToDelete) return;
    const token = localStorage.getItem("boltz_by_alpinesbolt_auth_token");
    if (!token) return;

    try {
      await aiModelsAPI.delete(modelToDelete, token);
      toast.success("Success", "Model deleted successfully");
      fetchModels();
    } catch (error) {
      console.error("Failed to delete model:", error);
      toast.error("Error", "Failed to delete model");
    } finally {
      setDeleteConfirmOpen(false);
      setModelToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading AI models...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary-600" />
            AI Models
          </h1>
          <p className="mt-2 text-gray-500">
            Configure and manage the AI models available to your agents.
          </p>
        </div>
        {isAdmin && (
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
            className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" />
            Add Model
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Model Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Provider
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Cost (Credits/1k)
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Capabilities
                </th>
                {isAdmin && (
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model) => (
                <tr
                  key={model.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {model.name}
                        </div>
                        {model.is_reasoning && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                            Reasoning Model
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {model.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.credits_per_1k}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {model.supports_text && (
                        <div
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-md"
                          title="Text"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      )}
                      {model.supports_vision && (
                        <div
                          className="p-1.5 bg-green-50 text-green-600 rounded-md"
                          title="Vision"
                        >
                          <Eye className="w-4 h-4" />
                        </div>
                      )}
                      {model.supports_voice && (
                        <div
                          className="p-1.5 bg-orange-50 text-orange-600 rounded-md"
                          title="Voice"
                        >
                          <Mic className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(model)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(model.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingModel ? "Edit Model" : "Add New Model"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Model Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input w-full"
                      placeholder="e.g. GPT-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Provider
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.provider}
                      onChange={(e) =>
                        setFormData({ ...formData, provider: e.target.value })
                      }
                      className="input w-full"
                      placeholder="e.g. OpenAI"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Cost (Credits per 1k tokens)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.credits_per_1k}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits_per_1k: parseInt(e.target.value),
                      })
                    }
                    className="input w-full"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700 block">
                    Capabilities
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        key: "supports_text",
                        label: "Text Generation",
                        icon: MessageSquare,
                      },
                      {
                        key: "supports_vision",
                        label: "Computer Vision",
                        icon: Eye,
                      },
                      {
                        key: "supports_voice",
                        label: "Voice/Audio",
                        icon: Mic,
                      },
                      {
                        key: "is_reasoning",
                        label: "Reasoning Model",
                        icon: BrainCircuit,
                      },
                    ].map((cap) => (
                      <label
                        key={cap.key}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                          formData[cap.key as keyof typeof formData]
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!formData[cap.key as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [cap.key]: e.target.checked,
                            })
                          }
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                            formData[cap.key as keyof typeof formData]
                              ? "bg-primary-500 border-primary-500 text-white"
                              : "border-gray-300"
                          )}
                        >
                          {formData[cap.key as keyof typeof formData] && (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <cap.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {cap.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingModel ? "Update Model" : "Create Model"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Model"
        description="Are you sure you want to delete this model? This action cannot be undone."
        confirmText="Delete Model"
        variant="danger"
      />
    </div>
  );
}
