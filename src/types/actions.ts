// Core Action Types
export type ActionCategory = "core" | "system" | "custom" | "meta";
export type ActionType = "conversation" | "followup" | "task" | "knowledge" | "booking" | "order" | "alert" | "workflow" | "api" | "messaging" | "business" | "learning";
export type ActionStatus = "active" | "inactive" | "draft";
export type TriggerType = "keyword" | "intent" | "sentiment" | "condition" | "manual";

// Action Configuration
export interface ActionTrigger {
  type: TriggerType;
  value: string;
  conditions?: Record<string, any>;
}

export interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  auth?: {
    type: "bearer" | "basic" | "api_key";
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
}

export interface WebhookConfig {
  url: string;
  method: "POST" | "PUT";
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

export interface ActionStep {
  id: string;
  type: "message" | "api_call" | "webhook" | "condition" | "delay" | "escalate" | "log";
  config: Record<string, any>;
  apiRequest?: ApiRequest;
  webhookConfig?: WebhookConfig;
  nextStep?: string;
}

export interface BaseAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  type: ActionType;
  status: ActionStatus;
  triggers: ActionTrigger[];
  steps: ActionStep[];
  isBuiltIn: boolean;
  created_at: string;
  updated_at: string;
}

// Core Inbuilt Actions
export interface CoreAction extends BaseAction {
  category: "core";
}

// Integration Provider
export interface IntegrationProvider {
  id: string;
  name: string;
  type: "email" | "crm" | "calendar" | "payment" | "storage" | "communication";
  icon: string;
  authType: "oauth" | "api_key" | "basic";
  configFields: {
    name: string;
    type: "text" | "password" | "select" | "url";
    required: boolean;
    options?: string[];
  }[];
}

// System-Defined Actions
export interface SystemAction extends BaseAction {
  category: "system";
  configurable: boolean;
  defaultConfig: Record<string, any>;
  requiredIntegrations: IntegrationProvider[];
  supportedProviders: IntegrationProvider[];
}

// User-Defined Custom Actions
export interface CustomAction extends BaseAction {
  category: "custom";
  agentId: string;
  workflowConfig?: {
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  };
}

// Workflow Builder Types (n8n-style)
export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "api" | "webhook";
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
  };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Integration Types (keeping existing for backward compatibility)
export interface IntegrationStatus {
  id: string;
  name: string;
  platform: "slack" | "whatsapp" | "messenger" | "instagram" | "telegram";
  status: "connected" | "disconnected" | "error";
  enabled: boolean;
  config?: Record<string, any>;
  last_sync?: string;
}

export interface EmbedSettings {
  isPublic: boolean;
  embedCode: string;
  allowedDomains: string[];
  customization: {
    theme: "light" | "dark" | "auto";
    position: "bottom-right" | "bottom-left";
    showBranding: boolean;
  };
}

export interface ShareSettings {
  isPublic: boolean;
  shareUrl: string;
  accessCode?: string;
  expiresAt?: string;
}

// API Function Interface
export interface ApiFunction {
  id: string;
  agentId: string;
  name: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  requestBody?: string;
  authType: "none" | "bearer" | "basic" | "api_key" | "oauth";
  bearerToken?: string;
  basicUsername?: string;
  basicPassword?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  responseMapping?: Record<string, string>;
  errorHandling?: {
    retries: number;
    timeout: number;
    fallbackMessage?: string;
  };
  created_at: string;
  updated_at: string;
}

// Main Actions Interface
export interface AgentActions {
  coreActions: CoreAction[];
  systemActions: SystemAction[];
  customActions: CustomAction[];
  apiFunctions: ApiFunction[];
  integrations: IntegrationStatus[];
  integrationProviders: IntegrationProvider[];
  embedSettings: EmbedSettings;
  shareSettings: ShareSettings;
}

export interface UpdateActionsRequest {
  coreActions?: Partial<CoreAction>[];
  systemActions?: Partial<SystemAction>[];
  customActions?: Partial<CustomAction>[];
  integrations?: Partial<IntegrationStatus>[];
  embedSettings?: Partial<EmbedSettings>;
  shareSettings?: Partial<ShareSettings>;
}