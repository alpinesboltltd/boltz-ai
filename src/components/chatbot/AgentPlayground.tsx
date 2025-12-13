/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  MessageRoles,
  SystemPromptTemplate,
  PlaygroundConfig,
  AgentType,
} from "@/types/agent";
import { Chat, agentsAPI, systemAPI } from "@/lib/api";
import { playgroundAPI } from "@/lib/playground-api";
import {
  useAgentData,
  useAgentBehavior,
  useAgentAppearance,
} from "@/store/agentDetailStore";
import { useMemo } from "react";
import { SYSTEM_PROMPT_TEMPLATES } from "@/data/systemPrompts";
import Image from "next/image";
import Select from "react-select";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { useAIModelsStore } from "@/store/aiModelsStore";
import { AIModel } from "@/lib/static/ai-models";
import { agentTypeToEnum, enumToAgentType } from "@/lib/agentTypeSerializer";

export function AgentPlayground() {
  const agent = useAgentData();
  const behavior = useAgentBehavior();
  const appearance = useAgentAppearance();
  const agentId = agent?.id;
  const { models, getModelsByType, fetchModels } = useAIModelsStore();

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // ... (keep primaryColor)
  const primaryColor = useMemo(
    () => appearance?.primary_color || "#0284c7",
    [appearance?.primary_color]
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const mobileTabContentRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<PlaygroundConfig>({
    ai_model_id: agent?.ai_model_id || "adaf",
    ai_model_name: agent?.name || "gpt-40",
    maxTokens: behavior?.max_tokens || 500,
    temperature: behavior?.temperature || 0.5,
    systemInstruction:
      behavior?.system_instruction || "You are a helpful assistant",
    selectedTemplate: "",
  });
  const [customPrompts, setCustomPrompts] = useState<SystemPromptTemplate[]>(
    []
  );
  const [dbPrompts, setDbPrompts] = useState<any[]>([]);
  const [testQueries, setTestQueries] = useState<string[]>([]);

  // Fetch DB Prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        // Fetch prompts matching the agent's role, or all if no role matches
        const res = await systemAPI.listTemplates(agent?.role);
        if (res.templates) {
          setDbPrompts(
            res.templates.map((t: any) => ({
              id: t.id,
              name: t.title,
              template: t.content,
              description: t.role, // Use role as description for now
              constraints: [],
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch system templates:", error);
      }
    };
    if (agent?.role) {
      fetchPrompts();
    }
  }, [agent?.role]);

  const loadBehaviorConfig = useCallback(async () => {
    if (!agentId) return;
    try {
      // Load test queries
      const queries = await playgroundAPI.loadTestQueries(agentId);
      setTestQueries(queries);
    } catch (error) {
      console.error("Failed to load behavior config:", error);
    }
  }, [agentId]);

  useEffect(() => {
    if (agent) {
      setConfig((prev) => ({
        ...prev,
        ai_model_id: agent.ai_model_id,
        ai_model_name: agent.name,
      }));
    }
    if (agentId) {
      loadBehaviorConfig();
    }
  }, [agent, agentId, loadBehaviorConfig]);

  // Combine all prompts
  const allPrompts = useMemo(() => {
    return [...SYSTEM_PROMPT_TEMPLATES, ...dbPrompts, ...customPrompts];
  }, [dbPrompts, customPrompts]);

  useEffect(() => {
    if (behavior) {
      setConfig({
        ai_model_id: agent?.ai_model_id || "adaf",
        ai_model_name:
          models.find((model) => model.id === agent?.ai_model_id)?.name ||
          "GPT-3.5 Turbo",
        temperature: behavior.temperature || 0.7,
        maxTokens: behavior.max_tokens || 1000,
        systemInstruction:
          behavior.system_instruction || SYSTEM_PROMPT_TEMPLATES[0].template,
        selectedTemplate: behavior.prompt_template || "",
      });
    }
  }, [behavior, agent?.ai_model_id, models]);

  useEffect(() => {
    setMessages([
      {
        role: MessageRoles.ASSISTANT,
        parts:
          appearance?.welcome_message ||
          "Hi, welcome; How can I help you today",
      },
    ]);
  }, [agent?.name, config.systemInstruction, appearance]);

  const handleSendMessage = async (
    e?: React.FormEvent,
    predefinedQuery?: string
  ) => {
    if (e) e.preventDefault();
    setIsTyping(true);

    const query = predefinedQuery || inputValue;
    if (!query.trim()) return;
    setInputValue("");

    const userMessage = { role: MessageRoles.USER, parts: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      if (!agentId) return;
      const { reply } = await Chat.sendMessage(query, messages, agentId);

      const assistantMessage = {
        role: MessageRoles.ASSISTANT,
        parts: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      console.log(reply);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = allPrompts.find((t) => t.id === templateId);
    if (template) {
      setConfig((prev) => ({
        ...prev,
        selectedTemplate: templateId,
        systemInstruction: template.template,
      }));
    }
  };

  const handleConfigSave = async () => {
    if (!agentId) return;
    try {
      // Update agent model if changed
      if (agent && config.ai_model_id !== agent.ai_model_id) {
        const modelData = models.find((m) => m.id === config.ai_model_id);
        if (!modelData) {
          console.error("Model not found");
          return;
        }
        await agentsAPI.update(agentId, {
          id: agentId,
          ai_model_id: modelData?.id,
        });
      }

      // Update behavior configuration
      await playgroundAPI.saveBehaviorConfig(agentId, config);

      console.log("Configuration saved successfully");
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  };

  const handleAddCustomPrompt = () => {
    const newPrompt: SystemPromptTemplate = {
      id: `custom_${Date.now()}`,
      name: "Custom Prompt",
      description: "User-defined custom prompt",
      template: "You are a helpful assistant.",
      constraints: [],
    };
    setCustomPrompts((prev) => [...prev, newPrompt]);
    setConfig((prev) => ({
      ...prev,
      selectedTemplate: newPrompt.id,
      systemInstruction: newPrompt.template,
    }));
  };

  const saveTestQueries = async (queries: string[]) => {
    if (!agentId) return;
    await playgroundAPI.saveTestQueries(agentId, queries);
  };

  const handleReset = () => {
    setMessages([
      {
        role: MessageRoles.ASSISTANT,
        parts: `Hello! I'm ${agent?.name}. How can I help you today?`,
      },
    ]);
  };

  // Filter models based on agent type

  // Custom option component for react-select
  const ModelOption = ({ data }: { data: AIModel }) => (
    <div className="flex items-center p-2">
      <Image
        src={data.image}
        alt={data.provider}
        width={24}
        height={24}
        className="mr-3"
      />
      <div>
        <div className="font-medium">{data.name}</div>
        <div className="text-sm text-gray-500">
          {data.provider} - {data.credits_per_1k} credits/1k
        </div>
      </div>
    </div>
  );

  // Custom single value component for react-select
  const ModelSingleValue = ({ data }: { data: AIModel }) => (
    <div className="flex items-center py-1">
      <Image
        src={data.image}
        alt={data.provider}
        width={20}
        height={20}
        className="mr-3 shrink-0"
      />
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{data.name}</div>
        <div className="text-xs text-gray-500 truncate">
          {data.provider} • {data.credits_per_1k} credits/1k
        </div>
      </div>
    </div>
  );

  const modelOptions = getModelsByType(
    enumToAgentType(agent?.agent_type as number)
  ).map((model) => ({
    value: model.id,
    label: model.name,
    data: model,
  }));

  const selectedModel = modelOptions.find(
    (option) => option.value === config.ai_model_id
  );

  // Animate mobile tab transitions
  useGSAP(
    () => {
      if (mobileTabContentRef.current) {
        gsap.fromTo(
          mobileTabContentRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    },
    { dependencies: [showConfig] }
  );

  // Custom styles for react-select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? primaryColor : "#D1D5DB",
      boxShadow: state.isFocused ? `0 0 0 2px ${primaryColor}20` : "none",
      "&:hover": {
        borderColor: "#9CA3AF",
      },
      minHeight: "42px",
      fontSize: "14px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "4px 8px",
      minHeight: "40px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      margin: "0",
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "#D1D5DB",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#6B7280",
      padding: "8px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? primaryColor
        : state.isFocused
          ? "#F3F4F6"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: "8px 12px",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      border: "1px solid #D1D5DB",
      borderRadius: "6px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      marginTop: "4px",
    }),
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {/* Chat Interface - Mobile */}
          <div
            className={cn(
              "bg-white rounded-lg shadow overflow-hidden flex flex-col h-[60vh]"
            )}
          >
            <ChatInterface
              agent={agent}
              config={config}
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleReset={handleReset}
              primaryColor={primaryColor}
              appearance={appearance}
            />
          </div>

          {/* Mobile Tabs for Config and Test Queries */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setShowConfig(true)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    showConfig
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Configuration
                </button>
                <button
                  onClick={() => setShowConfig(false)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    !showConfig
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Test Queries
                </button>
              </nav>
            </div>

            <div ref={mobileTabContentRef} className="p-4">
              {showConfig ? (
                <MobileConfigPanel
                  config={config}
                  setConfig={setConfig}
                  agent={agent}
                  allPrompts={allPrompts}
                  handleTemplateChange={handleTemplateChange}
                  handleAddCustomPrompt={handleAddCustomPrompt}
                  handleConfigSave={handleConfigSave}
                  modelOptions={modelOptions}
                  selectedModel={selectedModel}
                  selectStyles={selectStyles}
                  ModelOption={ModelOption}
                  ModelSingleValue={ModelSingleValue}
                  primaryColor={primaryColor}
                />
              ) : (
                <MobileTestQueries
                  testQueries={testQueries}
                  setTestQueries={setTestQueries}
                  handleSendMessage={handleSendMessage}
                  saveTestQueries={saveTestQueries}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto h-[calc(100vh-8rem)]">
          {/* Left Sidebar - Configuration */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Configuration</h3>
              <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
            </div>
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              agent={agent}
              allPrompts={allPrompts}
              handleTemplateChange={handleTemplateChange}
              handleAddCustomPrompt={handleAddCustomPrompt}
              handleConfigSave={handleConfigSave}
              modelOptions={modelOptions}
              selectedModel={selectedModel}
              selectStyles={selectStyles}
              ModelOption={ModelOption}
              ModelSingleValue={ModelSingleValue}
              primaryColor={primaryColor}
            />
          </div>

          {/* Center - Chat Interface */}
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <ChatInterface
              agent={agent}
              config={config}
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleReset={handleReset}
              primaryColor={primaryColor}
              appearance={appearance}
            />
          </div>

          {/* Right Sidebar - Test Queries */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
            <TestQueriesPanel
              testQueries={testQueries}
              setTestQueries={setTestQueries}
              handleSendMessage={handleSendMessage}
              saveTestQueries={saveTestQueries}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto h-[calc(100vh-8rem)]">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Configuration</h3>
              <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
            </div>
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              agent={agent}
              allPrompts={allPrompts}
              handleTemplateChange={handleTemplateChange}
              handleAddCustomPrompt={handleAddCustomPrompt}
              handleConfigSave={handleConfigSave}
              modelOptions={modelOptions}
              selectedModel={selectedModel}
              selectStyles={selectStyles}
              ModelOption={ModelOption}
              ModelSingleValue={ModelSingleValue}
              primaryColor={primaryColor}
            />
          </div>

          {/* Chat Interface */}
          <div className="col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <ChatInterface
              agent={agent}
              config={config}
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
              handleReset={handleReset}
              primaryColor={primaryColor}
              appearance={appearance}
            />
          </div>

          {/* Test Queries Panel */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
            <TestQueriesPanel
              testQueries={testQueries}
              setTestQueries={setTestQueries}
              handleSendMessage={handleSendMessage}
              saveTestQueries={saveTestQueries}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Configuration Panel Component
function ConfigPanel({
  config,
  setConfig,
  agent,
  allPrompts,
  handleTemplateChange,
  handleAddCustomPrompt,
  handleConfigSave,
  modelOptions,
  selectedModel,
  selectStyles,
  ModelOption,
  ModelSingleValue,
  primaryColor,
}: any) {
  return (
    <div className="space-y-4">
      {/* Agent Type Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agent Type
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
          <span className="capitalize font-medium">
            {agent?.agent_type === 1
              ? "Text"
              : agent?.agent_type === 2
                ? "Voice"
                : "Multimodal"}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {agent?.agent_type === agentTypeToEnum(AgentType.TEXT) &&
              "Text-only conversations"}
            {agent?.agent_type === agentTypeToEnum(AgentType.VOICE) &&
              "Voice and audio processing"}
            {agent?.agent_type === agentTypeToEnum(AgentType.VISION) &&
              "Text, images, and multimedia"}
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          AI Model
        </label>
        <Select
          value={selectedModel}
          onChange={(option: any) => {
            if (option) {
              setConfig((prev: any) => ({ ...prev, model: option.value }));
            }
          }}
          options={modelOptions}
          formatOptionLabel={(option: any) => (
            <ModelOption data={option.data} />
          )}
          components={{
            SingleValue: ({ data }: any) => (
              <ModelSingleValue data={data.data} />
            ),
          }}
          styles={selectStyles}
          className="text-sm"
          isSearchable
          placeholder="Select a model..."
        />
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temperature: {config.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature}
          onChange={(e) =>
            setConfig((prev: any) => ({
              ...prev,
              temperature: parseFloat(e.target.value),
            }))
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Focused</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Max Tokens
        </label>
        <input
          type="number"
          min="100"
          max="4000"
          value={config.maxTokens}
          onChange={(e) =>
            setConfig((prev: any) => ({
              ...prev,
              maxTokens: parseInt(e.target.value),
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* System Prompt Template */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Prompt Template
          </label>
          <button
            onClick={handleAddCustomPrompt}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            + Custom
          </button>
        </div>
        <select
          value={config.selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {allPrompts.map((template: any) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Custom System Instruction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          System Instruction
        </label>
        <textarea
          value={config.systemInstruction}
          onChange={(e) =>
            setConfig((prev: any) => ({
              ...prev,
              systemInstruction: e.target.value,
            }))
          }
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none scrollbar-hide"
          placeholder="Enter custom system instruction..."
        />
      </div>

      <button
        onClick={handleConfigSave}
        className="w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: primaryColor }}
      >
        Save Configuration
      </button>
    </div>
  );
}

// Mobile Configuration Panel Component
function MobileConfigPanel(props: any) {
  return <ConfigPanel {...props} />;
}

// Chat Interface Component
function ChatInterface({
  agent,
  config,
  messages,
  isTyping,
  inputValue,
  setInputValue,
  handleSendMessage,
  handleReset,
  primaryColor,
  appearance,
}: any) {
  // Appearance overrides
  const bubbleStyle = appearance?.bubble_style || "round";
  const fontFamily = appearance?.font_family || "Inter, sans-serif";

  const getBubbleClass = (role: string) => {
    const base = "max-w-[80%] px-4 py-2 text-sm whitespace-pre-wrap shadow-sm";
    const rounded =
      bubbleStyle === "round"
        ? "rounded-2xl"
        : bubbleStyle === "square"
          ? "rounded-md"
          : "rounded-xl";
    const corners =
      role === "user"
        ? bubbleStyle === "round"
          ? "rounded-br-none"
          : ""
        : bubbleStyle === "round"
          ? "rounded-bl-none"
          : "";

    return cn(base, rounded, corners);
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily }}>
      <div
        className="text-white px-4 py-3 flex justify-between items-center shrink-0 transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <span>Testing: {agent?.name}</span>
          </h3>
          <p className="text-xs opacity-90">
            Type:{" "}
            {agent?.agent_type === 1
              ? "Text"
              : agent?.agent_type === 2
                ? "Voice"
                : "Multimodal"}{" "}
            | Model: {config.ai_model_name}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Reset conversation"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages
          .filter((m: Message) => m.role !== "system")
          .map((message: Message, index: number) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role !== "user" &&
                appearance?.chat_icon &&
                appearance.chat_icon !== "default" && (
                  <div className="mr-2 mt-1 w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-lg shadow-sm border border-gray-100">
                    {appearance.chat_icon === "robot"
                      ? "🤖"
                      : appearance.chat_icon === "human"
                        ? "👤"
                        : appearance.chat_icon === "custom"
                          ? "📷"
                          : "😊"}
                  </div>
                )}
              <div
                className={cn(
                  getBubbleClass(message.role),
                  message.role === "user"
                    ? "text-white"
                    : "bg-white text-gray-800 border border-gray-100"
                )}
                style={
                  message.role === "user"
                    ? { backgroundColor: primaryColor }
                    : {}
                }
              >
                <p>{message.parts}</p>
              </div>
            </div>
          ))}

        {isTyping && (
          <div className="flex justify-start">
            {appearance?.chat_icon && appearance.chat_icon !== "default" && (
              <div className="mr-2 w-8 h-8 shrink-0"></div> // Spacer
            )}
            <div
              className={cn(
                "bg-white px-4 py-3 border border-gray-100 shadow-sm",
                bubbleStyle === "round"
                  ? "rounded-2xl rounded-bl-none"
                  : "rounded-xl"
              )}
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your test message..."
            className="flex-1 rounded-full border-gray-300 shadow-sm focus:outline-none focus:ring-2 transition-all px-4"
            style={
              { borderColor: "#E5E7EB", "--tw-ring-color": primaryColor } as any
            }
            onFocus={(e) => {
              (e.target.style as any).borderColor = primaryColor;
            }}
            onBlur={(e) => {
              (e.target.style as any).borderColor = "#E5E7EB";
            }}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-transform active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <PaperAirplaneIcon className="h-5 w-5 translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Test Queries Panel Component
function TestQueriesPanel({
  testQueries,
  setTestQueries,
  handleSendMessage,
  saveTestQueries,
}: any) {
  return (
    <>
      <h4 className="font-medium text-sm text-gray-700 mb-3">Test Queries</h4>
      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
        {testQueries.map((query: string, index: number) => (
          <button
            key={index}
            onClick={() => handleSendMessage(undefined, query)}
            className="w-full text-left px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
          >
            {query}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Add new test query..."
          className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          onKeyDown={async (e) => {
            if (e.key === "Enter" && e.currentTarget.value) {
              const newQueries = [...testQueries, e.currentTarget.value];
              setTestQueries(newQueries);
              await saveTestQueries(newQueries);
              e.currentTarget.value = "";
            }
          }}
        />
        <button
          type="button"
          className="w-full px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-gray-50 hover:bg-gray-100"
          onClick={async (e) => {
            const input = e.currentTarget
              .previousElementSibling as HTMLInputElement;
            if (input.value) {
              const newQueries = [...testQueries, input.value];
              setTestQueries(newQueries);
              await saveTestQueries(newQueries);
              input.value = "";
            }
          }}
        >
          Add Query
        </button>
      </div>
    </>
  );
}

// Mobile Test Queries Component
function MobileTestQueries(props: any) {
  return (
    <div className="space-y-4">
      <TestQueriesPanel {...props} />
    </div>
  );
}
