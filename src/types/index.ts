import { User } from "firebase/auth";

// AI Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  pricing: string;
  isPopular: boolean;
}

// Chatbot Types
export interface Chatbot {
  id: string;
  name: string;
  description: string;
  aiModel: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  settings: ChatbotSettings;
  stats: ChatbotStats;
}

export interface ChatbotSettings {
  appearance: {
    primaryColor: string;
    fontFamily: string;
    chatIcon: string;
    welcomeMessage: string;
  };
  behavior: {
    initialMessages: string[];
    fallbackMessage: string;
    enableHumanHandoff: boolean;
    offlineMessage: string;
  };
  integrations: {
    platforms: string[];
    apiKeys: Record<string, string>;
  };
}

export interface ChatbotStats {
  totalMessages: number;
  uniqueUsers: number;
  averageRating: number;
  responseRate: number;
  conversionsCount: number;
}

// User Types
export interface Profile extends User {
  id?: string;
  plan: SubscriptionPlans;
  role: UserRoles;
  createdAt?: string;
  company?: string;
  avatar?: string;
}

// Message Types
export interface Message {
  id: string;
  chatbotId: string;
  sessionId: string;
  content: string;
  role: "user" | "bot";
  timestamp: string;
  metadata?: Record<string, any>;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  category: "messaging" | "crm" | "ecommerce" | "knowledge" | "analytics";
  description: string;
  icon: string;
  availableInPlans: ("free" | "pro" | "business")[];
}

// Knowledge Base Types
export interface KnowledgeBase {
  id: string;
  chatbotId: string;
  name: string;
  description: string;
  sources: KnowledgeSource[];
  lastTrainedAt: string;
  status: "trained" | "training" | "failed" | "not_trained";
}

export interface KnowledgeSource {
  id: string;
  type: "document" | "website" | "faq" | "custom";
  name: string;
  content: string | null;
  url: string | null;
  fileUrl: string | null;
  createdAt: string;
}

// Analytics Types
export interface AnalyticsData {
  period: "day" | "week" | "month" | "year";
  metrics: {
    totalMessages: number;
    uniqueUsers: number;
    averageRating: number;
    responseRate: number;
    conversionsCount: number;
  };
  timeline: {
    date: string;
    messages: number;
    users: number;
  }[];
  topQuestions: {
    question: string;
    count: number;
  }[];
  userSatisfaction: {
    satisfied: number;
    neutral: number;
    unsatisfied: number;
  };
}

export enum AuthRequestMethods {
  password = "password",
  google = "google",
  github = "github",
}

export enum SubscriptionPlans {
  free = "free",
  pro = "pro",
  business = "business",
  enterprise = "enterprise",
}

export enum UserRoles {
  admin = "admin",
  user = "user",
}
export enum FirebaseErrorMessage {
  userNotFound = "auth/user-not-found",
  wrongPassword = "auth/wrong-password",
  tooManyRequests = "auth/too-many-requests",
  userDisabled = "auth/user-disabled",
  //Oauth
  accountExistWithDifferentCredentials = "auth/account-exists-with-different-credential",
  popUpClosedByUser = "auth/popup-closed-by-user",
  cancelledPopupRequest = "auth/cancelled-popup-request",
  popupBlocked = "auth/popup/blocked",
  networkFailure = "auth/network-request-failed",
}
