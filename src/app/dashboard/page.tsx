"use client";
import { useEffect, useState } from "react";
import { agentsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/store/agentStore";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { AgentShowcase } from "@/components/dashboard/AgentShowcase";
import { useToast } from "@/hooks/useToast";
import { Plus, Sparkles, Bot, Zap } from "lucide-react";
import { Tab } from "@headlessui/react";

enum ActiveTabs {
  AGENTS = "Agents",
  USAGE = "Usage",
  SETTINGS = "Settings",
}

export default function Dashboard() {
  const router = useRouter();
  const user = useCurrentUser();
  const { clearAuth, token } = useAuthStore();
  const { agents, setAgents, deleteAgent } = useAgentStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const getChatbot = async () => {
      if (!user) {
        clearAuth();
        return;
      }
      try {
        const { agents } = await agentsAPI.getAll(user.id!, token!);
        if (agents) setAgents(agents);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    getChatbot();
  }, [user, clearAuth, setAgents, token]);

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the agent "${agentName}"?`
      )
    ) {
      return;
    }
    setIsLoading(true);
    try {
      await agentsAPI.delete(agentId, token!);
      deleteAgent(agentId);
      toast.success("Agent Deleted", `${agentName} has been removed.`);
    } catch (e) {
      console.error("Deletion failed:", e);
      toast.error(
        "Deletion Failed",
        `Unable to delete ${agentName}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireTemplate = (templateId: string) => {
    console.log("Hiring template:", templateId);
    // Stub function for template hiring
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your AI agents and monitor their performance.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/create")}
            className="btn btn-primary shadow-lg shadow-primary-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Agent
          </button>
        </div>
      </div>

      {/* Stats Overview (Placeholder for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-linear-to-br from-primary-500 to-primary-600 text-white border-none">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-primary-100 font-medium">Total Agents</p>
              <h3 className="text-2xl font-bold">{agents?.length || 0}</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Interactions</p>
              <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Active Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900">42</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 max-w-md">
          {Object.values(ActiveTabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-100 ring-white/60",
                  selected
                    ? "bg-white text-primary-700 shadow"
                    : "text-gray-600 hover:bg-white/12 hover:text-gray-800"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel className="outline-none">
            {agents && agents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((chatagent) => (
                  <AgentCard
                    key={chatagent.id}
                    agent={chatagent}
                    onDelete={handleDeleteAgent}
                    onManage={() =>
                      router.push(`/dashboard/agent/${chatagent.id}`)
                    }
                  />
                ))}

                {/* Add New Agent Card */}
                <button
                  onClick={() => router.push("/dashboard/create")}
                  className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create New Agent</h3>
                    <p className="text-sm text-gray-500 mt-1">Start from scratch or use a template</p>
                  </div>
                </button>
              </div>
            ) : (
              <AgentShowcase onHire={handleHireTemplate} />
            )}
          </Tab.Panel>
          <Tab.Panel>
            <div className="card flex items-center justify-center min-h-[400px] text-gray-500">
              Usage analytics coming soon...
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="card flex items-center justify-center min-h-[400px] text-gray-500">
              Global settings coming soon...
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
