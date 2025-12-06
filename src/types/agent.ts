import { z } from "zod";

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description: string;
  agent_type: AgentType | number;
  ai_model_id: string;
  status: AgentStatus;
  created_at: string;
  updated_at: string;
  template?: string;
  workspace_id?: string;
}

export interface AgentAppearance {
  id: number;
  agent_id: string;
  primary_color: string;
  font_family: string;
  chat_icon: string;
  welcome_message: string;
  position: AgentPosition;
  icon_size: AgentIconSize;
  bubble_style: AgentBubbleStyle;
  created_at: string;
  updated_at: string;
}

export interface AgentBehavior {
  id: number;
  agent_id: string;
  initial_messages: string;
  fallback_message: string;
  enable_human_handoff: boolean;
  offline_message: string;
  system_instruction: string;
  prompt_template: string;
  system_instruction_id?: string;
  prompt_template_id?: string;
  temperature: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
}

export interface SystemPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  constraints: string[];
}

export interface AgentIntegration {
  id: number;
  agent_id: string;
  platform: Platform;
  api_key: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentChannel {
  id: number;
  agent_id: string;
  channel_id: string[];
  created_at: string;
  updated_at: string;
}

export interface AgentStats {
  id: number;
  agent_id: string;
  total_messages: number;
  unique_users: number;
  average_rating: number;
  response_rate: number;
  conversions_count: number;
  last_calculated_at: string;
}

export interface TrainingData {
  id: number;
  agent_id: string;
  content_type:
  | "faq"
  | "knowledge_base"
  | "procedure"
  | "external_link"
  | "website_content";
  category: string;
  title: string;
  content: string;
  intent: string;
  keywords: string;
  confidence_score: number;
  source_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentBehaviorParsed
  extends Omit<AgentBehavior, "initial_messages"> {
  initial_messages: string[];
}

export interface TrainingDataWithKeywords
  extends Omit<TrainingData, "keywords"> {
  keywords: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Creation request types for related resources (omit server-managed fields)
export type CreateAgentAppearanceRequest = Omit<AgentAppearance, "id">;
export type CreateAgentBehaviorRequest = Omit<AgentBehavior, "id"> & {
  // allow initial_messages as string[] during creation for convenience
  initial_messages?: string[] | string;
};
export type CreateAgentStatsRequest = Omit<
  AgentStats,
  "id" | "last_calculated_at"
> & {
  last_calculated_at?: string;
};

export interface CreateTrainingDataRequest {
  agent_id: string;
  content_type: TrainingData["content_type"];
  category: string;
  title: string;
  content: string;
  intent: string;
  keywords: string;
  confidence_score?: number;
  source_url?: string;
}

export type AgentWithRelations = Agent & {
  appearance?: AgentAppearance;
  behavior?: AgentBehavior;
  integrations?: AgentIntegration[];
  stats?: AgentStats;
  training_data?: TrainingData[];
};

export interface ChatHistoryItem {
  role: MessageRoles;
  parts: string;
}

export interface PlaygroundConfig {
  ai_model_id: string;
  ai_model_name: string;
  temperature: number;
  maxTokens: number;
  systemInstruction: string;
  selectedTemplate: string;
}

export interface TestQuery {
  id: string;
  agent_id: string;
  prompt_template: string;
  queries: string[];
}

export enum AgentType {
  TEXT = "text",
  VOICE = "voice",
  VISION = "vision",
}

export enum AgentPosition {
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
}

export enum AgentIconSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum AgentBubbleStyle {
  ROUND = "round",
  SQUARE = "square",
}

export enum AgentStatus {
  ACTIVE = "active",
  DRAFT = "draft",
  INACTIVE = "inactive",
}

export enum ContentType {
  FAQ = "faq",
  KNOWLEDGE_BASE = "knowledge_base",
  PROCEDURE = "procedure",
  EXTERNAL_LINK = "external_link",
  WEBSITE_CONTENT = "website_content",
}

export enum Platform {
  WEBSITE = "website",
  WHATSAPP = "whatsapp",
  SHOPIFY = "shopify",
  TELEGRAM = "telegram",
  SLACK = "slack",
}

export enum MessageRoles {
  USER = "user",
  ASSISTANT = "assistant",
  MODEL = "model",
}

export type messageRole = keyof MessageRoles[keyof MessageRoles];

const statusEnum = [
  AgentStatus.ACTIVE,
  AgentStatus.DRAFT,
  AgentStatus.INACTIVE,
] as const;

export const AgentTypeEnum = {
  MULTIMODAL: 0,
  TEXT: 1,
  VOICE: 2,
} as const;

export const CreateAgentRequestSchema = z.object({
  name: z.string().min(1, "Agent's name is required"),
  description: z.string().min(1, "describe your agent"),
  agent_type: z.nativeEnum(AgentType),
  ai_model_id: z.string().min(1, "AI model is required"),
  status: z.enum(statusEnum),
  workspace_id: z.string().optional(),
  template_id: z.string().optional(),
});

export const CreateAgentAPIRequestSchema = CreateAgentRequestSchema.extend({
  userId: z.string(),
  agent_type: z.union([z.nativeEnum(AgentType), z.number()]),
});

export const UpdateAgentRequestSchema = CreateAgentRequestSchema.extend({
  id: z.string().min(1, "Agent ID is required"),
  agent_type: z.union([z.nativeEnum(AgentType), z.number()]),
})
  .partial({
    name: true,
    description: true,
    agent_type: true,
    ai_model_id: true,
    status: true,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided for update",
  });

export type CreateAgentRequest = z.infer<typeof CreateAgentRequestSchema>;
export type CreateAgentAPIRequest = z.infer<typeof CreateAgentAPIRequestSchema>;
export type UpdateAgentRequest = z.infer<typeof UpdateAgentRequestSchema>;
