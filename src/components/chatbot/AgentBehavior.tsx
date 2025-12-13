/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";
import {
  SystemPromptTemplate,
  PlaygroundConfig,
  AgentType,
} from "@/types/agent";
import { agentsAPI, systemAPI } from "@/lib/api";
import { playgroundAPI } from "@/lib/playground-api";
import {
  useAgentData,
  useAgentBehavior,
  useAgentAppearance,
} from "@/store/agentDetailStore";
import { useAIModelsStore } from "@/store/aiModelsStore";
import { AIModel } from "@/lib/static/ai-models";
import { agentTypeToEnum, enumToAgentType } from "@/lib/agentTypeSerializer";
import { SYSTEM_PROMPT_TEMPLATES } from "@/data/systemPrompts";

export function AgentBehavior() {
  const agent = useAgentData();
  const behavior = useAgentBehavior();
  const appearance = useAgentAppearance();
  const agentId = agent?.id;
  const { models, getModelsByType, fetchModels } = useAIModelsStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Derive primary color safely
  const primaryColor = useMemo(
    () => appearance?.primary_color || "#0284c7",
    [appearance?.primary_color]
  );

  const [config, setConfig] = useState<PlaygroundConfig>({
    ai_model_id: agent?.ai_model_id || "",
    ai_model_name: agent?.name || "",
    maxTokens: behavior?.max_tokens || 500,
    temperature: behavior?.temperature || 0.5,
    systemInstruction: behavior?.system_instruction || "",
    selectedTemplate: "",
  });

  const [customPrompts, setCustomPrompts] = useState<SystemPromptTemplate[]>(
    []
  );
  const [dbPrompts, setDbPrompts] = useState<any[]>([]);

  // Fetch Models
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Fetch DB Prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await systemAPI.listTemplates(agent?.role);
        if (res.templates) {
          setDbPrompts(
            res.templates.map((t: any) => ({
              id: t.id,
              name: t.title,
              template: t.content,
              description: t.role,
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

  // Sync state with behavior prop
  useEffect(() => {
    if (behavior) {
      setConfig({
        ai_model_id: agent?.ai_model_id || "",
        ai_model_name:
          models.find((model) => model.id === agent?.ai_model_id)?.name || "",
        temperature: behavior.temperature || 0.7,
        maxTokens: behavior.max_tokens || 1000,
        systemInstruction:
          behavior.system_instruction || SYSTEM_PROMPT_TEMPLATES[0].template,
        selectedTemplate: behavior.prompt_template || "",
      });
    }
  }, [behavior, agent?.ai_model_id, models]);

  const allPrompts = useMemo(() => {
    return [...SYSTEM_PROMPT_TEMPLATES, ...dbPrompts, ...customPrompts];
  }, [dbPrompts, customPrompts]);

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

  const handleConfigSave = async () => {
    if (!agentId) return;
    setLoading(true);
    setSuccess(false);
    try {
      // Update agent model if changed
      if (agent && config.ai_model_id !== agent.ai_model_id) {
        const modelData = models.find((m) => m.id === config.ai_model_id);
        if (modelData) {
          await agentsAPI.update(agentId, {
            id: agentId,
            ai_model_id: modelData.id,
          });
        }
      }

      // Update behavior configuration
      await playgroundAPI.saveBehaviorConfig(agentId, config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setLoading(false);
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

  // Styles
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? primaryColor : "#D1D5DB",
      boxShadow: state.isFocused ? `0 0 0 2px ${primaryColor}20` : "none",
      "&:hover": { borderColor: "#9CA3AF" },
      minHeight: "42px",
      fontSize: "14px",
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "4px 8px",
      minHeight: "40px",
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
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">Agent Behavior</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure how your agent thinks, responds, and interacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Model & Parameters */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Model
            </label>
            <Select
              value={selectedModel}
              onChange={(option: any) => {
                if (option) {
                  setConfig((prev) => ({ ...prev, ai_model_id: option.value }));
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
              className="w-full cursor-pointer accent-primary-600"
              style={{ accentColor: primaryColor }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused (0.0)</span>
              <span>Creative (2.0)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              min="100"
              max="128000"
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
        </div>

        {/* System Prompt */}
        <div className="space-y-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">Select a template...</option>
              {allPrompts.map((template: any) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

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
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 scrollbar-hide font-mono"
              placeholder="Enter custom system instruction..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        {success && (
          <span className="mr-4 inline-flex items-center text-sm font-medium text-green-600 animate-pulse">
            Saved Successfully
          </span>
        )}
        <button
          onClick={handleConfigSave}
          disabled={loading}
          className="px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
