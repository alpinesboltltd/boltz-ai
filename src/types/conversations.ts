import { MessageRoles, Platform } from "./chatbot";

export interface ChatMessage {
  id: number;
  convo_id: string;
  role: MessageRoles;
  text: string;
  timestamp: string;
  confidence_score?: number;
}

export interface Conversation {
  id: string;
  agent_id: string;
  platform: Platform;
  client_id: string | null;
  title: string;
  created_at: string;
}
