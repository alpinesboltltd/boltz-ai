"use client";

import { useState } from "react";
import { Sources } from "@/components/dashboard/Sources";
import { Activity } from "@/components/dashboard/Activity";
import { ConversationLogs } from "@/components/dashboard/ConversationLogs";
import { Actions } from "@/components/dashboard/Actions";
import { BotCustomizer, BotPlayground } from "@/components/chatbot";
import { useDashboardStore, DetailsTab } from "@/store/dashboardStore";

export default function AgentDetailPage() {
  const { activeTab, setActiveTab } = useDashboardStore();
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSaveConfig = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {Object.values(DetailsTab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as DetailsTab)}
              className={`${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
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
        {activeTab === DetailsTab.PLAYGROUND && <BotPlayground />}
        {activeTab === DetailsTab.ACTIVITY && <Activity agentId="demo-agent" />}
        {activeTab === DetailsTab.CONVERSATIONS && <ConversationLogs chatbotId="demo-agent" />}
        {activeTab === DetailsTab.SOURCES && <Sources />}
        {activeTab === DetailsTab.ACTION && <Actions />}
        {activeTab === DetailsTab.APPEARANCE && (
          <BotCustomizer onSave={handleSaveConfig} />
        )}
      </div>
    </div>
  );
}
