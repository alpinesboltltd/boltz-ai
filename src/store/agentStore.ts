import { integrations } from "@/mock-data/integrations";
import {
  Chatbot,
  ChatbotAppearance,
  ChatbotBehavior,
  ChatbotIntegration,
  ChatbotStats,
  TrainingData,
} from "@/types/chatbot";

interface Agents {
  chatbots: Chatbot[] | null;
  chatbotData: {
    appearance: ChatbotAppearance;
    behavior: ChatbotBehavior;
    integrations: ChatbotIntegration;
    stats: ChatbotStats;
    training_data: TrainingData;
  };

  setChatBots: (Chatbot: Chatbot) => void;
}
