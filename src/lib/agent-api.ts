const API_BASE = "http://localhost:3001";

export const agentApi = {
  async createAgent(data: any) {
    const response = await fetch(`${API_BASE}/agents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create agent");
    return response.json();
  },

  async updateAgent(id: string, data: any) {
    const response = await fetch(`${API_BASE}/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update agent");
    return response.json();
  },

  async createAppearance(data: any) {
    const response = await fetch(`${API_BASE}/agent_appearance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create appearance");
    return response.json();
  },

  async createBehavior(data: any) {
    const response = await fetch(`${API_BASE}/agent_behavior`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create behavior");
    return response.json();
  },

  async createStats(data: any) {
    const response = await fetch(`${API_BASE}/agent_stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create stats");
    return response.json();
  },

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};