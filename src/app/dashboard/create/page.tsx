"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AgentStatus,
  AgentType,
  AgentPosition,
  AgentIconSize,
  AgentBubbleStyle,
  Agent,
  CreateAgentRequest,
  CreateAgentRequestSchema,
} from "@/types/agent";
import { TrainingSources } from "@/components/dashboard/TrainingSources";
import { BotPreview } from "@/components/chatbot/BotPreview";
import { agentsAPI, systemAPI } from "@/lib/api";
import { agentTypeToEnum } from "@/lib/agentTypeSerializer";
import { accessToken, useCurrentUser } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAIModelsStore } from "@/store/aiModelsStore";
import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "@/store/toastStore";

interface AgentAppearanceForm {
  welcome_message: string;
  primary_color: string;
  position: AgentPosition;
  icon_size: AgentIconSize;
  bubble_style: AgentBubbleStyle;
  chat_icon: string;
  font_family: string;
}

interface APITemplate {
  id: string;
  title: string;
  content: string;
}

interface UITemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}



export default function CreateAgentPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const { currentWorkspace } = useWorkspaceStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState<UITemplate[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await systemAPI.listTemplates();
        // Map API templates to UI format
        const apiTemplates = res.data.map((t: APITemplate) => ({
          id: t.id,
          name: t.title,
          description: t.content.substring(0, 50) + "...",
          icon: "🤖", // Default icon
        }));
        setTemplates(apiTemplates);
      } catch (error) {
        console.error("Failed to fetch templates", error);
        // Fallback to static if needed, or empty
      }
    };
    fetchTemplates();
  }, []);
  // const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Refs for animation
  const button1Ref = useRef<HTMLButtonElement>(null);
  const button2Ref = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const availableModels = getModelsByType(selectedAgentType);

  useEffect(() => {
    if (models.length === 0) {
      fetchModels();
    }
  }, [models.length, fetchModels]);

  // Initialize buttons to hidden state
  useGSAP(
    () => {
      if (button1Ref.current && button2Ref.current) {
        gsap.set([button1Ref.current, button2Ref.current], {
          opacity: 0,
          scale: 0,
          y: -20,
        });
      }
    },
    { scope: containerRef }
  );
  // FIXME:INVESTIGATE
  // Animation for dropdown toggle
  // useGSAP(
  //   () => {
  //     if (button1Ref.current && button2Ref.current) {
  //       const tl = gsap.timeline();

  //       if (isQuickCreateOpen) {
  //         tl.to([button1Ref.current, button2Ref.current], {
  //           opacity: 1,
  //           scale: 1,
  //           y: 0,
  //           duration: 0.5,
  //           stagger: 0.12,
  //           ease: "back.out(1.7)",
  //         });
  //       } else {
  //         tl.to([button2Ref.current, button1Ref.current], {
  //           opacity: 0,
  //           scale: 0,
  //           y: -20,
  //           duration: 0.4,
  //           stagger: 0.1,
  //           ease: "back.in(1.7)",
  //         });
  //       }
  //     }
  //   },
  //   { dependencies: [isQuickCreateOpen], scope: containerRef }
  // );

  // Update AI provider and credits when model changes

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
        // Update existing agent
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
        // Create new agent
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
      // NOTE: Implement actual training api
      // await agentsAPI.update(agentId, {
      //   updated_at: new Date().toISOString(),
      // });
      setStep(3);
    } catch (error) {
      console.error("Error updating training:", error);
      toast.error(
        "Training Failed",
        "Failed to save training data. Please try again."
      );
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

      router.push(`/dashboard/agent/${agentId}`);
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

  // FIXME: LOOK INTO ALL OF THESE

  // const handleQuickCreate = (type: "scratch" | "template") => {
  //   if (type === "template") {
  //     setSelectedTemplate(templates[0].id);
  //   }
  //   setIsQuickCreateOpen(false);
  // };

  // const isStepComplete = () => {
  //   switch (step) {
  //     case 1:
  //       return agentForm.formState.isValid;
  //     case 2:
  //       return true;
  //     case 3:
  //       return appearanceForm.formState.isValid;
  //     default:
  //       return true;
  //   }
  // };

  const prevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New AI Agent
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Set up a new AI agent for your business in just a few steps.
            </p>
          </div>
        </div>

        {modelsLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Spinner size="sm" />
            <span>Loading AI models...</span>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mt-8">
          <nav aria-label="Progress">
            <ol
              role="list"
              className="space-y-4 md:flex md:space-y-0 md:space-x-8"
            >
              {[
                { id: 1, name: "Basic Info", description: "Name and model" },
                { id: 2, name: "Training", description: "Knowledge base" },
                { id: 3, name: "Appearance", description: "Customize look" },
              ].map((stepItem) => (
                <li key={stepItem.id} className="md:flex-1">
                  <div
                    className={`group flex flex-col border-l-4 py-2 pl-4 ${step > stepItem.id
                      ? "border-primary-600"
                      : step === stepItem.id
                        ? "border-primary-600"
                        : "border-gray-200"
                      } md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${step >= stepItem.id
                        ? "text-primary-600"
                        : "text-gray-500"
                        }`}
                    >
                      Step {stepItem.id}
                    </span>
                    <span className="text-sm font-medium">{stepItem.name}</span>
                    <span className="text-xs text-gray-500">
                      {stepItem.description}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <form onSubmit={agentForm.handleSubmit(handleAgentSubmit)}>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h2>

                <div className="space-y-6">
                  <Input
                    {...agentForm.register("name")}
                    label={
                      <>
                        Agent Name <span className="text-red-500">*</span>
                      </>
                    }
                    type="text"
                    placeholder="e.g., Customer Support Assistant"
                    error={agentForm.formState.errors.name?.message}
                  />

                  <Textarea
                    {...agentForm.register("description")}
                    label="Description"
                    rows={3}
                    placeholder="Describe what your AI agent will do"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a Template
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`relative rounded-lg border p-4 cursor-pointer ${selectedTemplate === template.id
                            ? "border-primary-500 ring-2 ring-primary-500"
                            : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{template.icon}</div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {template.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {template.description}
                              </p>
                            </div>
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2 text-primary-600">
                              <CheckCircleIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Agent Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: AgentType.TEXT,
                          label: "Text Only",
                          icon: "💬",
                          desc: "Text-based conversations",
                        },
                        {
                          value: AgentType.VOICE,
                          label: "Voice Only",
                          icon: "🎤",
                          desc: "Voice interactions",
                        },
                        {
                          value: AgentType.VISION,
                          label: "Vision (Multimodal)",
                          icon: "🎭",
                          desc: "Text, voice & images",
                        },
                      ].map((type) => (
                        <label
                          key={type.value}
                          className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${selectedAgentType === type.value
                            ? "border-primary-500 bg-primary-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <input
                            {...agentForm.register("agent_type")}
                            type="radio"
                            value={type.value}
                            className="sr-only"
                          />
                          <span className="text-3xl mb-3">{type.icon}</span>
                          <span className="text-base font-semibold text-gray-900">
                            {type.label}
                          </span>
                          <span className="text-sm text-gray-500 text-center mt-1">
                            {type.desc}
                          </span>
                          {selectedAgentType === type.value && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select AI Model <span className="text-red-500">*</span>
                    </label>
                    {availableModels.length === 0 ? (
                      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                        No models available for the selected agent type. Please
                        try a different type.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableModels.map((model) => (
                          <label
                            key={model.id}
                            className={`relative rounded-lg border p-4 cursor-pointer flex items-center ${selectedModel === model.id
                              ? "border-primary-500 ring-2 ring-primary-500"
                              : "border-gray-300 hover:border-gray-400"
                              }`}
                          >
                            <input
                              {...agentForm.register("ai_model_id")}
                              type="radio"
                              value={model.id}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {model.provider} - {model.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {model.credits_per_1k} credits/1k tokens
                                </span>
                              </div>
                            </div>
                            {selectedModel === model.id && (
                              <div className="ml-4 text-primary-600">
                                <CheckCircleIcon className="h-5 w-5" />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                    {agentForm.formState.errors.ai_model_id && (
                      <p className="mt-2 text-sm text-red-600">
                        {agentForm.formState.errors.ai_model_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : agentId ? (
                      "Update & Continue"
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Training */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Train Your Agent
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Add knowledge sources to help your agent provide accurate
                  responses.
                </p>

                {agentId && (
                  <TrainingSources
                    agentId={agentId}
                    onDataAdded={(data) =>
                      console.log("Training data added:", data)
                    }
                  />
                )}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleTrainingComplete}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Appearance */}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form
                  onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)}
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Customize Appearance
                  </h2>

                  <div className="space-y-6">
                    <Textarea
                      {...appearanceForm.register("welcome_message")}
                      label="Welcome Message"
                      rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        {...appearanceForm.register("primary_color")}
                        label="Primary Color"
                        type="color"
                        className="h-10"
                      />
                      <Select
                        {...appearanceForm.register("position")}
                        label="Position"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        "Create Agent"
                      )}
                    </button>
                  </div>
                </form>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Live Preview
                  </h3>
                  <BotPreview
                    botConfig={appearanceData}
                    name={agentData?.name || "Your Agent"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
