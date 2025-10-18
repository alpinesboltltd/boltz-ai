import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentStats,
  CreateAgentRequest,
  UpdateAgentRequest,
  CreateAgentAppearanceRequest,
  CreateAgentBehaviorRequest,
  CreateAgentStatsRequest,
} from "@/types/agent";

const API_BASE = "http://localhost:3001";

// Generic helper for JSON requests
async function requestJSON<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed ${response.status} ${response.statusText} - ${body}`
    );
  }
  return response.json() as Promise<T>;
}

export const agentApi = {
  async createAgent(data: CreateAgentRequest): Promise<Agent> {
    return requestJSON<Agent>(`${API_BASE}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async updateAgent(id: string, data: UpdateAgentRequest): Promise<Agent> {
    return requestJSON<Agent>(`${API_BASE}/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async createAppearance(
    data: CreateAgentAppearanceRequest
  ): Promise<AgentAppearance> {
    return requestJSON<AgentAppearance>(`${API_BASE}/agent_appearance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  async createBehavior(
    data: CreateAgentBehaviorRequest
  ): Promise<AgentBehavior> {
    // Normalize initial_messages if provided as array
    const payload = {
      ...data,
      initial_messages: Array.isArray(data.initial_messages)
        ? data.initial_messages.join("\n")
        : data.initial_messages,
    };
    return requestJSON<AgentBehavior>(`${API_BASE}/agent_behavior`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async createStats(data: CreateAgentStatsRequest): Promise<AgentStats> {
    return requestJSON<AgentStats>(`${API_BASE}/agent_stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  
  async deleteAgent(id: string): Promise<void> {
    await requestJSON<void>(`${API_BASE}/agents/${id}`, {
      method: "DELETE",
    });
  },

  generateId(): string {
    return Math.random().toString(36).slice(2, 11);
  },
};

export type AgentApi = typeof agentApi;
