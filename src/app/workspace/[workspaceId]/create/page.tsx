"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser, accessToken } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAIModelsStore } from "@/store/aiModelsStore";
import { useSupportedProvidersStore } from "@/store/supportedProvidersStore";
import { agentsAPI, systemAPI } from "@/lib/api";
import { toast } from "@/store/toastStore";
import {
  Agent,
  AgentType,
  AgentStatus,
  AgentPosition,
  AgentIconSize,
  AgentBubbleStyle,
  CreateAgentRequestSchema,
  CreateAgentRequest,
} from "@/types/agent";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { Spinner } from "@/components/common/Spinner";
import { TrainingSources } from "@/components/dashboard/TrainingSources";
import { BotPreview } from "@/components/chatbot/BotPreview";
import { ModelSelector } from "@/components/common/ModelSelector";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mic,
  ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UITemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface APITemplate {
  id: string;
  title: string;
  content: string;
}

interface AgentAppearanceForm {
  welcome_message: string;
  primary_color: string;
  position: AgentPosition;
  icon_size: AgentIconSize;
  bubble_style: AgentBubbleStyle;
  chat_icon: string;
  font_family: string;
}

const STEPS = [
  { id: 1, name: "Setup", description: "Basic info", icon: MessageSquare },
  { id: 2, name: "Training", description: "Knowledge base", icon: Sparkles },
  { id: 3, name: "Customize", description: "Appearance", icon: Zap },
];

const agentTypeToEnum = (type: AgentType | string): number => {
  if (typeof type === "number") return type;
  switch (type) {
    case "text":
      return 1;
    case "voice":
      return 2;
    case "multimodal":
      return 0;
    default:
      return 1;
  }
};

