// API client for interacting with backend services

import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentIntegration,
  AgentStats,
  TrainingData,
} from "@/types/agent";
import { ChatMessage, Conversation } from "@/types/conversations";

import {
  AgentActions,
  UpdateActionsRequest,
  ApiFunction,
  CustomAction,
} from "@/types/actions";
import { PlaygroundConfig } from "@/types/agent";

// Payload Types
export interface CreateAgentPayload {
  name: string;
  description: string;
  agent_type: string; // could refine with AgentType but keep string to match backend
  ai_model: string;
  ai_provider: string;
  credits_per_1k: number;
  status?: string;
}

export type UpdateAgentPayload = Partial<CreateAgentPayload> & { id?: string };

export interface UpdateAppearancePayload {
  primary_color?: string;
  font_family?: string;
  chat_icon?: string;
  welcome_message?: string;
  position?: string;
  icon_size?: string;
  bubble_style?: string;
}

export interface AddSourcePayload {
  type: string;
  url?: string;
  content?: string;
  title?: string;
}

export type CreateCustomActionPayload = Omit<
  CustomAction,
  "id" | "created_at" | "updated_at" | "isBuiltIn"
>;

export type CreateApiFunctionPayload = Omit<
  ApiFunction,
  "id" | "created_at" | "updated_at"
>;

export interface CreateWorkflowPayload {
  name: string;
  description?: string;
  steps: Array<{ id: string; type: string; config: Record<string, unknown> }>;
}

export type UpdatePlaygroundConfigPayload = Partial<PlaygroundConfig>;

// API helper function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
) => {
  // Use provided token or get from localStorage as fallback
  const authToken = token;

  const response = await fetch(`/v1${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("auth_token", data.token);
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("auth_token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    return await apiRequest("/auth/me");
  },
};

// Agents API
export const agentsAPI = {
  getAll: async (
    userId: string,
    token?: string
  ): Promise<{ agents: Agent[] }> => {
    return await apiRequest(`/agent/agents/${userId}`, {}, token);
  },

  getById: async (
    id: string
  ): Promise<{
    data: {
      appearance: AgentAppearance;
      behavior: AgentBehavior;
      integrations: AgentIntegration;
      stats: AgentStats;
      training_data: TrainingData;
    };
  }> => {
    return await apiRequest(`/chatagents/${id}`);
  },

  create: async (data: CreateAgentPayload): Promise<{ data: Agent }> => {
    return await apiRequest("/chatagents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: UpdateAgentPayload
  ): Promise<{ data: Agent }> => {
    return await apiRequest(`/chatagents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string, token: string): Promise<void> => {
    await apiRequest(`/agent/${id}`, { method: "DELETE" }, token);
  },

  regenerateApiKey: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/regenerate-key`, {
      method: "POST",
    });
  },

  getAppearance: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/appearance`);
  },

  updateAppearance: async (
    id: string,
    data: UpdateAppearancePayload
  ): Promise<{ data: AgentAppearance }> => {
    return await apiRequest(`/chatagents/${id}/appearance`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getActivity: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/activity`);
  },

  getSources: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/sources`);
  },

  addSource: async (
    id: string,
    data: AddSourcePayload
  ): Promise<{ data: unknown }> => {
    return await apiRequest(`/chatagents/${id}/sources`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getActions: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/actions`);
  },

  updateActions: async (
    id: string,
    data: UpdateActionsRequest
  ): Promise<{ data: AgentActions }> => {
    return await apiRequest(`/chatagents/${id}/actions`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  createCustomAction: async (
    id: string,
    action: CreateCustomActionPayload
  ): Promise<{ data: CustomAction }> => {
    return await apiRequest(`/chatagents/${id}/actions/custom`, {
      method: "POST",
      body: JSON.stringify(action),
    });
  },

  createApiFunction: async (
    apiFunction: CreateApiFunctionPayload
  ): Promise<{ data: ApiFunction }> => {
    return await apiRequest(
      `/chatagents/${apiFunction.agentId}/actions/api-functions`,
      {
        method: "POST",
        body: JSON.stringify(apiFunction),
      }
    );
  },

  createSequentialWorkflow: async (
    id: string,
    workflow: CreateWorkflowPayload
  ): Promise<{ data: unknown }> => {
    return await apiRequest(`/chatagents/${id}/actions/workflows`, {
      method: "POST",
      body: JSON.stringify(workflow),
    });
  },

  getApiFunctions: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/actions/api-functions`);
  },

  toggleActionStatus: async (id: string, actionId: string) => {
    return await apiRequest(`/chatagents/${id}/actions/${actionId}/toggle`, {
      method: "PATCH",
    });
  },

  deleteCustomAction: async (id: string, actionId: string) => {
    return await apiRequest(`/chatagents/${id}/actions/${actionId}`, {
      method: "DELETE",
    });
  },

  getPlaygroundConfig: async (id: string) => {
    return await apiRequest(`/chatagents/${id}/playground`);
  },

  updatePlaygroundConfig: async (
    id: string,
    data: UpdatePlaygroundConfigPayload
  ): Promise<{ data: PlaygroundConfig }> => {
    return await apiRequest(`/chatagents/${id}/playground`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// Integrations API
export const integrationsAPI = {
  connect: async (
    chatagentId: string,
    platform: string,
    data: Record<string, unknown> = {}
  ): Promise<{ data: unknown }> => {
    return await apiRequest(
      `/chatagents/${chatagentId}/integrations/${platform}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  disconnect: async (chatagentId: string, platform: string) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/integrations/${platform}`,
      {
        method: "DELETE",
      }
    );
  },

  getStatus: async (chatagentId: string, platform: string) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/integrations/${platform}`
    );
  },

  configureTwilio: async (
    chatagentId: string,
    phoneNumber: string,
    accountSid: string,
    authToken: string
  ) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/integrations/twilio/configure`,
      {
        method: "POST",
        body: JSON.stringify({ phoneNumber, accountSid, authToken }),
      }
    );
  },

  configureWhatsApp: async (
    chatagentId: string,
    phoneNumberId: string,
    accessToken: string
  ) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/integrations/whatsapp/configure`,
      {
        method: "POST",
        body: JSON.stringify({ phoneNumberId, accessToken }),
      }
    );
  },

  getSlackOAuthUrl: (chatagentId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL || "/api"}/chatagents/${chatagentId}/integrations/slack/oauth-url`;
  },
};

