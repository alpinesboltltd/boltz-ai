"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import ChatbotPage from "@/app/chatbot/[id]/page";
import Sources from "@/components/dashboard/Sources";
import Activity from "@/components/dashboard/Activity";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Actions from "@/components/dashboard/Actions";
import { useParams, useRouter } from "next/navigation";
import { BotCustomizer } from "@/components/chatbot";
import { ChatbotData, useAgentStore } from "@/store/agentStore";
import { Chatbot, ChatbotAppearance } from "@/types/chatbot";
import { chatbotsAPI } from "@/lib/api";

enum DetailsTab {
  PLAYGROUND = "playground",
  ACTIVITY = "activity",
  SOURCES = "sources",
  ACTION = "action",
  APPEARANCE = "appearance",
}

export default function ChatbotDetailPage() {
  const router = useRouter();
  const chatbotId = useParams().id as string;
  const { getChatbot } = useAgentStore();
  const [activeTab, setActiveTab] = useState(DetailsTab.PLAYGROUND);
  const [chatbotData, setChatbotData] = useState<ChatbotData>();
  const [appearance, setAppearance] = useState<ChatbotAppearance>();
  const [chatbot, setChatbot] = useState<Chatbot>();

  useEffect(() => {
    const getBotData = async () => {
      const { chatbot } = getChatbot(chatbotId);
      if (chatbot) {
        const { data } = await chatbotsAPI.getById(chatbot.id);
        if (data) {
          setChatbot(chatbot);
          setChatbotData(data);
        }
      }
    };

    getBotData();
  }, [chatbotId]);

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // FIXME: SAVE CONFIG
  const handleSaveConfig = (config: any) => {
    setAppearance(config);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* <div
        onClick={() => router.back()}
        className="flex w-fit items-center text-sm font-medium border border-primary-500 bg-primary-500/20 rounded-full p-2 text-primary-600 hover:text-primary-500"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </div> */}
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {Object.values(DetailsTab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      {/* // FIXME: Abtract into its own components */}
      {showSavedMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Customization saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="mt-3">
        {activeTab === DetailsTab.PLAYGROUND && <ChatbotPage />}

        {activeTab === DetailsTab.ACTIVITY && (
          <Activity chatbotId={chatbotId} />
        )}

        {activeTab === DetailsTab.SOURCES && <Sources />}

        {activeTab === DetailsTab.ACTION && <Actions />}

        {activeTab === DetailsTab.APPEARANCE && chatbotData && (
          <BotCustomizer
            data={chatbotData}
            name={chatbot!.name}
            onSave={handleSaveConfig}
          />
        )}
      </div>
    </div>
  );
}
