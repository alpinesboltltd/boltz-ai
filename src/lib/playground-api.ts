import { PlaygroundConfig } from "@/types/agent";

const API_BASE = "http://localhost:3001";

export const playgroundAPI = {
  async saveBehaviorConfig(agentId: string, config: PlaygroundConfig) {
    try {
      const behaviorResponse = await fetch(`${API_BASE}/agent_behavior?agent_id=${agentId}`);
      const behaviorData = await behaviorResponse.json();
      
      if (behaviorData.length > 0) {
        await fetch(`${API_BASE}/agent_behavior/${behaviorData[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: config.systemInstruction,
            prompt_template: config.selectedTemplate,
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            updated_at: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Failed to save behavior config:', error);
      throw error;
    }
  },

  async saveTestQueries(agentId: string, queries: string[]) {
    try {
      const testQueriesResponse = await fetch(`${API_BASE}/test_queries?agent_id=${agentId}`);
      const testQueriesData = await testQueriesResponse.json();
      
      if (testQueriesData.length > 0) {
        await fetch(`${API_BASE}/test_queries/${testQueriesData[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queries })
        });
      }
    } catch (error) {
      console.error('Failed to save test queries:', error);
      throw error;
    }
  },

  async loadBehaviorConfig(agentId: string) {
    try {
      const response = await fetch(`${API_BASE}/agent_behavior?agent_id=${agentId}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Failed to load behavior config:', error);
      return null;
    }
  },

  async loadTestQueries(agentId: string) {
    try {
      const response = await fetch(`${API_BASE}/test_queries?agent_id=${agentId}`);
      const data = await response.json();
      return data.length > 0 ? data[0].queries : [];
    } catch (error) {
      console.error('Failed to load test queries:', error);
      return [];
    }
  }
};