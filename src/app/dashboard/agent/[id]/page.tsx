"use client";

import { useState, useRef, useEffect } from "react";
import { use } from "react";
import { Sources } from "@/components/dashboard/Sources";
import { Activity } from "@/components/dashboard/Activity";
import { ConversationLogs } from "@/components/dashboard/ConversationLogs";
import { useDashboardStore, DetailsTab } from "@/store/dashboardStore";
import { AgentPlayground } from "@/components/chatbot/AgentPlayground";
import { BotCustomizer } from "@/components/chatbot/BotCustomizer";
import { AgentBehavior } from "@/components/chatbot/AgentBehavior";
import { useAgentDetailStore } from "@/store/agentDetailStore";
import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  Palette,
  Activity as ActivityIcon,
  CheckCircle2,
  AlertCircle,
  Puzzle,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Integrations } from "@/components/dashboard/Integrations";

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const agentId = resolvedParams.id;

  const { activeTab, setActiveTab } = useDashboardStore();
  const { fetchAgentDetails, loading, error } = useAgentDetailStore();
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const tabNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agentId) {
      fetchAgentDetails(agentId);
    }
  }, [agentId, fetchAgentDetails]);

  const handleSaveConfig = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const tabs = [
    { id: DetailsTab.PLAYGROUND, label: "Playground", icon: LayoutDashboard },
    { id: DetailsTab.ACTIVITY, label: "Activity", icon: ActivityIcon },
    {
      id: DetailsTab.CONVERSATIONS,
      label: "Conversations",
      icon: MessageSquare,
    },
    { id: DetailsTab.SOURCES, label: "Knowledge Base", icon: Database },
    { id: DetailsTab.AGENT_BEHAVIOR, label: "Behavior", icon: Brain },
    { id: DetailsTab.INTEGRATIONS, label: "Integrations", icon: Puzzle },
    { id: DetailsTab.APPEARANCE, label: "Appearance", icon: Palette },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Loading agent details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load agent
          </h3>
          <p className="text-sm text-red-600 mb-6">{error}</p>
          <button
            onClick={() => fetchAgentDetails(agentId)}
            className="btn btn-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-fade-in">
      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 pt-4 mb-6">
        <nav
          ref={tabNavRef}
          className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide"
          aria-label="Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailsTab)}
                className={cn(
                  "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon
                  className={cn(
                    "mr-2 h-5 w-5 transition-colors",
                    isActive
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>
        {showSavedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg flex items-center gap-3"
          >
            <div className="shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-green-800">
              Changes saved successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === DetailsTab.PLAYGROUND && <AgentPlayground />}
            {activeTab === DetailsTab.ACTIVITY && <Activity />}
            {activeTab === DetailsTab.CONVERSATIONS && <ConversationLogs />}
            {activeTab === DetailsTab.SOURCES && <Sources agentId={agentId} />}
            {activeTab === DetailsTab.AGENT_BEHAVIOR && <AgentBehavior />}
            {activeTab === DetailsTab.APPEARANCE && (
              <BotCustomizer onSave={handleSaveConfig} />
            )}
            {activeTab === DetailsTab.INTEGRATIONS && (
              <Integrations agentId={agentId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
