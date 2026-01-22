import { User } from "firebase/auth";

// AI Model Types
// export interface AIModel {
//   id: string;
//   name: string;
//   provider: string;
//   description: string;
//   capabilities: string[];
//   pricing: string;
//   isPopular: boolean;
// }

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

// User Types
export interface Profile extends User {
  id?: string;
  firebase_uid: string;
  name: string;
  plan?: SubscriptionPlans;
  role: UserRoles;
  company?: string;
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  onlineStatus?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Message Types
export interface Message {
  id: string;
  chatagentId: string;
  sessionId: string;
  // content: string;
  parts: string;
  role: "user" | "system";
  timestamp: string;
  metadata?: MessageMetadata;
}

// Narrow metadata shape to common JSON-compatible primitives/arrays/objects
export type JSONPrimitive = string | number | boolean | null;
export interface JSONObject {
  [key: string]: JSONValue;
}
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type MessageMetadata = Record<string, JSONValue>;

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
  chatagentId: string;
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
  superAdmin = "superadmin",
  admin = "admin",
  editor = "editor",
  viewer = "viewer",
  user = "user",
  staff = "staff",
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

// Re-export new types
export * from "./sources";
export * from "./actions";
export * from "./aiModels";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
  updated_at: string;
  user?: Profile;
}