// Knowledge Base API
export const knowledgeAPI = {
  getSources: async (chatagentId: string) => {
    return await apiRequest(`/chatagents/${chatagentId}/knowledge/sources`);
  },

  uploadDocument: async (chatagentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest(`/chatagents/${chatagentId}/knowledge/documents`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },

  addWebsite: async (chatagentId: string, url: string) => {
    return await apiRequest(`/chatagents/${chatagentId}/knowledge/websites`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  getFaqs: async (chatagentId: string) => {
    return await apiRequest(`/chatagents/${chatagentId}/knowledge/faqs`);
  },

  addFaq: async (chatagentId: string, question: string, answer: string) => {
    return await apiRequest(`/chatagents/${chatagentId}/knowledge/faqs`, {
      method: "POST",
      body: JSON.stringify({ question, answer }),
    });
  },

  deleteFaq: async (chatagentId: string, faqId: string) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/knowledge/faqs/${faqId}`,
      {
        method: "DELETE",
      }
    );
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (chatagentId: string, period: string = "last30Days") => {
    return await apiRequest(
      `/chatagents/${chatagentId}/analytics/overview?period=${period}`
    );
  },

  getMessageVolume: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/analytics/messages?period=${period}`
    );
  },

  getUserSatisfaction: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/analytics/satisfaction?period=${period}`
    );
  },

  getPlatformDistribution: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/chatagents/${chatagentId}/analytics/platforms?period=${period}`
    );
  },

  getModelUsage: async (chatagentId: string, period: string = "last30Days") => {
    return await apiRequest(
      `/chatagents/${chatagentId}/analytics/models?period=${period}`
    );
  },
};

export const AdminChatLogAPI = {
  getChatLog: async (agentId: string): Promise<{ data: Conversation[] }> => {
    return await apiRequest(`/admin/chatlog/${agentId}`);
  },

  getChatLogMessages: async (
    convoId: string
  ): Promise<{ data: ChatMessage[] }> => {
    return await apiRequest(`/admin/messages/${convoId}`);
  },
};

export const Chat = {
  sendMessage: async (
    message: string,
    history: { role: string; parts: string }[],
    agentId: string
  ): Promise<{ reply: string }> => {
    return await apiRequest("/chat", {
      method: "POST",
      body: JSON.stringify({ message, history, agentId }),
    });
  },
};

export default apiRequest;
