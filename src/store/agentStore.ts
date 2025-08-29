import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentIntegration,
  AgentStats,
  TrainingData,
} from "@/types/agent";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgentData {
  appearance: AgentAppearance;
  behavior: AgentBehavior;
  integrations: AgentIntegration;
  stats: AgentStats;
  training_data: TrainingData;
}

interface AgentState {
  agents: Agent[];
  agentData: AgentData[];
  setAgents: (agents: Agent[]) => void;
  getAgent: (id: string) => {
    agent: Agent | undefined;
    data: AgentData | undefined;
  };
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      agents: [],
      agentData: [],
      setAgents: (agents) => {
        set({ agents });
      },
      getAgent: (id) => {
        const { agents, agentData } = get();
        const agent = agents.find((a) => a.id === id);
        if (!agent) {
          return { agent: undefined, data: undefined };
        }
        const data = agentData.find(
          (item) => item.appearance.agent_id === agent.id
        );
        return { agent, data };
      },
    }),
    {
      name: "boltz-agent-storage",
      partialize: (state) => ({
        agents: state.agents,
        agentData: state.agentData,
      }),
    }
  )
);
