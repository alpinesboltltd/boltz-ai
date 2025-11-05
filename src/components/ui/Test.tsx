"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AgentSchema,
  AgentStatus,
  AgentType,
  AgentPosition,
  AgentIconSize,
  AgentBubbleStyle,
  type AgentSchemaInput,
} from "@/types/agent";
import { AI_MODELS, getModelsByType } from "@/mock-data/ai-models";
import { TrainingSources } from "@/components/dashboard/TrainingSources";
import { BotPreview } from "@/components/chatbot/BotPreview";
import { agentApi } from "@/lib/agent-api";
import { useCurrentUser } from "@/store/authStore";
import { Spinner } from "@/components/common/Spinner";
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface AgentAppearanceForm {
  welcome_message: string;
  primary_color: string;
  position: AgentPosition;
  icon_size: AgentIconSize;
  bubble_style: AgentBubbleStyle;
  chat_icon: string;
  font_family: string;
}

const templates = [
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Handle customer inquiries and support requests",
    icon: "🛎️",
  },
  {
    id: "sales",
    name: "Sales Assistant",
    description: "Help customers find and purchase products",
    icon: "💼",
  },
  {
    id: "faq",
    name: "FAQ Agent",
    description: "Answer frequently asked questions",
    icon: "❓",
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    description: "Capture leads and qualify prospects",
    icon: "🎯",
  },
  {
    id: "product-recommender",
    name: "Product Recommender",
    description: "Recommend products based on customer preferences",
    icon: "🛍️",
  },
  {
    id: "appointment",
    name: "Appointment Scheduler",
    description: "Help users book appointments and meetings",
    icon: "📅",
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with a blank template",
    icon: "📝",
  },
];

