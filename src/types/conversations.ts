import { MessageRoles, Platform } from "./agent";

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
  status: "open" | "closed";
  escalated_to_human: boolean;
  escalation_reason: string | null;
  created_at: string;
}
