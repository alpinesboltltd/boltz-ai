/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { BotPreview } from "./BotPreview";
import { useParams } from "next/navigation";
import { useAgentStore } from "@/store/agentStore";
import { useAgentDetailStore } from "@/store/agentDetailStore";
import {
  AgentAppearance,
  AgentBubbleStyle,
  AgentIconSize,
  AgentPosition,
} from "@/types/agent";

interface BotCustomizerProps {
  onSave: () => void;
}

export function BotCustomizer({ onSave }: BotCustomizerProps) {
  const agentId = useParams().id as string;
  const { getAgent } = useAgentStore();
  const { appearance, fetchAppearance } = useAgentDetailStore();
  const [name, setName] = useState("Agent");
  const [config, setConfig] = useState<Partial<AgentAppearance>>({
    position: "bottom-right" as AgentPosition,
    icon_size: "medium" as AgentIconSize,
    bubble_style: "round" as AgentBubbleStyle,
    chat_icon: "default",
    primary_color: "#3B82F6",
    welcome_message: "Hello! How can I help you today?",
  });

  useEffect(() => {
    const { agent } = getAgent(agentId);
    if (agent) {
      setName(agent.name);
    }
    fetchAppearance(agentId);
  }, [agentId, getAgent, fetchAppearance]);

  useEffect(() => {
    if (appearance) {
      setConfig(appearance);
    }
  }, [appearance]);
  const handleChange = (field: string, value: any) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Customize Your Bot
        </h3>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="position"
                  value="bottom-right"
                  checked={config.position === "bottom-right"}
                  onChange={() => handleChange("position", "bottom-right")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Bottom Right</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="position"
                  value="bottom-left"
                  checked={config.position === "bottom-left"}
                  onChange={() => handleChange("position", "bottom-left")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Bottom Left</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="iconSize"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Icon Size
            </label>
            <select
              id="iconSize"
              value={config.icon_size}
              onChange={(e) => handleChange("iconSize", e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="bubbleStyle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bubble Style
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bubbleStyle"
                  value="rounded"
                  checked={config.bubble_style === AgentBubbleStyle.ROUND}
                  onChange={() => handleChange("bubbleStyle", "round")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Rounded</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bubbleStyle"
                  value="square"
                  checked={config.bubble_style === "square"}
                  onChange={() => handleChange("bubbleStyle", "square")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Square</span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar Style
            </label>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                  config.chat_icon === "default"
                    ? "ring-2 ring-primary-500"
                    : "ring-1 ring-gray-200"
                }`}
                onClick={() => handleChange("avatar", "default")}
              >
                <span className="text-2xl">😊</span>
              </div>

              {/* <div
                className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                  config.avatar === "robot"
                    ? "ring-2 ring-primary-500"
                    : "ring-1 ring-gray-200"
                }`}
                onClick={() => handleChange("avatar", "robot")}
              >
                <span className="text-2xl">🤖</span>
              </div> */}

              {/* <div
                className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                  config.avatar === "human"
                    ? "ring-2 ring-primary-500"
                    : "ring-1 ring-gray-200"
                }`}
                onClick={() => handleChange("avatar", "human")}
              >
                <span className="text-2xl">👤</span>
              </div> */}

              {/* <div
                className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                  config.avatar === "custom"
                    ? "ring-2 ring-primary-500"
                    : "ring-1 ring-gray-200"
                }`}
                onClick={() => handleChange("avatar", "custom")}
              >
                <span className="text-2xl">📷</span>
              </div> */}
            </div>
          </div>

          <div>
            <label
              htmlFor="primaryColor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="primaryColor"
                value={config.primary_color}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.primary_color}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="ml-2 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="welcomeMessage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Welcome Message
            </label>
            <textarea
              id="welcomeMessage"
              value={config.welcome_message}
              onChange={(e) => handleChange("welcomeMessage", e.target.value)}
              rows={3}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Hello! How can I help you today?"
            />
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={onSave}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Customization
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <BotPreview botConfig={config} name={name} />
      </div>
    </div>
  );
}
