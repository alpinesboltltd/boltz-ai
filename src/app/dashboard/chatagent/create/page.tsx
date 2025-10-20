"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

interface AgentAppearanceForm {
  welcome_message: string;
  primary_color: string;
  position: AgentPosition;
  icon_size: AgentIconSize;
  bubble_style: AgentBubbleStyle;
  chat_icon: string;
  font_family: string;
}

interface AgentPreviewData {
  name?: string;
}

export default function CreateAgentPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentData, setAgentData] = useState<AgentPreviewData | null>(null);


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
      // Update agent status to indicate training is complete
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
      // Save appearance settings
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
            "Our team is currently offline. Please leave a message and we\'ll get back to you.",
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

      // Redirect to agent dashboard
      router.push(`/dashboard/chatagent/${agentId}`); // did the routing to the playground page after agrent creation here
    } catch (error) {
      console.error("Error finalizing agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {[
              { number: 1, title: "Basic Info", desc: "Name & model" },
              { number: 2, title: "Training", desc: "Knowledge base" },
              { number: 3, title: "Customize", desc: "Appearance & preview" },
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      step >= stepItem.number
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepItem.number ? "✓" : stepItem.number}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                      {stepItem.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {stepItem.desc}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                      step > stepItem.number ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {step === 1 && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Create Your AI Agent
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  Let&apos;s start with the basics. Choose a name, type, and AI
                  model for your agent.
                </p>
              </div>

              <form
                onSubmit={agentForm.handleSubmit(handleAgentSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Agent Name
                    </label>
                    <input
                      {...agentForm.register("name")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., Customer Support Agent"
                    />
                    {agentForm.formState.errors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {agentForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      {...agentForm.register("description")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Describe what your agent does and how it helps users"
                    />
                    {agentForm.formState.errors.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {agentForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
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
                        className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          selectedAgentType === type.value
                            ? "border-indigo-500 bg-indigo-50 shadow-md"
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
                          <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    AI Model
                  </label>
                  <select
                    {...agentForm.register("ai_model")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select an AI model</option>
                    {availableModels.map((model) => (
                      <option key={model.model} value={model.model}>
                        {model.provider} - {model.model} ({model.credits}{" "}
                        credits/1k tokens)
                      </option>
                    ))}
                  </select>
                  {agentForm.formState.errors.ai_model && (
                    <p className="mt-2 text-sm text-red-600">
                      {agentForm.formState.errors.ai_model.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isLoading ? "Creating..." : "Continue to Training"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Train Your Agent
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2">
                  Add knowledge sources to help your agent provide accurate
                  responses.
                </p>
              </div>

              {agentId && (
                <TrainingSources
                  agentId={agentId}
                  onDataAdded={(data) =>
                    console.log("Training data added:", data)
                  }
                />
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={handleTrainingComplete}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {isLoading ? "Saving..." : "Continue to Customize"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
              {/* Customization Form */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Customize Appearance
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">
                    Personalize how your agent looks and behaves.
                  </p>
                </div>

                <form
                  onSubmit={appearanceForm.handleSubmit(handleAppearanceSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Welcome Message
                    </label>
                    <textarea
                      {...appearanceForm.register("welcome_message")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Hi! How can I help you today?"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Primary Color
                      </label>
                      <div className="relative">
                        <input
                          {...appearanceForm.register("primary_color")}
                          type="color"
                          className="w-full h-10 sm:h-12 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Position
                      </label>
                      <select
                        {...appearanceForm.register("position")}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Icon Size
                      </label>
                      <select
                        {...appearanceForm.register("icon_size")}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Bubble Style
                      </label>
                      <select
                        {...appearanceForm.register("bubble_style")}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                      >
                        <option value="round">Round</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isLoading ? "Creating Agent..." : "Create Agent"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview */}
              <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Live Preview
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    See how your agent will look to users
                  </p>
                </div>
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
  );
}