export default function CreateAgentPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentData, setAgentData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Refs for animation
  const button1Ref = useRef<HTMLButtonElement>(null);
  const button2Ref = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const agentForm = useForm<AgentSchemaInput>({
    resolver: zodResolver(AgentSchema),
    defaultValues: {
      name: "",
      description: "",
      agent_type: AgentType.TEXT,
      ai_model: "",
      ai_provider: "",
      credits_per_1k: 0,
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
  const selectedModel = agentForm.watch("ai_model");
  const appearanceData = appearanceForm.watch();
  const availableModels = getModelsByType(selectedAgentType);

  // Initialize buttons to hidden state
  useGSAP(() => {
    if (button1Ref.current && button2Ref.current) {
      gsap.set([button1Ref.current, button2Ref.current], {
        opacity: 0,
        scale: 0,
        y: -20,
      });
    }
  }, { scope: containerRef });

  // Animation for dropdown toggle
  useGSAP(() => {
    if (button1Ref.current && button2Ref.current) {
      const tl = gsap.timeline();

      if (isQuickCreateOpen) {
        tl.to([button1Ref.current, button2Ref.current], {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'back.out(1.7)',
        });
      } else {
        tl.to([button2Ref.current, button1Ref.current], {
          opacity: 0,
          scale: 0,
          y: -20,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.in(1.7)',
        });
      }
    }
  }, { dependencies: [isQuickCreateOpen], scope: containerRef });

  // Update AI provider and credits when model changes
  useEffect(() => {
    if (selectedModel) {
      const model = AI_MODELS.find((m) => m.model === selectedModel);
      if (model) {
        agentForm.setValue("ai_provider", model.provider);
        agentForm.setValue("credits_per_1k", model.credits);
      }
    }
  }, [selectedModel, agentForm]);

  const handleAgentSubmit = async (data: AgentSchemaInput) => {
    setIsLoading(true);
    try {
      const newAgentId = agentApi.generateId();
      const agentPayload = {
        id: newAgentId,
        user_id: user!.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const savedAgent = await agentApi.createAgent(agentPayload);
      setAgentId(newAgentId);
      setAgentData(savedAgent);
      setStep(2);
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainingComplete = async () => {
    if (!agentId) return;

    setIsLoading(true);
    try {
      await agentApi.updateAgent(agentId, {
        updated_at: new Date().toISOString(),
      });
      setStep(3);
    } catch (error) {
      console.error("Error updating training:", error);
      alert("Failed to save training data. Please try again.");
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
        agentApi.createAppearance({
          agent_id: agentId,
          ...data,
          created_at: timestamp,
          updated_at: timestamp,
        }),
        agentApi.createBehavior({
          agent_id: agentId,
          initial_messages: JSON.stringify([data.welcome_message]),
          fallback_message:
            "I'm sorry, I don't understand that question. Could you rephrase it?",
          enable_human_handoff: false,
          offline_message:
            "Our team is currently offline. Please leave a message and we'll get back to you.",
          system_instruction: "You are a helpful AI assistant.",
          prompt_template: "{{conversation}}",
          temperature: 0.7,
          max_tokens: 500,
          created_at: timestamp,
          updated_at: timestamp,
        }),
        agentApi.createStats({
          agent_id: agentId,
          total_messages: 0,
          unique_users: 0,
          average_rating: 0,
          response_rate: 0,
          conversions_count: 0,
          last_calculated_at: timestamp,
        }),
        agentApi.updateAgent(agentId, {
          status: AgentStatus.ACTIVE,
          updated_at: timestamp,
        }),
      ]);

      router.push(`/dashboard/agent/${agentId}`);
    } catch (error) {
      console.error("Error finalizing agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCreate = (type: 'scratch' | 'template') => {
    if (type === 'template') {
      setSelectedTemplate(templates[0].id);
    }
    setIsQuickCreateOpen(false);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return agentForm.formState.isValid;
      case 2:
        return true;
      case 3:
        return appearanceForm.formState.isValid;
      default:
        return true;
    }
  };

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

          {/* Animated Quick Create Button */}
          <div ref={containerRef} className="relative mt-4 sm:mt-0 flex flex-col items-end">
            <button
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Quick Create
            </button>

            <div className="absolute flex gap-2 mt-12 z-10">
              <button
                ref={button1Ref}
                onClick={() => handleQuickCreate('scratch')}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
              >
                Start from Scratch
              </button>
              <button
                ref={button2Ref}
                onClick={() => handleQuickCreate('template')}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap"
              >
                Use Template
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-8">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
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
                      className={`text-xs font-semibold uppercase tracking-wide ${step >= stepItem.id ? "text-primary-600" : "text-gray-500"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Agent Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        {...agentForm.register("name")}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., Customer Support Assistant"
                      />
                      {agentForm.formState.errors.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {agentForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        {...agentForm.register("description")}
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe what your AI agent will do"
                      />
                    </div>
                  </div>

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
                          value: "text",
                          label: "Text Only",
                          icon: "💬",
                          desc: "Text-based conversations",
                        },
                        {
                          value: "voice",
                          label: "Voice Only",
                          icon: "🎤",
                          desc: "Voice interactions",
                        },
                        {
                          value: "multimodal",
                          label: "Multimodal",
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
                    <div className="space-y-4">
                      {availableModels.map((model) => (
                        <label
                          key={model.model}
                          className={`relative rounded-lg border p-4 cursor-pointer flex items-center ${selectedModel === model.model
                              ? "border-primary-500 ring-2 ring-primary-500"
                              : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          <input
                            {...agentForm.register("ai_model")}
                            type="radio"
                            value={model.model}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">
                                {model.provider} - {model.model}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {model.credits} credits/1k tokens
                              </span>
                            </div>
                          </div>
                          {selectedModel === model.model && (
                            <div className="ml-4 text-primary-600">
                              <CheckCircleIcon className="h-5 w-5" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                    {agentForm.formState.errors.ai_model && (
                      <p className="mt-2 text-sm text-red-600">
                        {agentForm.formState.errors.ai_model.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isLoading ? <Spinner size="sm" color="white" /> : "Continue"}
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
                  Add knowledge sources to help your agent provide accurate responses.
                </p>

                {agentId && (
                  <TrainingSources
                    agentId={agentId}
                    onDataAdded={(data) => console.log("Training data added:", data)}
                  />
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleTrainingComplete}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isLoading ? <Spinner size="sm" color="white" /> : "Continue"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Appearance */}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)}>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Customize Appearance
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Welcome Message
                      </label>
                      <textarea
                        {...appearanceForm.register("welcome_message")}
                        rows={3}
                        className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Primary Color
                        </label>
                        <input
                          {...appearanceForm.register("primary_color")}
                          type="color"
                          className="mt-1 h-10 w-full rounded-md border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <select
                          {...appearanceForm.register("position")}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Icon Size
                        </label>
                        <select
                          {...appearanceForm.register("icon_size")}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bubble Style
                        </label>
                        <select
                          {...appearanceForm.register("bubble_style")}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="round">Round</option>
                          <option value="square">Square</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                    >
                      {isLoading ? <Spinner size="sm" color="white" /> : "Create Agent"}
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