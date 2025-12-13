"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { createAgentTemplate, systemAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Edit2, Trash2, Plus } from "lucide-react";

interface PromptTemplate {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const ROLE_OPTIONS = [
  { value: "virtual_assistant", label: "Virtual Assistant" },
  { value: "customer_support", label: "Customer Support" },
  { value: "sdr", label: "Sales Development Rep" },
  { value: "bdr", label: "Business Development Rep" },
];

const MODEL_OPTIONS = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
];

const AGENT_TYPE_OPTIONS = [
  { value: 1, label: "Chat" },
  { value: 2, label: "Task" },
];

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"agents" | "prompts">("agents");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Agent Template State
  const [agentFormData, setAgentFormData] = useState({
    name: "",
    description: "",
    role: "virtual_assistant",
    agent_type: 1,
    ai_model_id: "gpt-4-turbo",
    tags: [] as string[],
    status: "active",
  });

  // Prompt Template State
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptFormData, setPromptFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (activeTab === "prompts") {
      fetchPromptTemplates();
    }
  }, [activeTab]);

  const fetchPromptTemplates = async () => {
    try {
      setLoading(true);
      const res = await systemAPI.listTemplates();
      setPromptTemplates(res.templates || []);
    } catch (err) {
      console.error("Failed to fetch prompt templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createAgentTemplate(agentFormData);
      setSuccess(true);
      setAgentFormData({
        name: "",
        description: "",
        role: "virtual_assistant",
        agent_type: 1,
        ai_model_id: "gpt-4-turbo",
        tags: [],
        status: "active",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create agent template");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (editingPromptId) {
        await systemAPI.updateTemplate(
          editingPromptId,
          promptFormData.title,
          promptFormData.content
        );
      } else {
        await systemAPI.createTemplate(
          promptFormData.title,
          promptFormData.content
        );
      }
      setSuccess(true);
      setPromptFormData({ title: "", content: "" });
      setEditingPromptId(null);
      fetchPromptTemplates();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save prompt template");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = (template: PromptTemplate) => {
    setEditingPromptId(template.id);
    setPromptFormData({ title: template.title, content: template.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await systemAPI.deleteTemplate(id);
      fetchPromptTemplates();
    } catch (err: any) {
      setError(err.message || "Failed to delete template");
    }
  };

  const handleCancelEdit = () => {
    setEditingPromptId(null);
    setPromptFormData({ title: "", content: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Templates</h1>
        <p className="text-gray-500 mt-2">
          Manage standard templates for agents and system prompts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-max">
        <button
          onClick={() => setActiveTab("agents")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "agents"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          Agent Templates
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "prompts"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          Prompt Templates
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === "agents"
              ? "Create New Agent Template"
              : editingPromptId
                ? "Edit Prompt Template"
                : "Create New Prompt Template"}
          </h2>
          {activeTab === "prompts" && editingPromptId && (
            <button
              onClick={handleCancelEdit}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Global Feedback */}
        {(success || error) && (
          <div className="px-6 pt-6">
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {activeTab === "agents"
                  ? "Agent template created!"
                  : "Prompt template saved!"}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Agent Template Form */}
        {activeTab === "agents" && (
          <form onSubmit={handleAgentSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={agentFormData.name}
                  onChange={(e) =>
                    setAgentFormData({ ...agentFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Standard VA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select
                  options={ROLE_OPTIONS}
                  value={ROLE_OPTIONS.find(
                    (o) => o.value === agentFormData.role
                  )}
                  onChange={(opt) =>
                    setAgentFormData({
                      ...agentFormData,
                      role: opt?.value || "virtual_assistant",
                    })
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  value={agentFormData.description}
                  onChange={(e) =>
                    setAgentFormData({
                      ...agentFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-24"
                  placeholder="Describe what this agent does..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Stats Tags (Performance)
                </label>
                <CreatableSelect
                  isMulti
                  placeholder="Type and press enter (e.g. 'website', 'mobile')"
                  onChange={(opts) =>
                    setAgentFormData({
                      ...agentFormData,
                      tags: opts.map((o) => o.value),
                    })
                  }
                  value={agentFormData.tags.map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-gray-500">
                  Tags allow tracking performance in specific environments.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  AI Model
                </label>
                <Select
                  options={MODEL_OPTIONS}
                  value={MODEL_OPTIONS.find(
                    (o) => o.value === agentFormData.ai_model_id
                  )}
                  onChange={(opt) =>
                    setAgentFormData({
                      ...agentFormData,
                      ai_model_id: opt?.value || "",
                    })
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Template"}
              </button>
            </div>
          </form>
        )}

        {/* Prompt Template Form & List */}
        {activeTab === "prompts" && (
          <div className="p-6 space-y-8">
            <form onSubmit={handlePromptSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Template Title
                </label>
                <input
                  type="text"
                  required
                  value={promptFormData.title}
                  onChange={(e) =>
                    setPromptFormData({
                      ...promptFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Customer Support Base Prompt"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  System Prompt Content
                </label>
                <textarea
                  required
                  value={promptFormData.content}
                  onChange={(e) =>
                    setPromptFormData({
                      ...promptFormData,
                      content: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-64 font-mono text-sm"
                  placeholder="You are a helpful AI assistant..."
                />
                <p className="text-xs text-gray-500">
                  Use placeholders like &#123;&#123;agent_name&#125;&#125; if
                  supported by your prompt engine.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingPromptId
                      ? "Update Template"
                      : "Create Template"}
                </button>
              </div>
            </form>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Existing Prompt Templates
              </h3>
              <div className="space-y-4">
                {promptTemplates.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No prompt templates found.
                  </p>
                ) : (
                  promptTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border rounded-lg p-4 hover:border-primary-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {template.title}
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPrompt(template)}
                            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(template.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 font-mono bg-gray-50 p-2 rounded">
                        {template.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
