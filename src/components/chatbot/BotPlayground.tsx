"use client";

import { useState, useEffect } from "react";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Agent, MessageRoles, SystemPromptTemplate, PlaygroundConfig, AgentType } from "@/types/agent";
import { Chat, agentsAPI } from "@/lib/api";
import { playgroundAPI } from "@/lib/playground-api";
import { useParams } from "next/navigation";
import { useAgentStore } from "@/store/agentStore";
import { useAgentDetailStore } from "@/store/agentDetailStore";
import { SYSTEM_PROMPT_TEMPLATES } from "@/data/systemPrompts";
import { AI_MODELS } from "@/mock-data/ai-models";
import { cn } from "@/lib/utils";



export function BotPlayground() {
  const agentId = useParams().id as string;
  const { getAgent } = useAgentStore();
  const { appearance, fetchAppearance } = useAgentDetailStore();
  const [agent, setAgent] = useState<Agent>();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
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
        const modelData = AI_MODELS.find(m => m.model === config.model);
        await agentsAPI.update(agentId, { 
          ai_model: config.model,
          ai_provider: modelData?.provider || agent.ai_provider,
          credits_per_1k: modelData?.credits_per_1k || agent.credits_per_1k
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Configuration Panel */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Configuration</h3>
          <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              value={config.model}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, model: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {AI_MODELS.filter(model => {
                if (!agent) return true;
                switch (agent.agent_type) {
                  case AgentType.TEXT:
                    return model.capabilities.includes('text');
                  case AgentType.VOICE:
                    return model.capabilities.includes('voice');
                  case AgentType.MULTIMODAL:
                    return model.capabilities.includes('multimodal');
                  default:
                    return true;
                }
              }).map((model) => (
                <option key={model.model} value={model.model}>
                  {model.model} ({model.provider}) - {model.credits_per_1k} credits/1k
                </option>
              ))}
            </select>
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
                setConfig((prev) => ({
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
                setConfig((prev) => ({
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
              {allPrompts.map((template) => (
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
                setConfig((prev) => ({
                  ...prev,
                  systemInstruction: e.target.value,
                }))
              }
              rows={8}
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
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div
          className={cn(
            "text-white px-4 py-3 flex justify-between items-center bg-primary-600"
          )}
        >
          <div>
            <h3 className="font-medium">Testing: {agent?.name}</h3>
            <p className="text-xs text-primary-100">
              Model: {config.model} | Temp: {config.temperature} | Tokens:{" "}
              {config.maxTokens}
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

        <div className="flex flex-1 overflow-hidden">
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

          {/* Test queries sidebar */}
          <div className="w-64 border-l border-gray-200 p-4 bg-gray-50">
            <h4 className="font-medium text-sm text-gray-700 mb-3">
              Test Queries
            </h4>
            <div className="space-y-2">
              {testQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(undefined, query)}
                  className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                Add Custom Test Query
              </h4>
              <div className="flex">
                <input
                  type="text"
                  placeholder="New test query"
                  className="flex-1 text-sm rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 hover:bg-gray-100"
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
                  Add
                </button>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
}
