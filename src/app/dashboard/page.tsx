"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { agentsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/store/agentStore";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { AgentShowcase } from "@/components/dashboard/AgentShowcase";
import { MOCK_AGENTS } from "@/constants";
import { useToast } from "@/hooks/useToast";

enum ActiveTabs {
  AGENTS = "agents",
  USAGE = "usage",
  SETTINGS = "settings",
}

export default function Dashboard() {
  const router = useRouter();
  const user = useCurrentUser();
  const { clearAuth, token } = useAuthStore();
  const { agents, setAgents, deleteAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState(ActiveTabs.AGENTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getChatbot = async () => {
      if (!user) {
        clearAuth();
        return;
      }
      const { agents } = await agentsAPI.getAll(user.id!, token!);

      if (agents) setAgents(agents);
    };

    getChatbot();
  }, [user, clearAuth, setAgents]);

  // Sidebar animation
  useGSAP(
    () => {
      if (sidebarRef.current) {
        if (showSidebar) {
          gsap.fromTo(
            sidebarRef.current,
            { x: "100%" },
            { x: "0%", duration: 0.3, ease: "power2.out" }
          );
        }
      }
    },
    { dependencies: [showSidebar] }
  );

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

  const handleUseTemplate = () => {
    setShowSidebar(true); // Open sidebar
  };

  const handleHireTemplate = (templateId: string) => {
    console.log("Hiring template:", templateId);
    // Stub function for template hiring
  };

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 py-2">
        <nav
          className="-mb-px flex justify-center space-x-10 items-center"
          aria-label="tabs"
        >
          {Object.values(ActiveTabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                activeTab === tab
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm capitalize"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === ActiveTabs.AGENTS && (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                AI Agents
              </h1>
              <div className="flex items-center gap-1 mt-2">
                <p className=" font-medium text-[12px]">Active</p>
                <div className=" h-2 w-2 bg-green-500 rounded-full "></div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <p className=" font-medium text-[12px]">Draft</p>
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                size="md"
                variant="primary"
                className="text-sm shadow-md"
                onClick={() => router.push("/dashboard/create")}
              >
                🎨 Create new agent
              </Button>
              <Button
                size="md"
                variant="ghost"
                className="text-sm shadow-md border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
                onClick={handleUseTemplate}
                disabled={isLoading}
              >
                ⚡ Use our Agent
              </Button>
            </div>
          </div>

          {/* Agent Display */}
          {agents && agents.length > 0 ? (
            <div className="mt-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((chatagent) => (
                  <AgentCard
                    key={chatagent.id}
                    agent={chatagent}
                    onDelete={handleDeleteAgent}
                    onManage={() =>
                      router.push(`/dashboard/playground/${chatagent.id}`)
                    }
                  />
                ))}
              </ul>
            </div>
          ) : (
            <AgentShowcase onHire={handleHireTemplate} />
          )}
        </div>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
          <div
            ref={sidebarRef}
            className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold">Choose an Agent</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {MOCK_AGENTS.map((mockAgent) => (
                  <AgentCard
                    key={mockAgent.id}
                    agent={mockAgent}
                    onDelete={() => {}}
                    onHire={() => {
                      handleHireTemplate(mockAgent.id);
                      setShowSidebar(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
