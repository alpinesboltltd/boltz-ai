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
import {
  AgentStatus,
  AgentType,
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

  // Function to create a complete agent from template
  const handleCreateFromTemplate = async () => {
    if (!user?.id) {
      alert("Please log in to create an agent");
      return;
    }

    setIsLoading(true);
    try {
      const newAgentId = agentApi.generateId();
      const timestamp = new Date().toISOString();

      const agentPayload = {
        id: newAgentId,
        user_id: user.id,
        name: "Boltz Agent",
        description: "A ready-to-use customer support agent with pre-configured settings",
        agent_type: AgentType.TEXT,
        ai_model: "gpt-3.5-turbo",
        ai_provider: "OpenAI",
        credits_per_1k: 10,
        status: AgentStatus.ACTIVE,
        created_at: timestamp,
        updated_at: timestamp,
      };

      await agentApi.createAgent(agentPayload);

       //Create appearance settings
      await agentApi.createAppearance({
        agent_id: newAgentId,
        welcome_message: "Hi! I'm Boltz, your AI assistant. How can I help you today?",
        primary_color: "#6366f1",
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
        initial_messages: JSON.stringify([
          "Hi! I'm your AI assistant. How can I help you today?",
        ]),
        fallback_message:
          "I'm sorry, I don't understand that question. Could you rephrase it?",
        enable_human_handoff: false,
        offline_message:
          "Our team is currently offline. Please leave a message and we'll get back to you.",
        system_instruction:
          "You are a helpful AI assistant focused on providing excellent customer support. Be friendly, professional, and helpful.",
        prompt_template: "{{conversation}}",
        temperature: 0.7,
        max_tokens: 500,
        created_at: timestamp,
        updated_at: timestamp,
      });

      // Step 4: Create stats
      await agentApi.createStats({
        agent_id: newAgentId,
        total_messages: 0,
        unique_users: 0,
        average_rating: 0,
        response_rate: 0,
        conversions_count: 0,
        last_calculated_at: timestamp,
      });

      // Close dropdown
      setIsOpen(false);
      //const { data } = await agentsAPI.getAll(user.id);
      //if (data) setAgents(data);
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
                    onClick={handleCreateFromTemplate}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Use our template"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Chatbots List */}
          <div className="mt-8">
            {agents && agents.length ? (
              <ul className="flex gap-x-6 flex-wrap">
                {agents.map((chatagent) => (
                  <li key={chatagent.id}>
                    <Link
                      href={`/dashboard/chatagent/${chatagent.id}`}
                      className="block hover:bg-gray-50 w-40"
                    >
                      <div className="h-52 border-gray-400 border rounded-lg flex flex-col hover:shadow-lg transition-all duration-300">
                        <div className="flex-grow flex items-center justify-center bg-gray-200">
                          <MessageSquare width={88} height={88} />
                        </div>
                        <div
                          className={`p-3 flex-col flex-shrink-0 flex items-center justify-center
                              ${
                                chatagent.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                                  `}
                        >
                          <p className="text-sm font-medium truncate text-center text-gray-800 break-words w-full px-2">
                            {chatagent.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteAgent(chatagent.id, chatagent.name);
                            }}
                          >
                            <Trash2 className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div>Create your autonomous agent</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}