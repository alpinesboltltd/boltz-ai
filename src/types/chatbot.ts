import { z } from "zod";

export interface Chatbot {
  id: string;
  userId: string;
  name: string;
  description: string;
  ai_model: string;
  status: ChatbotStatus;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

export interface ChatbotAppearance {
  id: number;
  chatagent_id: string;
  primary_color: string; // Hex color code
  font_family: string;
  chat_icon: string;
  welcome_message: string;
  position: ChatbotPosition;
  icon_size: ChatbotIconSize;
  bubble_style: ChatbotBubbleStyle;
  created_at: string;
  updated_at: string;
}

export interface ChatbotBehavior {
  id: number;
  chatagent_id: string;
  initial_messages: string; // JSON string array
  fallback_message: string;
  enable_human_handoff: boolean;
  offline_message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotIntegration {
  id: number;
  chatagent_id: string;
  platform: Platform;
  api_key: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatbotStats {
  id: number;
  chatagent_id: string;
  total_messages: number;
  unique_users: number;
  average_rating: number;
  response_rate: number;
  conversions_count: number;
  last_calculated_at: string;
}

export interface TrainingData {
  id: number;
  chatagent_id: string;
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
  keywords: string; // Comma-separated keywords
  confidence_score: number;
  source_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Parsed types for better type safety
export interface ChatbotBehaviorParsed
  extends Omit<ChatbotBehavior, "initial_messages"> {
  initial_messages: string[]; // Parsed JSON array
}

export interface TrainingDataWithKeywords
  extends Omit<TrainingData, "keywords"> {
  keywords: string[]; // Parsed keywords array
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

// Request/Update types
export interface CreateChatbotRequest {
  name: string;
  description: string;
  ai_model: string;
  status?: ChatbotStatus;
}

export interface UpdateChatbotRequest extends Partial<CreateChatbotRequest> {
  id: number;
}
export interface CreateTrainingDataRequest {
  chatagent_id: string;
  content_type: TrainingData["content_type"];
  category: string;
  title: string;
  content: string;
  intent: string;
  keywords: string;
  confidence_score?: number;
  source_url?: string;
}

// Utility types
export type ChatbotWithRelations = Chatbot & {
  appearance?: ChatbotAppearance;
  behavior?: ChatbotBehavior;
  integrations?: ChatbotIntegration[];
  stats?: ChatbotStats;
  training_data?: TrainingData[];
};

// Enums for better type safety
export enum ChatbotPosition {
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_LEFT = "bottom-left",
}

export enum ChatbotIconSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum ChatbotBubbleStyle {
  ROUNDED = "rounded",
  SQUARE = "square",
}

export enum ChatbotStatus {
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
  ChatbotStatus.ACTIVE,
  ChatbotStatus.DRAFT,
  ChatbotStatus.INACTIVE,
] as const;

export const ChatbotSchema = z.object({
  name: z.string().min(1, "Agent's name is required"),
  description: z.string().min(1, "describe your agent"),
  ai_model: z.string(),
  status: z.enum(statusEnum).default(ChatbotStatus.DRAFT),
});

export type ChatbotSchemaInput = z.infer<typeof ChatbotSchema>;