export default function CreateAgentPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get("templateId");

  const { currentWorkspace } = useWorkspaceStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(
    templateIdParam || ""
  );
  const [templates, setTemplates] = useState<UITemplate[]>([]);

  useEffect(() => {
    if (templateIdParam) {
      setSelectedTemplate(templateIdParam);
    }
  }, [templateIdParam]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await systemAPI.listTemplates();
        const apiTemplates = res.data.map((t: APITemplate) => ({
          id: t.id,
          name: t.title,
          description: t.content.substring(0, 50) + "...",
          icon: "🤖",
        }));
        setTemplates(apiTemplates);
      } catch (error) {
        console.error("Failed to fetch templates", error);
      }
    };
    fetchTemplates();
  }, []);

  const agentForm = useForm<CreateAgentRequest>({
    resolver: zodResolver(CreateAgentRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      agent_type: AgentType.TEXT,
      ai_model_id: "",
      status: AgentStatus.DRAFT,
    },
  });

  const appearanceForm = useForm<AgentAppearanceForm>({
    defaultValues: {
      welcome_message: "Hi! How can I help you today?",
      primary_color: "#6366f1",
      position: AgentPosition.BOTTOM_RIGHT,
      icon_size: AgentIconSize.MEDIUM,
      bubble_style: AgentBubbleStyle.ROUND,
      chat_icon: "default",
      font_family: "Inter",
    },
  });

  const selectedAgentType = agentForm.watch("agent_type");
  const selectedModel = agentForm.watch("ai_model_id");
  const appearanceData = appearanceForm.watch();

  const {
    models,
    isLoading: modelsLoading,
    fetchModels,
    getModelsByType,
  } = useAIModelsStore();

  const {
    providers: supportedProviders,
    fetchProviders: fetchSupportedProviders,
  } = useSupportedProvidersStore();

  const [selectedProviderFilter, setSelectedProviderFilter] =
    useState<string>("all");

  const availableModels = getModelsByType(selectedAgentType).filter(
    (m) =>
      selectedProviderFilter === "all" ||
      m.provider.toLowerCase() === selectedProviderFilter.toLowerCase()
  );

  useEffect(() => {
    if (models.length === 0) {
      fetchModels();
    }
    fetchSupportedProviders();
  }, [models.length, fetchModels, fetchSupportedProviders]);

  const handleAgentSubmit = async (data: CreateAgentRequest) => {
    try {
      setIsLoading(true);
      if (!user || !user.id) {
        toast.error(
          "Creation Failed",
          "No user found. Please login and try again."
        );
        return;
      }

      if (agentId) {
        await agentsAPI.update(
          agentId,
          {
            ...data,
            id: agentId,
            agent_type: agentTypeToEnum(data.agent_type),
          },
          accessToken()
        );
        toast.success("Updated", "Agent details updated successfully");
      } else {
        const agentPayload = {
          ...data,
          userId: user.id,
          agent_type: agentTypeToEnum(data.agent_type),
          workspace_id: currentWorkspace?.id,
          template_id: selectedTemplate,
        };

        const { data: agent } = await agentsAPI.create(
          agentPayload,
          accessToken()
        );
        setAgentId(agent.id);
        setAgentData(agent);
      }
      setStep(2);
    } catch (error) {
      console.error("Error saving agent:", error);
      toast.error("Save Failed", "Failed to save agent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingComplete = async () => {
    if (!agentId) return;
    setIsLoading(true);
    try {
      // Simulate training completion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep(3);
    } catch (error) {
      console.error("Error updating training:", error);
      toast.error("Training Failed", "Failed to save training data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceSubmit = async (data: AgentAppearanceForm) => {
    if (!agentId) return;

    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString();

      await Promise.all([
        agentsAPI.createAppearance({
          agent_id: agentId,
          ...data,
          created_at: timestamp,
          updated_at: timestamp,
        }),
        agentsAPI.createBehavior({
          agent_id: agentId,
          initial_messages: JSON.stringify([data.welcome_message]),
          fallback_message:
            "I'm sorry, I don't understand that question. Could you rephrase it?",
          enable_human_handoff: false,
          offline_message:
            "Our team is currently offline. Please leave a message and we'll get back to you.",
          system_instruction: "You are a helpful AI assistant.",
          prompt_template: "{{conversation}}",
          prompt_template_id: selectedTemplate || undefined,
          temperature: 0.7,
          max_tokens: 500,
          created_at: timestamp,
          updated_at: timestamp,
        }),
      ]);

      router.push(`/workspace/${currentWorkspace?.id}/agent/${agentId}`);
      toast.success("Success", "Agent created successfully!");
    } catch (error) {
      console.error("Error finalizing agent:", error);
      toast.error(
        "Creation Failed",
        "Failed to create agent. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Create New AI Agent
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design, train, and deploy your intelligent assistant in three simple
            steps.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="relative flex justify-between max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center gap-2 bg-gray-50 px-2"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4",
                      isActive
                        ? "bg-primary-600 border-primary-100 text-white shadow-lg shadow-primary-500/30"
                        : "bg-white border-gray-200 text-gray-400"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-sm font-semibold transition-colors",
                        isActive ? "text-primary-700" : "text-gray-500"
                      )}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-400 hidden sm:block">
                      {s.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div
          layout
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    onSubmit={agentForm.handleSubmit(handleAgentSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <Input
                          {...agentForm.register("name")}
                          label="Agent Name"
                          placeholder="e.g., Customer Support Assistant"
                          error={agentForm.formState.errors.name?.message}
                          className="text-lg"
                        />
                        <Textarea
                          {...agentForm.register("description")}
                          label="Description"
                          rows={4}
                          placeholder="Describe what your AI agent will do..."
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Agent Type
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              {
                                value: AgentType.TEXT,
                                label: "Text Only",
                                icon: MessageSquare,
                                desc: "Best for chat support",
                              },
                              {
                                value: AgentType.VOICE,
                                label: "Voice Only",
                                icon: Mic,
                                desc: "For phone/voice interactions",
                              },
                              {
                                value: AgentType.MULTIMODAL,
                                label: "Multimodal",
                                icon: ImageIcon,
                                desc: "Text, voice & image support",
                              },
                            ].map((type) => (
                              <label
                                key={type.value}
                                className={cn(
                                  "relative flex items-center p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50",
                                  selectedAgentType === type.value
                                    ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500"
                                    : "border-gray-200"
                                )}
                              >
                                <input
                                  {...agentForm.register("agent_type")}
                                  type="radio"
                                  value={type.value}
                                  className="sr-only"
                                />
                                <div
                                  className={cn(
                                    "p-2 rounded-lg mr-4",
                                    selectedAgentType === type.value
                                      ? "bg-primary-100 text-primary-600"
                                      : "bg-gray-100 text-gray-500"
                                  )}
                                >
                                  <type.icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="block text-sm font-semibold text-gray-900">
                                    {type.label}
                                  </span>
                                  <span className="block text-xs text-gray-500">
                                    {type.desc}
                                  </span>
                                </div>
                                {selectedAgentType === type.value && (
                                  <CheckCircle2 className="absolute right-4 w-5 h-5 text-primary-600" />
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select AI Model
                        </label>
                        <p className="text-sm text-gray-500">
                          Choose the AI model that powers your agent.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <ModelSelector
                          value={selectedModel}
                          onChange={(modelId) =>
                            agentForm.setValue("ai_model_id", modelId)
                          }
                          models={availableModels}
                          loading={modelsLoading}
                        />

                        {/* Provider Filters */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProviderFilter("all")}
                            className={cn(
                              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                              selectedProviderFilter === "all"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            All
                          </button>
                          {supportedProviders
                            .filter((p) => p.is_active)
                            .map((p) => (
                              <button
                                type="button"
                                key={p.id}
                                onClick={() =>
                                  setSelectedProviderFilter(p.name)
                                }
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                                  selectedProviderFilter === p.name
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                              >
                                {p.name}
                              </button>
                            ))}
                        </div>
                      </div>

                      {agentForm.formState.errors.ai_model_id && (
                        <p className="mt-2 text-sm text-red-600">
                          {agentForm.formState.errors.ai_model_id.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary px-8 py-3 shadow-lg shadow-primary-500/25"
                      >
                        {isLoading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          <span className="flex items-center">
                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Knowledge Base
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          Train your agent with custom data sources.
                        </p>
                      </div>
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>

                    {agentId && (
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <TrainingSources
                          agentId={agentId}
                          onDataAdded={(data) =>
                            console.log("Training data added:", data)
                          }
                        />
                      </div>
                    )}

                    <div className="flex justify-between pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-ghost"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleTrainingComplete}
                        disabled={isLoading}
                        className="btn btn-primary px-8 shadow-lg shadow-primary-500/25"
                      >
                        {isLoading ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          <span className="flex items-center">
                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form
                      onSubmit={appearanceForm.handleSubmit(
                        handleAppearanceSubmit
                      )}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          Customize Appearance
                        </h2>

                        <div className="space-y-6">
                          <Textarea
                            {...appearanceForm.register("welcome_message")}
                            label="Welcome Message"
                            rows={3}
                            placeholder="Hi! How can I help you today?"
                          />

                          <div className="grid grid-cols-2 gap-6">
                            <Input
                              {...appearanceForm.register("primary_color")}
                              label="Brand Color"
                              type="color"
                              className="h-12 p-1 cursor-pointer"
                            />
                            <Select
                              {...appearanceForm.register("position")}
                              label="Widget Position"
                            >
                              <option value="bottom-right">Bottom Right</option>
                              <option value="bottom-left">Bottom Left</option>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <Select
                              {...appearanceForm.register("icon_size")}
                              label="Icon Size"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </Select>
                            <Select
                              {...appearanceForm.register("bubble_style")}
                              label="Bubble Style"
                            >
                              <option value="round">Round</option>
                              <option value="square">Square</option>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-6 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn btn-ghost"
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn btn-primary px-8 shadow-lg shadow-primary-500/25"
                        >
                          {isLoading ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            <span className="flex items-center">
                              Create Agent <Sparkles className="ml-2 w-4 h-4" />
                            </span>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 flex flex-col items-center justify-center min-h-[500px]">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">
                        Live Preview
                      </h3>
                      <BotPreview
                        botConfig={appearanceData}
                        name={agentData?.name || "Your Agent"}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
