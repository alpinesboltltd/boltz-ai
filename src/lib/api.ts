// API client for interacting with backend services

import {
  Chatbot,
  ChatbotAppearance,
  ChatbotBehavior,
  ChatbotIntegration,
  ChatbotStats,
  TrainingData,
} from "@/types/chatbot";
import { ChatMessage, Conversation } from "@/types/conversations";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add auth token to requests if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

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

// Chatbots API
export const chatbotsAPI = {
  getAll: async (userId = "1"): Promise<{ data: Chatbot[] }> => {
    const response = await api.post("/chatbots", { userId });
    return response.data;
  },

  getById: async (
    id: string
  ): Promise<{
    // data: Chatbot;
    data: {
      appearance: ChatbotAppearance;
      behavior: ChatbotBehavior;
      integrations: ChatbotIntegration;
      stats: ChatbotStats;
      training_data: TrainingData;
    };
  }> => {
    const response = await api.get(`/chatbots/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/chatbots", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/chatbots/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/chatbots/${id}`);
    return response.data;
  },

  regenerateApiKey: async (id: string) => {
    const response = await api.post(`/chatbots/${id}/regenerate-key`);
    return response.data;
  },
};

// Integrations API
export const integrationsAPI = {
  connect: async (chatbotId: string, platform: string, data: any = {}) => {
    const response = await api.post(
      `/chatbots/${chatbotId}/integrations/${platform}`,
      data
    );
    return response.data;
  },

  disconnect: async (chatbotId: string, platform: string) => {
    const response = await api.delete(
      `/chatbots/${chatbotId}/integrations/${platform}`
    );
    return response.data;
  },

  getStatus: async (chatbotId: string, platform: string) => {
    const response = await api.get(
      `/chatbots/${chatbotId}/integrations/${platform}`
    );
    return response.data;
  },

  // Twilio specific integration
  configureTwilio: async (
    chatbotId: string,
    phoneNumber: string,
    accountSid: string,
    authToken: string
  ) => {
    const response = await api.post(
      `/chatbots/${chatbotId}/integrations/twilio/configure`,
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
    chatbotId: string,
    phoneNumberId: string,
    accessToken: string
  ) => {
    const response = await api.post(
      `/chatbots/${chatbotId}/integrations/whatsapp/configure`,
      {
        phoneNumberId,
        accessToken,
      }
    );
    return response.data;
  },

  // Slack specific integration
  getSlackOAuthUrl: (chatbotId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL || "/api"}/chatbots/${chatbotId}/integrations/slack/oauth-url`;
  },
};

// Knowledge Base API
export const knowledgeAPI = {
  getSources: async (chatbotId: string) => {
    const response = await api.get(`/chatbots/${chatbotId}/knowledge/sources`);
    return response.data;
  },

  uploadDocument: async (chatbotId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/chatbots/${chatbotId}/knowledge/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  addWebsite: async (chatbotId: string, url: string) => {
    const response = await api.post(
      `/chatbots/${chatbotId}/knowledge/websites`,
      { url }
    );
    return response.data;
  },

  getFaqs: async (chatbotId: string) => {
    const response = await api.get(`/chatbots/${chatbotId}/knowledge/faqs`);
    return response.data;
  },

  addFaq: async (chatbotId: string, question: string, answer: string) => {
    const response = await api.post(`/chatbots/${chatbotId}/knowledge/faqs`, {
      question,
      answer,
    });
    return response.data;
  },

  deleteFaq: async (chatbotId: string, faqId: string) => {
    const response = await api.delete(
      `/chatbots/${chatbotId}/knowledge/faqs/${faqId}`
    );
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (chatbotId: string, period: string = "last30Days") => {
    const response = await api.get(
      `/chatbots/${chatbotId}/analytics/overview`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getMessageVolume: async (
    chatbotId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatbots/${chatbotId}/analytics/messages`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getUserSatisfaction: async (
    chatbotId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatbots/${chatbotId}/analytics/satisfaction`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getPlatformDistribution: async (
    chatbotId: string,
    period: string = "last30Days"
  ) => {
    const response = await api.get(
      `/chatbots/${chatbotId}/analytics/platforms`,
      {
        params: { period },
      }
    );
    return response.data;
  },

  getModelUsage: async (chatbotId: string, period: string = "last30Days") => {
    const response = await api.get(`/chatbots/${chatbotId}/analytics/models`, {
      params: { period },
    });
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
    const response = await api.get(`/admin/chatlog/messages/${convoId}`);
    return response.data;
  },
};
export default api;
