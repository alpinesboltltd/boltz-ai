"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { agentsAPI } from "@/lib/api";
import { agentApi } from "@/lib/agent-api";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/store/agentStore";
import { useCurrentUser } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import TemplateSelectionModal from "@/components/ui/TemplateSelectionModal";
import {
  AgentStatus,
  AgentPosition,
  AgentIconSize,
  AgentBubbleStyle,
} from "@/types/agent";

enum ActiveTabs {
  AGENTS = "agents",
  USAGE = "usage",
  SETTINGS = "settings",
}

export default function Dashboard() {
  const router = useRouter();
  const user = useCurrentUser();
  const { agents, setAgents, deleteAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState(ActiveTabs.AGENTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  // Refs for the two buttons
  const button1Ref = useRef<HTMLDivElement>(null);
  const button2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getChatbot = async () => {
      const { data } = await agentsAPI.getAll(user?.id);
      console.log(data);
      console.log(user?.id);
      if (data) setAgents(data);
    };

    getChatbot();
  }, []);

  // Function to create agent from selected template
  const handleTemplateSelect = async (template: any) => {
    if (!user?.id) {
      alert("Please log in to create an agent");
      return;
    }

    setIsLoading(true);
    try {
      const newAgentId = agentApi.generateId();
      const timestamp = new Date().toISOString();

      // Create agent with template configuration
      const agentPayload = {
        id: newAgentId,
        user_id: user.id,
        name: template.name,
        description: template.description,
        agent_type: template.config.agent_type,
        ai_model: template.config.ai_model,
        ai_provider: template.config.ai_provider,
        credits_per_1k: template.config.credits_per_1k,
        status: AgentStatus.ACTIVE,
        created_at: timestamp,
        updated_at: timestamp,
      };

      await agentApi.createAgent(agentPayload);

      // Create appearance settings
      await agentApi.createAppearance({
        agent_id: newAgentId,
        welcome_message: template.config.welcome_message,
        primary_color: template.config.primary_color,
        position: AgentPosition.BOTTOM_RIGHT,
        icon_size: AgentIconSize.MEDIUM,
        bubble_style: AgentBubbleStyle.ROUND,
        chat_icon: "default",
        font_family: "Inter",
        created_at: timestamp,
        updated_at: timestamp,
      });

      // Create behavior settings
      await agentApi.createBehavior({
        agent_id: newAgentId,
        initial_messages: JSON.stringify([template.config.welcome_message]),
        fallback_message: template.config.fallback_message,
        enable_human_handoff: false,
        offline_message:
          "Our team is currently offline. Please leave a message and we'll get back to you.",
        system_instruction: template.config.system_instruction,
        prompt_template: "{{conversation}}",
        temperature: template.config.temperature,
        max_tokens: template.config.max_tokens,
        created_at: timestamp,
        updated_at: timestamp,
      });

      // Create stats
      await agentApi.createStats({
        agent_id: newAgentId,
        total_messages: 0,
        unique_users: 0,
        average_rating: 0,
        response_rate: 0,
        conversions_count: 0,
        last_calculated_at: timestamp,
      });

      // Close modal
      setShowTemplateModal(false);
      setIsOpen(false);

      // Refresh agents list
      const { data } = await agentsAPI.getAll(user.id);
      if (data) setAgents(data);

      // Route to the newly created agent
      router.push(`/dashboard/chatagent/${newAgentId}`);
    } catch (error) {
      console.error("Error creating agent from template:", error);
      alert("Failed to create agent from template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize buttons to hidden state
  useGSAP(
    () => {
      if (button1Ref.current && button2Ref.current) {
        gsap.set([button1Ref.current, button2Ref.current], {
          opacity: 0,
          scale: 0,
          y: -20,
        });
      }
    },
    { scope: containerRef }
  );

  // Animation for dropdown toggle
  useGSAP(
    () => {
      if (button1Ref.current && button2Ref.current) {
        const tl = gsap.timeline();

        if (isOpen) {
          // Opening animation
          tl.to([button1Ref.current, button2Ref.current], {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(1.7)",
          });
        } else {
          // Closing animation
          tl.to([button2Ref.current, button1Ref.current], {
            opacity: 0,
            scale: 0,
            y: -20,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.in(1.7)",
          });
        }
      }
    },
    { dependencies: [isOpen], scope: containerRef }
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
      await agentApi.deleteAgent(agentId);
      deleteAgent(agentId);
    } catch (e) {
      console.error("Deletion failed:", e);
      alert(`Unable to delete ${agentName}. Please check console for details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUseTemplate = () => {
    setIsOpen(false); // Close dropdown
    setShowTemplateModal(true); // Open template modal
  };

  return (
    <>
      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
        isLoading={isLoading}
      />

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
            <div
              ref={containerRef}
              className="relative mr-20 flex flex-col justify-center items-center"
            >
              <button
                onClick={handleDropdown}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "New Agents"}
              </button>

              <div className="absolute flex gap-2 mt-24 z-10">
                <div ref={button1Ref}>
                  <Button
                    size="md"
                    variant="primary"
                    className="w-fit text-nowrap text-sm shadow-md"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard/create");
                    }}
                  >
                    Create new agent
                  </Button>
                </div>
                <div ref={button2Ref}>
                  <Button
                    size="md"
                    variant="primary"
                    className="w-fit text-nowrap text-sm shadow-md"
                    onClick={handleUseTemplate}
                    disabled={isLoading}
                  >
                    Use our template
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modern Agent Cards List */}
          <div className="mt-8">
            {agents && agents.length ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((chatagent) => (
                  <li key={chatagent.id} className="group">
                    <Link
                      href={`/dashboard/chatagent/${chatagent.id}`}
                      className="block"
                    >
                      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Status Badge - Top Right */}
                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                              chatagent.status === "active"
                                ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                                : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                chatagent.status === "active"
                                  ? "bg-green-600 animate-pulse"
                                  : "bg-yellow-600"
                              )}
                            />
                            {chatagent.status === "active" ? "Active" : "Draft"}
                          </span>
                        </div>

                        {/* Delete Button - Top Left (appears on hover) */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteAgent(chatagent.id, chatagent.name);
                          }}
                          className="absolute top-3 left-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:scale-110"
                          title="Delete agent"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>

                        {/* Icon Section */}
                        <div className="flex items-center justify-center h-44 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                          <div className="p-5 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all group-hover:scale-110">
                            <MessageSquare className="w-14 h-14 text-indigo-600" strokeWidth={1.5} />
                          </div>
                        </div>

                        {/* Name Section */}
                        <div className="p-4 bg-white border-t border-gray-100">
                          <h3 className="text-base font-semibold text-gray-900 truncate text-center mb-1">
                            {chatagent.name}
                          </h3>
                          <p className="text-xs text-gray-500 text-center">
                            Click to configure
                          </p>
                        </div>

                        {/* Hover Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              // Modern Empty State
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No agents yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Create your first autonomous agent to start engaging with your users
                </p>
                <button
                  onClick={handleDropdown}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Create Your First Agent
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}