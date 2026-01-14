// API client for interacting with backend services

import {
  Agent,
  AgentAppearance,
  AgentBehavior,
  AgentChannel,
  AgentIntegration,
  AgentStats,
  AgentTemplate,
  CreateAgentAPIRequest,
  TrainingData,
  UpdateAgentRequest,
  TestQuery,
} from "@/types/agent";

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface TrainingDocument {
  id: string;
  agent_id: string;
  title: string;
  document_type: "text" | "pdf" | "audio" | "video" | "faq" | "image";
  source_url?: string;
  is_active: boolean;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  chunks?: DocumentChunk[];
}

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
import { getCookie } from "./utils/cookies";
import { useAuthStore } from "@/store/authStore";

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

export interface ScraperPayload {
  url: string;
  trace?: boolean;
  exclude?: string[];
  max_pages?: number;
}

// API helper function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> => {
  // Use provided token or get from localStorage/cookies as fallback
  let authToken = token;

  if (!authToken) {
    if (typeof window !== "undefined") {
      // Client-side: Try localStorage then cookie
      authToken =
        localStorage.getItem("boltz_by_alpinesbolt_auth_token") ||
        getCookie("boltz_by_alpinesbolt_auth_token");
    } else {
      // Server-side: Try to get from cookies
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        authToken = cookieStore.get("boltz_by_alpinesbolt_auth_token")?.value;
      } catch (error) {
        // Ignore error if next/headers is not available or fails
        console.warn("Failed to retrieve auth token on server:", error);
      }
    }
  }

  // Get Workspace ID from localStorage (client-side only for now)
  let workspaceId: string | undefined;
  if (typeof window !== "undefined") {
    try {
      const workspaceStorage = localStorage.getItem("workspace-storage");
      if (workspaceStorage) {
        const parsed = JSON.parse(workspaceStorage);
        workspaceId = parsed.state?.currentWorkspace?.id;
      }
    } catch (e) {
      // Silent fail or log
    }
  }

  const response = await fetch(`/v1${endpoint}`, {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...(workspaceId && { "X-Workspace-ID": workspaceId }),
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }

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
    localStorage.setItem("boltz_by_alpinesbolt_auth_token", data.token);
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const data = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("boltz_by_alpinesbolt_auth_token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("boltz_by_alpinesbolt_auth_token");
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    return await apiRequest("/auth/me");
  },

  enableOTP: async (email: string) => {
    return await apiRequest("/otp/enable", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  disableOTP: async (email: string) => {
    return await apiRequest("/otp/disable", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  changePassword: async (password: string) => {
    return await apiRequest("/otp/password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  resendVerificationEmail: async (email: string) => {
    return await apiRequest("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyToken: async (id_token: string) => {
    return await apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ id_token }),
    });
  },
};

export const otpAPI = {
  request: async (email: string, purpose: string = "password_reset") => {
    return await apiRequest("/otp/request", {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    });
  },

  verify: async (
    email: string,
    code: string,
    purpose: string = "password_reset"
  ) => {
    return await apiRequest("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ email, code, purpose }),
    });
  },

  completePasswordReset: async (
    email: string,
    code: string,
    new_password: string
  ) => {
    return await apiRequest("/otp/password-reset/complete", {
      method: "POST",
      body: JSON.stringify({ email, code, new_password }),
    });
  },

  enable2FA: async () => {
    return await apiRequest("/otp/2fa/enable", { method: "POST" });
  },

  disable2FA: async () => {
    return await apiRequest("/otp/2fa/disable", { method: "POST" });
  },
};
// Test Queries API
export const testQueriesAPI = {
  get: async (agentId: string) => {
    return await apiRequest<{ queries: TestQuery[] }>(
      `/agent/${agentId}/queries`
    );
  },
  create: async (agentId: string, query: string) => {
    return await apiRequest<{ query: TestQuery }>(`/agent/${agentId}/queries`, {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },
  bulkReplace: async (agentId: string, queries: string[]) => {
    return await apiRequest<{ queries: TestQuery[] }>(
      `/agent/${agentId}/queries`,
      {
        method: "PUT",
        body: JSON.stringify({ queries }),
      }
    );
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
  createTemplate: async (title: string, content: string, role?: string) => {
    return await apiRequest("/system/templates", {
      method: "POST",
      body: JSON.stringify({ title, content, role }),
    });
  },

  getTemplate: async (id: string) => {
    return await apiRequest(`/system/templates/${id}`);
  },

  listTemplates: async (role?: string) => {
    const url = role ? `/system/templates?role=${role}` : "/system/templates";
    return await apiRequest(url);
  },

  updateTemplate: async (
    id: string,
    title?: string,
    content?: string,
    role?: string
  ) => {
    return await apiRequest(`/system/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title, content, role }),
    });
  },

  deleteTemplate: async (id: string) => {
    return await apiRequest(`/system/templates/${id}`, {
      method: "DELETE",
    });
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

  getByWorkspaceId: async (
    workspaceId: string,
    token?: string
  ): Promise<{ agents: Agent[] }> => {
    return await apiRequest(
      `/agent/agents/workspace/${workspaceId}`,
      {},
      token
    );
  },

  getById: async (
    id: string,
    token: string
  ): Promise<{
    agent: Agent;
    agent_appearance: AgentAppearance | null;
    agent_behavior: AgentBehavior | null;
    agent_integration: AgentIntegration | null;
    agent_channel: AgentChannel | null;
    agent_stats: AgentStats | null;
    training_data: TrainingData[];
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

  createTemplate: async (templateData: Partial<AgentTemplate>) => {
    const res = await apiRequest("/system/templates/agents/create", {
      method: "POST",
      body: JSON.stringify(templateData),
    });
    return res;
  },

  listTemplates: async (): Promise<AgentTemplate[]> => {
    const response = await apiRequest("/system/templates/agents");
    return response.templates;
  },

  hire: async (templateId: string) => {
    // We need workspaceId. `apiRequest` handles it via localStorage or context if enabled.
    // The endpoint is /agent/hire. Body: { system_agent_id: templateId } (legacy name or update it?)
    // Handler `HireAgent` uses `req.SystemAgentID`. I'll pass that key to match handler struct `HireAgentRequest`.
    return await apiRequest("/agent/hire", {
      method: "POST",
      body: JSON.stringify({ system_agent_id: templateId }),
    });
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

  // Agent Appearance
  createAppearance: async (
    data: Partial<AgentAppearance>
  ): Promise<{ appearance: AgentAppearance }> => {
    return await apiRequest(`/agent/create/appearance`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAppearance: async (id: string) => {
    return await apiRequest(`/agent/${id}/appearance`, { method: "GET" });
  },

  updateAppearance: async (
    id: string,
    data: UpdateAppearancePayload
  ): Promise<{ appearance: AgentAppearance }> => {
    return await apiRequest(`/agent/${id}/appearance`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAppearance: async (id: string) => {
    return await apiRequest(`/agent/${id}/appearance`, {
      method: "DELETE",
    });
  },

  // Agent Behavior
  createBehavior: async (
    data: Partial<AgentBehavior>
  ): Promise<{ behavior: AgentBehavior }> => {
    return await apiRequest(`/agent/create/behavior`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getBehavior: async (id: string) => {
    return await apiRequest(`/agent/${id}/behavior`);
  },

  updateBehavior: async (
    id: string,
    data: Partial<AgentBehavior>
  ): Promise<{ behavior: AgentBehavior }> => {
    return await apiRequest(`/agent/${id}/behavior`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteBehavior: async (id: string) => {
    return await apiRequest(`/agent/${id}/behavior`, {
      method: "DELETE",
    });
  },

  // Agent Channel
  createChannel: async (
    data: Partial<AgentChannel>
  ): Promise<{ channel: AgentChannel }> => {
    return await apiRequest(`/agent/create/channel`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getChannel: async (id: string) => {
    return await apiRequest(`/agent/${id}/channel`);
  },

  updateChannel: async (
    id: string,
    data: Partial<AgentChannel>
  ): Promise<{ channel: AgentChannel }> => {
    return await apiRequest(`/agent/${id}/channel`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteChannel: async (id: string) => {
    return await apiRequest(`/agent/${id}/channel`, {
      method: "DELETE",
    });
  },

  // Agent Integration
  createIntegration: async (
    data: Partial<AgentIntegration>
  ): Promise<{ integration: AgentIntegration }> => {
    return await apiRequest(`/agent/create/integration`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getIntegration: async (id: string) => {
    return await apiRequest(`/agent/${id}/integration`);
  },

  updateIntegration: async (
    id: string,
    data: Partial<AgentIntegration>
  ): Promise<{ integration: AgentIntegration }> => {
    return await apiRequest(`/agent/${id}/integration`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteIntegration: async (id: string) => {
    return await apiRequest(`/agent/${id}/integration`, {
      method: "DELETE",
    });
  },

  // Agent Stats
  getStats: async (id: string) => {
    return await apiRequest(`/agent/${id}/stats`);
  },

  deleteStats: async (id: string) => {
    return await apiRequest(`/agent/${id}/stats`, {
      method: "DELETE",
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
    return await apiRequest(`/agent/${chatagentId}/training/documents`);
  },

  uploadDocument: async (chatagentId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest(`/agent/${chatagentId}/train/file`, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },

  addWebsite: async (chatagentId: string, url: string) => {
    return await apiRequest(`/agent/${chatagentId}/train/url`, {
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
// Training API
export const trainingAPI = {
  trainWithText: async (
    agentId: string,
    title: string,
    content: string,
    type: string = "text",
    token?: string
  ) => {
    return await apiRequest<{ message: string }>(
      `/agent/${agentId}/train/text`,
      {
        method: "POST",
        body: JSON.stringify({ title, content, type }),
      },
      token
    );
  },

  trainWithURL: async (
    agentId: string,
    url: string,
    maxPages: number = 10,
    excludePatterns: string[] = [],
    token?: string
  ) => {
    return await apiRequest<{ message: string }>(
      `/agent/${agentId}/train/url`,
      {
        method: "POST",
        body: JSON.stringify({
          url,
          max_pages: maxPages,
          exclude_patterns: excludePatterns,
        }),
      },
      token
    );
  },

  trainWithFile: async (agentId: string, file: File, token?: string) => {
    const formData = new FormData();
    formData.append("file", file);

    // apiRequest now handles FormData by not forcing Content-Type: application/json
    return await apiRequest<{ message: string }>(
      `/agent/${agentId}/train/file`,
      {
        method: "POST",
        body: formData,
      },
      token
    );
  },

  getDocuments: async (agentId: string, token?: string) => {
    return await apiRequest<{ documents: TrainingDocument[] }>(
      `/agent/${agentId}/training/documents`,
      {},
      token
    );
  },

  getStats: async (agentId: string, token?: string) => {
    return await apiRequest<Record<string, unknown>>(
      `/agent/${agentId}/training/stats`,
      {},
      token
    );
  },

  query: async (agentId: string, query: string, token?: string) => {
    return await apiRequest<{
      context: string;
      chunks: any[];
      query: string;
    }>(
      `/agent/${agentId}/training/query`,
      {
        method: "POST",
        body: JSON.stringify({ query }),
      },
      token
    );
  },

  deleteTrainingData: async (
    agentId: string,
    documentId?: string, // Made optional to match backend flexibility, but practically usually provided
    token?: string
  ) => {
    const url = documentId
      ? `/agent/${agentId}/training?documentId=${documentId}`
      : `/agent/${agentId}/training`;

    return await apiRequest<{ message: string }>(
      url,
      {
        method: "DELETE",
      },
      token
    );
  },
};

export const workspacesAPI = {
  create: async (name: string, description?: string) => {
    return await apiRequest("/workspaces", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  },

  getAll: async () => {
    return await apiRequest("/workspaces");
  },

  getById: async (id: string) => {
    return await apiRequest(`/workspaces/${id}`);
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

// Scraper API
export const scraperAPI = {
  scrape: async (payload: ScraperPayload) => {
    return await apiRequest("/scrape", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Google Integrations
export const connectGoogleService = async (
  agentId: string,
  service: string
) => {
  return apiRequest(
    `/agent/${agentId}/integrations/google/${service}/connect`,
    {
      method: "POST",
    }
  );
};

export const disconnectGoogleService = async (
  agentId: string,
  service: string
) => {
  return apiRequest(
    `/agent/${agentId}/integrations/google/${service}/disconnect`,
    {
      method: "DELETE",
    }
  );
};

export const getGoogleStatus = async (agentId: string) => {
  return apiRequest(`/agent/${agentId}/integrations/google/status`);
};

// Agent Templates & Hiring
export const getAgentTemplates = async () => {
  return apiRequest("/agent/templates");
};

export const hireAgent = async (systemAgentId: string) => {
  return apiRequest("/agent/hire", {
    method: "POST",
    body: JSON.stringify({ system_agent_id: systemAgentId }),
  });
};

export const createAgentTemplate = async (data: any) => {
  // Uses createAgent but with is_template=true
  return apiRequest("/agent/create", {
    method: "POST",
    body: JSON.stringify({ ...data, is_template: true }),
  });
};

// ICP API
import { ICP } from "@/schemas/icp";

export const icpAPI = {
  create: (workspaceId: string, icp: Partial<ICP>) =>
    apiRequest<ICP>(`/workspaces/${workspaceId}/icps`, {
      method: "POST",
      body: JSON.stringify(icp),
    }),

  list: (workspaceId: string) =>
    apiRequest<ICP[]>(`/workspaces/icps/${workspaceId}`, {
      method: "GET",
    }),

  get: (workspaceId: string, icpId: string) =>
    apiRequest<ICP>(`/workspaces/icps/${workspaceId}/${icpId}`, {
      method: "GET",
    }),

  update: (workspaceId: string, icpId: string, icp: Partial<ICP>) =>
    apiRequest<ICP>(`/workspaces/icps/${workspaceId}/${icpId}`, {
      method: "PUT",
      body: JSON.stringify(icp),
    }),

  delete: (workspaceId: string, icpId: string) =>
    apiRequest(`/workspaces/icps/${workspaceId}/${icpId}`, {
      method: "DELETE",
    }),

  resolve: (workspaceId: string, agentRole: string) =>
    apiRequest<{ icp_context: string; count: number }>("/agent/icp/resolve", {
      method: "POST",
      body: JSON.stringify({
        workspace_id: workspaceId,
        agent_role: agentRole,
      }),
    }),
};

// Waitlist API
export const waitlistAPI = {
  join: async (data: {
    name: string;
    email: string;
    organization?: string;
    role?: string;
    inquiry?: string;
    marketing_consent: boolean;
  }) => {
    console.log("Hello world");
    return await apiRequest("/waitlist/join", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export default apiRequest;

// Supported Providers API (Admin only)
export const supportedProviderAPI = {
  create: async (name: string) => {
    return await apiRequest("/supported-providers", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  getAll: async () => {
    return await apiRequest<{
      providers: {
        id: string;
        name: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }[];
    }>("/supported-providers");
  },

  getById: async (id: string) => {
    return await apiRequest(`/supported-providers/${id}`);
  },

  update: async (id: string, is_active: boolean) => {
    return await apiRequest(`/supported-providers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active }),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/supported-providers/${id}`, {
      method: "DELETE",
    });
  },
};

// Objectives API
export const objectivesAPI = {
  create: async (
    workspaceId: string,
    description: string,
    agentId?: string
  ) => {
    return await apiRequest<{ objective: any }>(
      `/workspaces/objectives/${workspaceId}`,
      {
        method: "POST",
        body: JSON.stringify({ description, agent_id: agentId }),
      }
    );
  },
  getByWorkspace: async (workspaceId: string) => {
    return await apiRequest<{ objectives: any[] }>(
      `/workspaces/objectives/${workspaceId}`
    );
  },
  get: async (objectiveId: string) => {
    return await apiRequest<{ objective: any }>(`/objectives/${objectiveId}`);
  },
  execute: async (objectiveId: string) => {
    return await apiRequest<{ objective: any }>(
      `/objectives/${objectiveId}/execute`,
      { method: "POST" }
    );
  },
};

// Activity API
export const activityAPI = {
  getByWorkspace: async (workspaceId: string, limit?: number) => {
    const url = `/workspaces/activities/${workspaceId}${limit ? `?limit=${limit}` : ""}`;
    return await apiRequest<{ activities: any[] }>(url);
  },
};

// Analysis API
export const analysisAPI = {
  getByWorkspace: async (workspaceId: string) => {
    return await apiRequest<{ analysis: any }>(
      `/workspaces/analysis/${workspaceId}`
    );
  },
  getByAgent: async (agentId: string) => {
    return await apiRequest<{ analysis: any }>(`/agent/${agentId}/analysis`);
  },
};
