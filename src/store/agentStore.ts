import {
  Chatbot,
  ChatbotAppearance,
  ChatbotBehavior,
  ChatbotIntegration,
  ChatbotStats,
  TrainingData,
} from "@/types/chatbot";
import { MenuItem } from "@headlessui/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatbotData {
  appearance: ChatbotAppearance;
  behavior: ChatbotBehavior;
  integrations: ChatbotIntegration;
  stats: ChatbotStats;
  training_data: TrainingData;
}
interface AgentState {
  chatbots: Chatbot[];
  chatbotData: ChatbotData[];
  setChatBots: (Chatbot: Chatbot[]) => void;
  getChatbot: (id: string) => {
    chatbot: Chatbot | undefined;
    data:
      | {
          appearance: ChatbotAppearance;
          behavior: ChatbotBehavior;
          integrations: ChatbotIntegration;
          stats: ChatbotStats;
          training_data: TrainingData;
        }
      | undefined;
  };
  // TODO: filter and search
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      chatbots: [],
      chatbotData: [],
      setChatBots: (chatbots) => {
        set({ chatbots });
      },
      getChatbot: (id) => {
        const { chatbots, chatbotData } = get();
        const bot = chatbots.find((b) => b.id === id);
        if (!bot) {
          return { chatbot: undefined, data: undefined };
        }
        const data = chatbotData.find(
          (item) => item.appearance.chatbot_id === bot.id
        );
        return { chatbot: bot, data };
      },
    }),
    {
      name: "chatboltz-agent-storage",
      partialize: (state) => ({
        chatbots: state.chatbots,
        chatbotData: state.chatbotData,
      }),
    }
  )
);
