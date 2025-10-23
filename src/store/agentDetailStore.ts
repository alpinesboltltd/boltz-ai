import { create } from "zustand";
import { 
  Agent, 
  AgentAppearance, 
  AgentBehavior, 
  AgentIntegration, 
  AgentStats, 
  TrainingData,
  SystemPromptTemplate 
} from "@/types/agent";
import { agentsAPI } from "@/lib/api";

interface AgentDetailData {
  agent: Agent;
  agent_appearance: AgentAppearance;
  agent_behavior: AgentBehavior;
  agent_integration: AgentIntegration;
  agent_stats: AgentStats;
  training_data: TrainingData;
  system_prompt_template: SystemPromptTemplate;
}

interface AgentDetailState {
  currentAgentId: string | null;
  data: AgentDetailData | null;
  loading: boolean;
  error: string | null;

  fetchAgentDetails: (agentId: string) => Promise<void>;
  updateAppearance: (appearance: AgentAppearance) => void;
  updateBehavior: (behavior: AgentBehavior) => void;
  clearAgent: () => void;
}

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
      const response = await agentsAPI.getById(agentId);
      
      set({
        data: response.data,
        currentAgentId: agentId,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch agent details:", error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch agent details"
      });
    }
  },

  updateAppearance: (appearance: AgentAppearance) => {
    const { data } = get();
    if (data) {
      set({ 
        data: { 
          ...data, 
          agent_appearance: appearance 
        } 
      });
    }
  },

  updateBehavior: (behavior: AgentBehavior) => {
    const { data } = get();
    if (data) {
      set({ 
        data: { 
          ...data, 
          agent_behavior: behavior 
        } 
      });
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
  const data = useAgentDetailStore(state => state.data);
  return data?.agent;
};

export const useAgentAppearance = () => {
  const data = useAgentDetailStore(state => state.data);
  return data?.agent_appearance;
};

export const useAgentBehavior = () => {
  const data = useAgentDetailStore(state => state.data);
  return data?.agent_behavior;
};

export const useAgentStats = () => {
  const data = useAgentDetailStore(state => state.data);
  return data?.agent_stats;
};

export const useTrainingData = () => {
  const data = useAgentDetailStore(state => state.data);
  return data?.training_data;
};
