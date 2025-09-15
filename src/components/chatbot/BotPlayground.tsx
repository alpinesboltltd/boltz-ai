"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  Agent,
  MessageRoles,
  SystemPromptTemplate,
  PlaygroundConfig,
  AgentType,
} from "@/types/agent";
import { Chat, agentsAPI } from "@/lib/api";
import { playgroundAPI } from "@/lib/playground-api";
import { useParams } from "next/navigation";
import { useAgentStore } from "@/store/agentStore";
import { useAgentDetailStore } from "@/store/agentDetailStore";
import { SYSTEM_PROMPT_TEMPLATES } from "@/data/systemPrompts";
import { AI_MODELS, AIModel } from "@/mock-data/ai-models";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Select, { SingleValue } from "react-select";

export function BotPlayground() {
  const agentId = useParams().id as string;
  const { getAgent } = useAgentStore();
  const { appearance, fetchAppearance } = useAgentDetailStore();
  const [agent, setAgent] = useState<Agent>();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const mobileTabContentRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<PlaygroundConfig>({
    model: "GPT-3.5 Turbo",
    temperature: 0.7,
    maxTokens: 1000,
    systemInstruction: SYSTEM_PROMPT_TEMPLATES[0].template,
    selectedTemplate: "ai_agent",
  });
  const [customPrompts, setCustomPrompts] = useState<SystemPromptTemplate[]>(
    []
  );
  const [testQueries, setTestQueries] = useState<string[]>([]);

  useEffect(() => {
    const { agent: agnt } = getAgent(agentId);
    if (agnt) {
      setAgent(agnt);
      setConfig((prev) => ({ ...prev, model: agnt.ai_model }));
    }
    fetchAppearance(agentId);
    loadBehaviorConfig();
  }, [agentId, getAgent, fetchAppearance]);

  const loadBehaviorConfig = async () => {
    try {
      const behaviorConfig = await playgroundAPI.loadBehaviorConfig(agentId);
      if (behaviorConfig) {
        setConfig({
          model: agent?.ai_model || "GPT-3.5 Turbo",
          temperature: behaviorConfig.temperature || 0.7,
          maxTokens: behaviorConfig.max_tokens || 1000,
          systemInstruction:
            behaviorConfig.system_instruction ||
            SYSTEM_PROMPT_TEMPLATES[0].template,
          selectedTemplate: behaviorConfig.prompt_template || "ai_agent",
        });
      }

      // Load test queries
      const queries = await playgroundAPI.loadTestQueries(agentId);
      setTestQueries(queries);
    } catch (error) {
      console.error("Failed to load behavior config:", error);
    }
  };

  useEffect(() => {
    setMessages([
      {
        role: MessageRoles.ASSISTANT,
        parts: `Hello! I'm ${agent?.name}. How can I help you today?`,
      },
    ]);
  }, [agent?.name, config.systemInstruction]);

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
      const { reply } = await Chat.sendMessage(query, messages, agentId);

      const assistantMessage = {
        role: MessageRoles.ASSISTANT,
        parts: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = SYSTEM_PROMPT_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setConfig((prev) => ({
        ...prev,
        selectedTemplate: templateId,
        systemInstruction: template.template,
      }));
    }
  };

  const handleConfigSave = async () => {
    try {
      // Update agent model if changed
      if (agent && config.model !== agent.ai_model) {
        const modelData = AI_MODELS.find((m) => m.model === config.model);
        await agentsAPI.update(agentId, {
          ai_model: config.model,
          ai_provider: modelData?.provider || agent.ai_provider,
          credits_per_1k: modelData?.credits_per_1k || agent.credits_per_1k,
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
      constraints: [
        "No data divulgence",
        "Maintain focus",
        "Exclusive reliance on training data",
        "Restrictive role focus",
      ],
    };
    setCustomPrompts((prev) => [...prev, newPrompt]);
    setConfig((prev) => ({
      ...prev,
      selectedTemplate: newPrompt.id,
      systemInstruction: newPrompt.template,
    }));
  };

  const saveTestQueries = async (queries: string[]) => {
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

  const allPrompts = [...SYSTEM_PROMPT_TEMPLATES, ...customPrompts];

  // Filter models based on agent type
  const getFilteredModels = () => {
    if (!agent) return AI_MODELS;
    switch (agent.agent_type) {
      case AgentType.TEXT:
        return AI_MODELS.filter((model) => model.capabilities.includes("text"));
      case AgentType.VOICE:
        return AI_MODELS.filter((model) =>
          model.capabilities.includes("voice")
        );
      case AgentType.MULTIMODAL:
        return AI_MODELS.filter((model) =>
          model.capabilities.includes("multimodal")
        );
      default:
        return AI_MODELS;
    }
  };

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
        <div className="font-medium">{data.model}</div>
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
        className="mr-3 flex-shrink-0"
      />
      <div className="min-w-0">
        <div className="font-medium text-sm truncate">{data.model}</div>
        <div className="text-xs text-gray-500 truncate">
          {data.provider} • {data.credits_per_1k} credits/1k
        </div>
      </div>
    </div>
  );

  const modelOptions = getFilteredModels().map((model) => ({
    value: model.model,
    label: model.model,
    data: model,
  }));

  const selectedModel = modelOptions.find(
    (option) => option.value === config.model
  );

  // Animate mobile tab transitions
  useGSAP(() => {
    if (mobileTabContentRef.current) {
      gsap.fromTo(mobileTabContentRef.current, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, { dependencies: [showConfig] });

  // Custom styles for react-select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.1)" : "none",
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
        ? "#3B82F6"
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
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[60vh]">
            <div className="text-white px-4 py-3 flex justify-between items-center bg-primary-600">
              <div>
                <h3 className="font-medium">Testing: {agent?.name}</h3>
                <p className="text-xs text-primary-100">
                  {config.model} | Temp: {config.temperature}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-1 rounded-full hover:bg-primary-500 transition-colors"
                title="Reset conversation"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages
                .filter((m) => m.role !== "system")
                .map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                        message.role === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.parts}</p>
                    </div>
                  </div>
                ))}

              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your test message..."
                  className="flex-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
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
  ModelSingleValue
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
            {agent?.agent_type || "Loading..."}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {agent?.agent_type === AgentType.TEXT &&
              "Text-only conversations"}
            {agent?.agent_type === AgentType.VOICE &&
              "Voice and audio processing"}
            {agent?.agent_type === AgentType.MULTIMODAL &&
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
          formatOptionLabel={(option: any) => <ModelOption data={option.data} />}
          components={{
            SingleValue: ({ data }: any) => <ModelSingleValue data={data.data} />,
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter custom system instruction..."
        />
      </div>

      <button
        onClick={handleConfigSave}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
  handleReset 
}: any) {
  return (
    <>
      <div className="text-white px-4 py-3 flex justify-between items-center bg-primary-600">
        <div>
          <h3 className="font-medium">Testing: {agent?.name}</h3>
          <p className="text-xs text-primary-100">
            Type: {agent?.agent_type} | Model: {config.model} | Temp: {config.temperature} | Tokens: {config.maxTokens}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-1 rounded-full hover:bg-primary-500 transition-colors"
          title="Reset conversation"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages
          .filter((m: any) => m.role !== "system")
          .map((message: any, index: number) => (
            <div
              key={index}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.parts}
                </p>
              </div>
            </div>
          ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
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
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your test message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </>
  );
}

// Test Queries Panel Component
function TestQueriesPanel({ testQueries, setTestQueries, handleSendMessage, saveTestQueries }: any) {
  return (
    <>
      <h4 className="font-medium text-sm text-gray-700 mb-3">
        Test Queries
      </h4>
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
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
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