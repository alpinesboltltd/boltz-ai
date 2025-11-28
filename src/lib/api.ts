// API client for interacting with backend services

import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentIntegration,
  AgentStats,
  CreateAgentAPIRequest,
  SystemPromptTemplate,
  TrainingData,
  UpdateAgentRequest,
} from "@/types/agent";
import { ChatMessage, Conversation } from "@/types/conversations";

import {
  AgentActions,
  UpdateActionsRequest,
  ApiFunction,
  CustomAction,
} from "@/types/actions";
import { PlaygroundConfig } from "@/types/agent";
import {
  AIModelResponse,
  AIModelsListResponse,
  CreateAIModelRequest,
  UpdateAIModelRequest,
} from "@/types/aiModels";

// Payload Types
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
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
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

  enableOTP: async (email: string) => {
    return await apiRequest("/auth/otp/enable", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  disableOTP: async (email: string) => {
    return await apiRequest("/auth/otp/disable", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// System API
export const systemAPI = {
  // System Instructions
  createInstruction: async (
    title: string,
    content: string,
    templateId?: string
  ) => {
    return await apiRequest("/system/instructions", {
      method: "POST",
      body: JSON.stringify({ title, content, template_id: templateId }),
    });
  },

  getInstruction: async (id: string) => {
    return await apiRequest(`/system/instructions/${id}`);
  },

  updateInstruction: async (id: string, title?: string, content?: string) => {
    return await apiRequest(`/system/instructions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
  },

  deleteInstruction: async (id: string) => {
    return await apiRequest(`/system/instructions/${id}`, {
      method: "DELETE",
    });
  },

  listInstructions: async () => {
    return await apiRequest("/system/instructions");
  },

  // Prompt Templates
  createTemplate: async (title: string, content: string) => {
    return await apiRequest("/system/templates", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  },

  getTemplate: async (id: string) => {
    return await apiRequest(`/system/templates/${id}`);
  },

  listTemplates: async () => {
    return await apiRequest("/system/templates");
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
    id: string,
    token: string
  ): Promise<{
    agent: Agent;
    agent_integration: AgentIntegration;
    agent_appearance: AgentAppearance;
    agent_behavior: AgentBehavior;
    agent_integrations: AgentIntegration;
    agent_stats: AgentStats;
    training_data: TrainingData;
    system_prompt_template: SystemPromptTemplate;
  }> => {
    return await apiRequest(`/agent/${id}`, {}, token);
  },

  create: async (
    data: CreateAgentAPIRequest,
    token: string
  ): Promise<{ data: Agent }> => {
    const res = await apiRequest(
      "/agent/create",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
    return { data: res.agent };
  },

  update: async (
    id: string,
    data: UpdateAgentRequest,
    token?: string
  ): Promise<{ data: Agent }> => {
    const res = await apiRequest(
      `/agent/update/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      token
    );
    return { data: res.agent };
  },

  delete: async (id: string, token: string): Promise<void> => {
    await apiRequest(`/agent/${id}`, { method: "DELETE" }, token);
  },

  regenerateApiKey: async (id: string) => {
    return await apiRequest(`/agent/${id}/regenerate-key`, {
      method: "POST",
    });
  },

  getAppearance: async (id: string) => {
    return await apiRequest(`/agent/${id}/appearance`, { method: "GET" });
  },

  updateAppearance: async (
    id: string,
    data: UpdateAppearancePayload
  ): Promise<{ data: AgentAppearance }> => {
    return await apiRequest(`/agent/${id}/appearance`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  getActivity: async (id: string) => {
    return await apiRequest(`/agent/${id}/activity`);
  },

  getSources: async (id: string) => {
    return await apiRequest(`/agent/${id}/sources`);
  },

  addSource: async (
    id: string,
    data: AddSourcePayload
  ): Promise<{ data: unknown }> => {
    return await apiRequest(`/agent/${id}/sources`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getActions: async (id: string) => {
    return await apiRequest(`/agent/${id}/actions`);
  },

  updateActions: async (
    id: string,
    data: UpdateActionsRequest
  ): Promise<{ data: AgentActions }> => {
    return await apiRequest(`/agent/${id}/actions`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  createCustomAction: async (
    id: string,
    action: CreateCustomActionPayload
  ): Promise<{ data: CustomAction }> => {
    return await apiRequest(`/agent/${id}/actions/custom`, {
      method: "POST",
      body: JSON.stringify(action),
    });
  },

  createApiFunction: async (
    apiFunction: CreateApiFunctionPayload
  ): Promise<{ data: ApiFunction }> => {
    return await apiRequest(
      `/agent/${apiFunction.agentId}/actions/api-functions`,
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
    return await apiRequest(`/agent/${id}/actions/workflows`, {
      method: "POST",
      body: JSON.stringify(workflow),
    });
  },

  getApiFunctions: async (id: string) => {
    return await apiRequest(`/agent/${id}/actions/api-functions`);
  },

  toggleActionStatus: async (id: string, actionId: string) => {
    return await apiRequest(`/agent/${id}/actions/${actionId}/toggle`, {
      method: "PATCH",
    });
  },

  deleteCustomAction: async (id: string, actionId: string) => {
    return await apiRequest(`/agent/${id}/actions/${actionId}`, {
      method: "DELETE",
    });
  },

  getPlaygroundConfig: async (id: string) => {
    return await apiRequest(`/agent/${id}/playground`);
  },

  updatePlaygroundConfig: async (
    id: string,
    data: UpdatePlaygroundConfigPayload
  ): Promise<{ data: PlaygroundConfig }> => {
    return await apiRequest(`/agent/${id}/playground`, {
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
    return await apiRequest(`/agent/${chatagentId}/integrations/${platform}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  disconnect: async (chatagentId: string, platform: string) => {
    return await apiRequest(`/agent/${chatagentId}/integrations/${platform}`, {
      method: "DELETE",
    });
  },

  getStatus: async (chatagentId: string, platform: string) => {
    return await apiRequest(`/agent/${chatagentId}/integrations/${platform}`);
  },

  configureTwilio: async (
    chatagentId: string,
    phoneNumber: string,
    accountSid: string,
    authToken: string
  ) => {
    return await apiRequest(
      `/agent/${chatagentId}/integrations/twilio/configure`,
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
      `/agent/${chatagentId}/integrations/whatsapp/configure`,
      {
        method: "POST",
        body: JSON.stringify({ phoneNumberId, accessToken }),
      }
    );
  },

  getSlackOAuthUrl: (chatagentId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL || "/api"}/agent/${chatagentId}/integrations/slack/oauth-url`;
  },
};

// Knowledge Base API
export const knowledgeAPI = {
  getSources: async (chatagentId: string) => {
    return await apiRequest(`/agent/${chatagentId}/knowledge/sources`);
  },

  uploadDocument: async (chatagentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest(`/agent/${chatagentId}/knowledge/documents`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },

  addWebsite: async (chatagentId: string, url: string) => {
    return await apiRequest(`/agent/${chatagentId}/knowledge/websites`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  getFaqs: async (chatagentId: string) => {
    return await apiRequest(`/agent/${chatagentId}/knowledge/faqs`);
  },

  addFaq: async (chatagentId: string, question: string, answer: string) => {
    return await apiRequest(`/agent/${chatagentId}/knowledge/faqs`, {
      method: "POST",
      body: JSON.stringify({ question, answer }),
    });
  },

  deleteFaq: async (chatagentId: string, faqId: string) => {
    return await apiRequest(`/agent/${chatagentId}/knowledge/faqs/${faqId}`, {
      method: "DELETE",
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (chatagentId: string, period: string = "last30Days") => {
    return await apiRequest(
      `/agent/${chatagentId}/analytics/overview?period=${period}`
    );
  },

  getMessageVolume: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/agent/${chatagentId}/analytics/messages?period=${period}`
    );
  },

  getUserSatisfaction: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/agent/${chatagentId}/analytics/satisfaction?period=${period}`
    );
  },

  getPlatformDistribution: async (
    chatagentId: string,
    period: string = "last30Days"
  ) => {
    return await apiRequest(
      `/agent/${chatagentId}/analytics/platforms?period=${period}`
    );
  },

  getModelUsage: async (chatagentId: string, period: string = "last30Days") => {
    return await apiRequest(
      `/agent/${chatagentId}/analytics/models?period=${period}`
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

export const aiModelsAPI = {
  create: async (
    data: CreateAIModelRequest,
    token: string
  ): Promise<AIModelResponse> => {
    return await apiRequest(
      "/ai-models",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  getById: async (modelId: string, token: string): Promise<AIModelResponse> => {
    return await apiRequest(`/ai-models/${modelId}`, {}, token);
  },

  getAll: async (
    token: string,
    provider?: string
  ): Promise<AIModelsListResponse> => {
    const url = provider ? `/ai-models?provider=${provider}` : "/ai-models";
    return await apiRequest(url, {}, token);
  },

  update: async (
    modelId: string,
    data: UpdateAIModelRequest,
    token: string
  ): Promise<AIModelResponse> => {
    return await apiRequest(
      `/ai-models/${modelId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  },

  delete: async (modelId: string, token: string): Promise<void> => {
    await apiRequest(`/ai-models/${modelId}`, { method: "DELETE" }, token);
  },
};
// Training API
export const trainingAPI = {
  uploadFile: async (
    file: File,
    agentId: string,
    token: string
  ): Promise<{ message: string; file_id: string }> => {
    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only PDF, TXT, DOC, and DOCX files are allowed"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("agent_id", agentId);
    formData.append("data_type", "document");

    const response = await fetch("/training/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  },

  processTraining: async (
    agentId: string,
    dataSource: string,
    processingType: string,
    token: string
  ): Promise<{ message: string; job_id: string }> => {
    return await apiRequest(
      "/training/process",
      {
        method: "POST",
        body: JSON.stringify({
          agent_id: agentId,
          data_source: dataSource,
          processing_type: processingType,
        }),
      },
      token
    );
  },

  getStatus: async (
    agentId: string,
    token: string
  ): Promise<{
    status: string;
    progress: number;
    total_documents: number;
    processed_documents: number;
  }> => {
    return await apiRequest(`/training/status/${agentId}`, {}, token);
  },

  searchKnowledge: async (
    agentId: string,
    query: string,
    limit: number,
    token: string
  ): Promise<{ results: Array<{ content: string; score: number }> }> => {
    if (!query || query.trim().length === 0) {
      throw new Error("Query cannot be empty");
    }

    if (limit < 1 || limit > 20) {
      throw new Error("Limit must be between 1 and 20");
    }

    return await apiRequest(
      "/training/search",
      {
        method: "POST",
        body: JSON.stringify({
          agent_id: agentId,
          query,
          limit,
        }),
      },
      token
    );
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
