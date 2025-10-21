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
import axios, { AxiosResponse } from "axios";
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

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      window.location.href = "/auth/login?session_expired=true";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("auth_token", response.data.token);
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("auth_token", response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Agents API
export const agentsAPI = {
  getAll: async (userId: string): Promise<{ data: Agent[] }> => {
    const response = await api.post("/chatagents", { userId });
    return response.data;
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
    const response = await api.get(`/chatagents/${id}`);
    console.log(response);
    return response.data;
  },

  create: async (data: CreateAgentPayload) => {
    const response: AxiosResponse<{ data: Agent }> = await api.post(
      "/chatagents",
      data
    );
    return response.data;
  },

  update: async (id: string, data: UpdateAgentPayload) => {
    const response: AxiosResponse<{ data: Agent }> = await api.put(
      `/chatagents/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/chatagents/${id}`);
    return response.data;
  },

  regenerateApiKey: async (id: string) => {
    const response = await api.post(`/chatagents/${id}/regenerate-key`);
    return response.data;
  },

  // Specific data endpoints
  getAppearance: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/appearance`);
    return response.data;
  },

  updateAppearance: async (id: string, data: UpdateAppearancePayload) => {
    const response: AxiosResponse<{ data: AgentAppearance }> = await api.put(
      `/chatagents/${id}/appearance`,
      data
    );
    return response.data;
  },

  getActivity: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/activity`);
    return response.data;
  },

  getSources: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/sources`);
    return response.data;
  },

  addSource: async (id: string, data: AddSourcePayload) => {
    const response: AxiosResponse<{ data: unknown }> = await api.post(
      `/chatagents/${id}/sources`,
      data
    );
    return response.data;
  },

  getActions: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/actions`);
    return response.data;
  },

  updateActions: async (id: string, data: UpdateActionsRequest) => {
    const response: AxiosResponse<{ data: AgentActions }> = await api.put(
      `/chatagents/${id}/actions`,
      data
    );
    return response.data;
  },

  // Create custom action
  createCustomAction: async (id: string, action: CreateCustomActionPayload) => {
    const response: AxiosResponse<{ data: CustomAction }> = await api.post(
      `/chatagents/${id}/actions/custom`,
      action
    );
    return response.data;
  },

  // Create API function
  createApiFunction: async (apiFunction: CreateApiFunctionPayload) => {
    const response: AxiosResponse<{ data: ApiFunction }> = await api.post(
      `/chatagents/${apiFunction.agentId}/actions/api-functions`,
      apiFunction
    );
    return response.data;
  },

  // Create sequential workflow
  createSequentialWorkflow: async (
    id: string,
    workflow: CreateWorkflowPayload
  ) => {
    const response: AxiosResponse<{ data: unknown }> = await api.post(
      `/chatagents/${id}/actions/workflows`,
      workflow
    );
    return response.data;
  },

  // Get API functions
  getApiFunctions: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/actions/api-functions`);
    return response.data;
  },

  // Toggle action status
  toggleActionStatus: async (id: string, actionId: string) => {
    const response = await api.patch(
      `/chatagents/${id}/actions/${actionId}/toggle`
    );
    return response.data;
  },

  // Delete custom action
  deleteCustomAction: async (id: string, actionId: string) => {
    const response = await api.delete(`/chatagents/${id}/actions/${actionId}`);
    return response.data;
  },

  getPlaygroundConfig: async (id: string) => {
    const response = await api.get(`/chatagents/${id}/playground`);
    return response.data;
  },

  updatePlaygroundConfig: async (
    id: string,
    data: UpdatePlaygroundConfigPayload
  ) => {
    const response: AxiosResponse<{ data: PlaygroundConfig }> = await api.put(
      `/chatagents/${id}/playground`,
      data
    );
    return response.data;
  },
};

// Integrations API
export const integrationsAPI = {
  connect: async (
    chatagentId: string,
    platform: string,
    data: Record<string, unknown> = {}
  ) => {
    const response: AxiosResponse<{ data: unknown }> = await api.post(
      `/chatagents/${chatagentId}/integrations/${platform}`,
      data
    );
    return response.data;
  },

  disconnect: async (chatagentId: string, platform: string) => {
    const response = await api.delete(
      `/chatagents/${chatagentId}/integrations/${platform}`
    );
    return response.data;
  },

  getStatus: async (chatagentId: string, platform: string) => {
    const response = await api.get(
      `/chatagents/${chatagentId}/integrations/${platform}`
    );
    return response.data;
  },

  // Twilio specific integration
  configureTwilio: async (
    chatagentId: string,
    phoneNumber: string,
    accountSid: string,
    authToken: string
  ) => {
    const response = await api.post(
      `/chatagents/${chatagentId}/integrations/twilio/configure`,
      {
        phoneNumber,
        accountSid,
        authToken,
      }
    );
    return response.data;
  },

  // WhatsApp specific integration
  configureWhatsApp: async (
    chatagentId: string,
    phoneNumberId: string,
    accessToken: string
  ) => {
    const response = await api.post(
      `/chatagents/${chatagentId}/integrations/whatsapp/configure`,
      {
        phoneNumberId,
        accessToken,
      }
    );
    return response.data;
  },

  // Slack specific integration
  getSlackOAuthUrl: (chatagentId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL || "/api"}/chatagents/${chatagentId}/integrations/slack/oauth-url`;
  },
};

