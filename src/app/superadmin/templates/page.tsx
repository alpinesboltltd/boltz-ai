"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ReactMarkdown from "react-markdown";

import { AgentTemplate, PromptTemplate } from "@/types/agent";
import { agentsAPI, systemAPI, aiModelsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const ROLE_OPTIONS = [
  { value: "virtual_assistant", label: "Virtual Assistant" },
  { value: "customer_support", label: "Customer Support" },
  { value: "sdr", label: "Sales Development Rep" },
  { value: "bdr", label: "Business Development Rep" },
  { value: "recruiter", label: "Recruiter" },
];

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"agents" | "prompts">("agents");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data Sources
  const [aiModels, setAiModels] = useState<any[]>([]);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 3;

  // Agent Template Form State
  const [agentFormData, setAgentFormData] = useState({
    name: "",
    description: "",
    role: "virtual_assistant",
    agent_type: 1,
    ai_model_id: "",
    tags: [] as string[],
    // Appearance
    primary_color: "#2563eb",
    font_family: "Inter",
    chat_icon: "Bot",
    welcome_message: "Hello! How can I help you today?",
    position: "bottom-right",
    icon_size: "medium",
    bubble_style: "rounded",
    // Behavior
    prompt_template_id: "",
    fallback_message: "I'm not sure I understand. Can you rephrase?",
    offline_message: "I'm currently offline. Please leave a message.",
    temperature: 0.7,
    max_tokens: 1000,
    enable_human_handoff: false,
  });

  // Prompt Template Editor State
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptFormData, setPromptFormData] = useState({
    title: "",
    content: "",
  });
  const [promptEditorTab, setPromptEditorTab] = useState<"write" | "preview">(
    "write"
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("boltz_by_alpinesbolt_auth_token") || "";
      const [modelsRes, promptsRes] = await Promise.all([
        aiModelsAPI.getAll(token),
        systemAPI.listTemplates(),
      ]);
      setAiModels(modelsRes.ai_models || []);
      setPromptTemplates(promptsRes.templates || []);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  const handleAgentSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Construct Payload
      const payload: Partial<AgentTemplate> = {
        name: agentFormData.name,
        description: agentFormData.description,
        role: agentFormData.role,
        agent_type: agentFormData.agent_type,
        ai_model_id: agentFormData.ai_model_id,
        tags: agentFormData.tags,
        config: {
          appearance: {
            primary_color: agentFormData.primary_color,
            font_family: agentFormData.font_family,
            chat_icon: agentFormData.chat_icon,
            welcome_message: agentFormData.welcome_message,
            position: agentFormData.position,
            icon_size: agentFormData.icon_size,
            bubble_style: agentFormData.bubble_style,
          },
          behavior: {
            prompt_template_id: agentFormData.prompt_template_id,
            fallback_message: agentFormData.fallback_message,
            offline_message: agentFormData.offline_message,
            temperature: agentFormData.temperature,
            max_tokens: agentFormData.max_tokens,
            enable_human_handoff: agentFormData.enable_human_handoff,
          },
        },
      };

      await agentsAPI.createTemplate(payload);

      setSuccess(true);
      setCurrentStep(1); // Reset wizard
      // Reset form (simplified)
      setAgentFormData({
        ...agentFormData,
        name: "",
        description: "",
        tags: [],
        ai_model_id: "",
        // Keep defaults for appearance/behavior
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create agent template");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleAgentSubmit();
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ... Prompt Template Handlers (Keep largely same) ...
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      const res = await systemAPI.listTemplates();
      setPromptTemplates(res.templates || []);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = (template: PromptTemplate) => {
    setEditingPromptId(template.id);
    setPromptFormData({ title: template.title, content: template.content });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePromptClick = (id: string) => {
    setPromptToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePrompt = async () => {
    if (!promptToDelete) return;
    try {
      await systemAPI.deleteTemplate(promptToDelete);
      const res = await systemAPI.listTemplates();
      setPromptTemplates(res.templates || []);
    } catch (err: any) {
      console.error("Failed to delete template", err);
      setError(err.message || "Failed to delete template");
    } finally {
      setDeleteConfirmOpen(false);
      setPromptToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Templates</h1>
        <p className="text-gray-500 mt-2">
          Manage standard templates for agents and system prompts.
        </p>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-max">
        <button
          onClick={() => setActiveTab("agents")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "agents"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Agent Templates
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "prompts"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          Prompt Templates
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Only show wizard header for Agents tab */}
        {activeTab === "agents" && (
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Agent Template
              </h2>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
            </div>
            {/* Simple Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        )}
        {activeTab === "prompts" && (
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingPromptId
                ? "Edit Prompt Template"
                : "Create New Prompt Template"}
            </h2>
          </div>
        )}

        {/* Global Feedback */}
        {(success || error) && (
          <div className="px-6 pt-6">
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Action successful</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Agent Form Wizard */}
        {activeTab === "agents" && (
          <form onSubmit={handleNextStep} className="p-6 space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={agentFormData.name}
                    onChange={(e) =>
                      setAgentFormData({
                        ...agentFormData,
                        name: e.target.value,
                      })
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
                    onChange={(o) =>
                      setAgentFormData({
                        ...agentFormData,
                        role: o?.value || "virtual_assistant",
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
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
                    className="w-full px-3 py-2 border rounded-lg h-24"
                    placeholder="Describe this agent..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    AI Model (Required)
                  </label>
                  <Select
                    options={aiModels.map((m) => ({
                      value: m.id,
                      label: m.name,
                    }))}
                    value={aiModels
                      .map((m) => ({ value: m.id, label: m.name }))
                      .find((o) => o.value === agentFormData.ai_model_id)}
                    onChange={(o) =>
                      setAgentFormData({
                        ...agentFormData,
                        ai_model_id: o?.value || "",
                      })
                    }
                    placeholder="Select Model..."
                  />
                  {/* Validation message if needed */}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <CreatableSelect
                    isMulti
                    onChange={(opts) =>
                      setAgentFormData({
                        ...agentFormData,
                        tags: opts.map((o) => o.value),
                      })
                    }
                    value={agentFormData.tags.map((t) => ({
                      value: t,
                      label: t,
                    }))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Appearance */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={agentFormData.primary_color}
                      onChange={(e) =>
                        setAgentFormData({
                          ...agentFormData,
                          primary_color: e.target.value,
                        })
                      }
                      className="h-10 w-10 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={agentFormData.primary_color}
                      onChange={(e) =>
                        setAgentFormData({
                          ...agentFormData,
                          primary_color: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Welcome Message
                  </label>
                  <input
                    type="text"
                    value={agentFormData.welcome_message}
                    onChange={(e) =>
                      setAgentFormData({
                        ...agentFormData,
                        welcome_message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Font Family
                  </label>
                  <input
                    type="text"
                    value={agentFormData.font_family}
                    onChange={(e) =>
                      setAgentFormData({
                        ...agentFormData,
                        font_family: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Behavior */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    System Instruction / Prompt Template
                  </label>
                  <Select
                    options={promptTemplates.map((p) => ({
                      value: p.id,
                      label: p.title,
                    }))}
                    value={promptTemplates
                      .map((p) => ({ value: p.id, label: p.title }))
                      .find(
                        (o) => o.value === agentFormData.prompt_template_id
                      )}
                    onChange={(o) =>
                      setAgentFormData({
                        ...agentFormData,
                        prompt_template_id: o?.value || "",
                      })
                    }
                    placeholder="Select a Prompt Template..."
                  />
                  <p className="text-xs text-gray-500">
                    Select a predefined system prompt.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Temperature: {agentFormData.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={agentFormData.temperature}
                      onChange={(e) =>
                        setAgentFormData({
                          ...agentFormData,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={agentFormData.max_tokens}
                      onChange={(e) =>
                        setAgentFormData({
                          ...agentFormData,
                          max_tokens: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={
                  loading || (currentStep === 1 && !agentFormData.ai_model_id)
                }
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : currentStep === TOTAL_STEPS
                    ? "Create Template"
                    : "Next"}
                {currentStep !== TOTAL_STEPS && !loading && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        )}

        {/* Prompt Template Tab Content (Simplified Reuse) */}
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    System Prompt Content
                  </label>
                  <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setPromptEditorTab("write")}
                      className={`px-3 py-1 rounded-md transition-colors ${promptEditorTab === "write" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptEditorTab("preview")}
                      className={`px-3 py-1 rounded-md transition-colors ${promptEditorTab === "preview" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {promptEditorTab === "write" ? (
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
                    placeholder="You are a helpful AI assistant... (Markdown supported)"
                  />
                ) : (
                  <div className="w-full px-3 py-2 border rounded-lg h-64 overflow-y-auto bg-gray-50 prose prose-sm max-w-none">
                    {promptFormData.content ? (
                      <ReactMarkdown>{promptFormData.content}</ReactMarkdown>
                    ) : (
                      <span className="text-gray-400 italic">
                        Nothing to preview
                      </span>
                    )}
                  </div>
                )}
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
                            onClick={() => handleDeletePromptClick(template.id)}
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
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeletePrompt}
        title="Delete Template"
        description="Are you sure you want to delete this prompt template?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
