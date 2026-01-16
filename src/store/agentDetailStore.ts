import { create } from "zustand";
import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentIntegration,
  AgentStats,
  AgentChannel,
  TrainingData,
} from "@/types/agent";
import { agentsAPI } from "@/lib/api";
import { accessToken } from "./authStore";

interface AgentDetailData {
  agent: Agent;
  agent_appearance: AgentAppearance | null;
  agent_behavior: AgentBehavior | null;
  agent_integration: AgentIntegration | null;
  agent_channel: AgentChannel | null;
  agent_stats: AgentStats | null;
  training_data: TrainingData[];
}

interface AgentDetailState {
  currentAgentId: string | null;
  data: AgentDetailData | null;
  loading: boolean;
  error: string | null;

  fetchAgentDetails: (agentId: string) => Promise<void>;
  updateAppearance: (appearance: AgentAppearance) => void;
  updateBehavior: (behavior: AgentBehavior) => void;
  saveAppearance: (appearance: Partial<AgentAppearance>) => Promise<void>;
  clearAgent: () => void;
}

const token = accessToken();

export const useAgentDetailStore = create<AgentDetailState>((set, get) => ({
  currentAgentId: null,
  data: null,
  loading: false,
  error: null,

  fetchAgentDetails: async (agentId: string) => {
    const { currentAgentId, data } = get();

    // Return cached data if same agent
    if (currentAgentId === agentId && data) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await agentsAPI.getById(agentId, token);
      set({
        data: response,
        currentAgentId: response.agent.id,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch agent details:", error);
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch agent details",
      });
    }
  },

  updateAppearance: (appearance: AgentAppearance) => {
    const { data } = get();
    if (data) {
      set({
        data: {
          ...data,
          agent_appearance: appearance,
        },
      });
    }
  },

  updateBehavior: (behavior: AgentBehavior) => {
    const { data } = get();
    if (data) {
      set({
        data: {
          ...data,
          agent_behavior: behavior,
        },
      });
    }
  },

  saveAppearance: async (appearance: Partial<AgentAppearance>) => {
    const { currentAgentId, data } = get();
    if (!currentAgentId || !data || !data.agent_appearance) return;

    try {
      await agentsAPI.updateAppearance(currentAgentId, appearance);
      // Update local state deeply merging
      const newAppearance: AgentAppearance = {
        ...data.agent_appearance,
        ...appearance,
      } as AgentAppearance;
      set({
        data: {
          ...data,
          agent_appearance: newAppearance,
        },
      });
    } catch (error) {
      console.error("Failed to save appearance:", error);
      throw error;
    }
  },

  clearAgent: () => {
    set({
      currentAgentId: null,
      data: null,
      loading: false,
      error: null,
    });
  },
}));

// Convenience selectors
export const useAgentData = () => {
  const data = useAgentDetailStore((state) => state.data);
  return data?.agent;
};

export const useAgentAppearance = () => {
  const data = useAgentDetailStore((state) => state.data);
  return data?.agent_appearance;
};

export const useAgentBehavior = () => {
  const data = useAgentDetailStore((state) => state.data);
  return data?.agent_behavior;
};

export const useAgentStats = () => {
  const data = useAgentDetailStore((state) => state.data);
  return data?.agent_stats;
};

export const useTrainingData = () => {
  const data = useAgentDetailStore((state) => state.data);
  return data?.training_data;
};