// Knowledge Base API
export const knowledgeAPI = {
  getSources: async (chatagentId: string) => {
    const response = await api.get(
      `/chatagents/${chatagentId}/knowledge/sources`
    );
    return response.data;
  },

  uploadDocument: async (chatagentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/chatagents/${chatagentId}/knowledge/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  addWebsite: async (chatagentId: string, url: string) => {
    const response = await api.post(
      `/chatagents/${chatagentId}/knowledge/websites`,
      { url }
    );
    return response.data;
  },

  getFaqs: async (chatagentId: string) => {
    const response = await api.get(`/chatagents/${chatagentId}/knowledge/faqs`);
    return response.data;
  },

  addFaq: async (chatagentId: string, question: string, answer: string) => {
    const response = await api.post(
      `/chatagents/${chatagentId}/knowledge/faqs`,
      {
        question,
        answer,
      }
    );
    return response.data;
  },

  deleteFaq: async (chatagentId: string, faqId: string) => {
    const response = await api.delete(
      `/chatagents/${chatagentId}/knowledge/faqs/${faqId}`
    );
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (chatagentId: string, period: string = "last30Days") => {
    const response = await api.get(
      `/chatagents/${chatagentId}/analytics/overview`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getMessageVolume: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatagents/${chatagentId}/analytics/messages`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getUserSatisfaction: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatagents/${chatagentId}/analytics/satisfaction`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getPlatformDistribution: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatagents/${chatagentId}/analytics/platforms`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getModelUsage: async (chatagentId: string, period: string = "last30Days") => {
    const response = await api.get(
      `/chatagents/${chatagentId}/analytics/models`,
      {
        params: { period },
      }
    );
    return response.data;
  },
};

export const AdminChatLogAPI = {
  getChatLog: async (agentId: string): Promise<{ data: Conversation[] }> => {
    const response = await api.get(`/admin/chatlog/${agentId}`);
    return response.data;
  },

  getChatLogMessages: async (
    convoId: string
  ): Promise<{ data: ChatMessage[] }> => {
    const response = await api.get(`/admin/messages/${convoId}`);
    return response.data;
  },
};

export const Chat = {
  sendMessage: async (
    message: string,
    history: { role: string; parts: string }[],
    agentId: string
  ): Promise<{ reply: string }> => {
    const response = await api.post("/chat", {
      message,
      history,
      agentId,
    });
    console.log(response.data)
    return response.data;
  },
};

export default api;
