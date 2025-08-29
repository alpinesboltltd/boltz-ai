import { create } from 'zustand';
import { AgentAppearance, Agent } from '@/types/agent';
import { agentsAPI } from '@/lib/api';

interface AgentDetailState {
  currentAgentId: string | null;
  agent: Agent | null;
  appearance: AgentAppearance | null;
  loading: boolean;
  
  setCurrentAgent: (agentId: string) => void;
  fetchAppearance: (agentId: string) => Promise<void>;
  updateAppearance: (appearance: AgentAppearance) => void;
  clearAgent: () => void;
}

export const useAgentDetailStore = create<AgentDetailState>((set, get) => ({
  currentAgentId: null,
  agent: null,
  appearance: null,
  loading: false,

  setCurrentAgent: (agentId: string) => {
    set({ currentAgentId: agentId });
  },

  fetchAppearance: async (agentId: string) => {
    const { currentAgentId, appearance } = get();
    
    // Return cached data if same agent
    if (currentAgentId === agentId && appearance) {
      return;
    }

    set({ loading: true });
    try {
      const response = await fetch(`/api/chatagents/${agentId}/appearance`);
      const result = await response.json();
      
      if (result.success) {
        set({ 
          appearance: result.data,
          currentAgentId: agentId,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Failed to fetch appearance:', error);
      set({ loading: false });
    }
  },

  updateAppearance: (appearance: AgentAppearance) => {
    set({ appearance });
  },

  clearAgent: () => {
    set({ 
      currentAgentId: null,
      agent: null,
      appearance: null,
      loading: false 
    });
  },
}));