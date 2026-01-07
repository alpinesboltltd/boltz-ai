import { create } from "zustand";
import { AIModel } from "@/types";
import { aiModelsAPI } from "@/lib/api";
import { accessToken } from "./authStore";
import { AgentType } from "@/types/agent";

interface AIModelsState {
  models: AIModel[];
  isLoading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  getModelByName: (modelName: string) => AIModel | undefined;
  getModelsByType: (type: AgentType) => AIModel[];
}

export const useAIModelsStore = create<AIModelsState>((set, get) => ({
  models: [],
  isLoading: false,
  error: null,

  fetchModels: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = accessToken();
      const { ai_models } = await aiModelsAPI.getAll(token);
      set({ models: ai_models, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch models",
        isLoading: false,
      });
    }
  },

  getModelsByType: (type: AgentType) => {
    const { models } = get();

    switch (type) {
      case AgentType.TEXT:
        return models.filter((m) => m.supports_text);
      case AgentType.VOICE:
        return models.filter((m) => m.supports_voice);
      case AgentType.MULTIMODAL:
        return models.filter((m) => m.supports_vision);
      default:
        return models;
    }
  },
  getModelByName: (modelName: string): AIModel | undefined => {
    const { models } = get();
    return models.find((model) => model.name === modelName);
  },
}));
