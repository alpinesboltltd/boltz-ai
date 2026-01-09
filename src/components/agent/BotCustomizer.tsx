"use client";

import { useEffect } from "react";
import { BotPreview } from "./BotPreview";
import {
  useAgentData,
  useAgentAppearance,
  useAgentDetailStore,
} from "@/store/agentDetailStore";
import {
  AgentAppearance,
  AgentBubbleStyle,
  AgentIconSize,
  AgentPosition,
  AgentAppearanceSchema,
} from "@/types/agent";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface BotCustomizerProps {
  onSave: () => void;
}

type AgentAppearanceFormValues = z.infer<typeof AgentAppearanceSchema>;

export function BotCustomizer({ onSave }: BotCustomizerProps) {
  const agent = useAgentData();
  const appearance = useAgentAppearance();
  const { saveAppearance } = useAgentDetailStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AgentAppearanceFormValues>({
    resolver: zodResolver(AgentAppearanceSchema),
    defaultValues: {
      position: AgentPosition.BOTTOM_RIGHT,
      icon_size: AgentIconSize.MEDIUM,
      bubble_style: AgentBubbleStyle.ROUND,
      chat_icon: "default",
      primary_color: "#3B82F6",
      welcome_message: "Hello! How can I help you today?",
    },
  });

  // Watch values for preview
  const config = watch();

  useEffect(() => {
    if (appearance) {
      // Filter appearance to match form values to avoid type issues with extra fields
      const formValues: AgentAppearanceFormValues = {
        id: appearance.id,
        agent_id: appearance.agent_id,
        position: appearance.position,
        icon_size: appearance.icon_size,
        bubble_style: appearance.bubble_style,
        chat_icon: appearance.chat_icon,
        primary_color: appearance.primary_color,
        welcome_message: appearance.welcome_message,
        font_family: appearance.font_family,
      };
      reset(formValues);
    }
  }, [appearance, reset]);

  const onSubmit = async (data: AgentAppearanceFormValues) => {
    // Construct a clean payload with only mutable fields
    const updateData = {
      position: data.position,
      icon_size: data.icon_size,
      bubble_style: data.bubble_style,
      chat_icon: data.chat_icon,
      primary_color: data.primary_color,
      welcome_message: data.welcome_message,
      font_family: data.font_family,
    };

    await saveAppearance(updateData);
    onSave();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.error("Form errors:", errors)
      )}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
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
                  {...register("position")}
                  value={AgentPosition.BOTTOM_RIGHT}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Bottom Right</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("position")}
                  value={AgentPosition.BOTTOM_LEFT}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Bottom Left</span>
              </label>
            </div>
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="icon_size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Icon Size
            </label>
            <select
              id="icon_size"
              {...register("icon_size")}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value={AgentIconSize.SMALL}>Small</option>
              <option value={AgentIconSize.MEDIUM}>Medium</option>
              <option value={AgentIconSize.LARGE}>Large</option>
            </select>
            {errors.icon_size && (
              <p className="mt-1 text-sm text-red-600">
                {errors.icon_size.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bubble_style"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bubble Style
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("bubble_style")}
                  value={AgentBubbleStyle.ROUND}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Rounded</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("bubble_style")}
                  value={AgentBubbleStyle.SQUARE}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Square</span>
              </label>
            </div>
            {errors.bubble_style && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bubble_style.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="chat_icon"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar Style
            </label>
            <Controller
              name="chat_icon"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer ${
                      field.value === "default"
                        ? "ring-2 ring-primary-500"
                        : "ring-1 ring-gray-200"
                    }`}
                    onClick={() => field.onChange("default")}
                  >
                    <span className="text-2xl">😊</span>
                  </div>
                </div>
              )}
            />
            {errors.chat_icon && (
              <p className="mt-1 text-sm text-red-600">
                {errors.chat_icon.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="primary_color"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Primary Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                id="primary_color"
                {...register("primary_color")}
                value={config.primary_color}
                className="h-8 w-8 rounded-md border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                {...register("primary_color")}
                value={config.primary_color}
                className="ml-2 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {errors.primary_color && (
              <p className="mt-1 text-sm text-red-600">
                {errors.primary_color.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="welcome_message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Welcome Message
            </label>
            <textarea
              id="welcome_message"
              {...register("welcome_message")}
              rows={3}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Hello! How can I help you today?"
            />
            {errors.welcome_message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.welcome_message.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Customization
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <BotPreview
          botConfig={config as unknown as AgentAppearance}
          name={agent?.name || "Agent"}
        />
      </div>
    </form>
  );
}
