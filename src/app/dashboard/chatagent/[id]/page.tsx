"use client";

import { useState, useRef, useEffect } from "react";
import { Sources } from "@/components/dashboard/Sources";
import { Activity } from "@/components/dashboard/Activity";
import { ConversationLogs } from "@/components/dashboard/ConversationLogs";
// import { Actions } from "@/components/dashboard/Actions";
import { useDashboardStore, DetailsTab } from "@/store/dashboardStore";
import { AgentPlayground } from "@/components/chatbot/AgentPlayground";
import { BotCustomizer } from "@/components/chatbot/BotCustomizer";

export default function AgentDetailPage() {
  const { activeTab, setActiveTab } = useDashboardStore();
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  const handleSaveConfig = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Auto-center active tab
  useEffect(() => {
    if (tabNavRef.current) {
      const activeButton = tabNavRef.current.querySelector(
        `button:nth-child(${Object.values(DetailsTab).indexOf(activeTab) + 1})`
      ) as HTMLElement;

      if (activeButton) {
        const nav = tabNavRef.current;
        const buttonRect = activeButton.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        const scrollLeft =
          activeButton.offsetLeft - navRect.width / 2 + buttonRect.width / 2;

        nav.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav
          ref={tabNavRef}
          className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide"
          aria-label="Tabs"
        >
          {Object.values(DetailsTab).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as DetailsTab)}
              className={`${
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize flex-shrink-0`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      {/* // FIXME: Abstract into its own components */}
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
        {activeTab === DetailsTab.PLAYGROUND && <AgentPlayground />}
        {activeTab === DetailsTab.ACTIVITY && <Activity />}
        {activeTab === DetailsTab.CONVERSATIONS && <ConversationLogs />}
        {activeTab === DetailsTab.SOURCES && <Sources />}
        {/* NOTE: This is a future feature. Do not uncomment */}
        {/* {activeTab === DetailsTab.ACTION && <Actions />} */}
        {activeTab === DetailsTab.APPEARANCE && (
          <BotCustomizer onSave={handleSaveConfig} />
        )}
      </div>
    </div>
  );
}
