"use client";

import { cn } from "@/lib/utils";
import { Cpu, Bot, DollarSign, MessageSquare } from "lucide-react";

interface SuperAdminNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "ai-models", name: "AI Models", icon: Cpu },
  { id: "templates", name: "Templates", icon: Bot },
  { id: "settings", name: "Settings", icon: DollarSign },
  { id: "feedback", name: "Feedback", icon: MessageSquare },
];

export function SuperAdminNav({ activeTab, setActiveTab }: SuperAdminNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 px-6 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary-50 text-primary-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
