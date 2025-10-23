"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { agentsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAgentStore } from "@/store/agentStore";
import { useAuthStore, useCurrentUser } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { toast } from "@/store/toastStore";

enum ActiveTabs {
  AGENTS = "agents",
  USAGE = "usage",
  SETTINGS = "settings",
}

export default function Dashboard() {
  const user = useCurrentUser();
  const { token } = useAuthStore();
  const { agents, setAgents, deleteAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState(ActiveTabs.AGENTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); //state to nmonitor the two buttons dropdown
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    agentId: string;
    agentName: string;
  }>({ isOpen: false, agentId: "", agentName: "" });

  // Refs for the two buttons
  const button1Ref = useRef<HTMLDivElement>(null);
  const button2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getChatbot = async () => {
      if (!user?.id || !token) return;

      try {
        const { agents } = await agentsAPI.getAll(user.id, token);
        if (agents) setAgents(agents);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    getChatbot();
  }, [user?.id, token, setAgents]);

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

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    setDeleteModal({ isOpen: true, agentId, agentName });
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      if (!token) throw Error("User not authenticated");

      await agentsAPI.delete(deleteModal.agentId, token);
      deleteAgent(deleteModal.agentId);
      toast.success(
        "Deletion Successful",
        `${deleteModal.agentName} has been deleted successfully.`
      );
      setDeleteModal({ isOpen: false, agentId: "", agentName: "" });
    } catch (e) {
      console.error("Deletion failed:", e);
      toast.error(
        "Deletion Failed",
        `Unable to delete ${deleteModal.agentName}. Please check console for details.`
      );
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
                  >
                    <Link href="/dashboard/create"> Create new agent </Link>
                  </Button>
                </div>
                <div ref={button2Ref}>
                  <Button
                    size="md"
                    variant="primary"
                    className="w-fit text-nowrap text-sm shadow-md"
                  >
                    <Link href="/dashboard/chatagent/nb848xqfz">
                      {" "}
                      Use our template{" "}
                    </Link>
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

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, agentId: "", agentName: "" })
        }
        onConfirm={confirmDelete}
        title="Delete Agent"
        message={`Are you sure you want to permanently delete the agent "${deleteModal.agentName}"? This action cannot be undone.`}
        confirmText="Delete Agent"
        requireTyping={true}
        expectedText={`DELETE ${deleteModal.agentName}`}
        isLoading={isLoading}
      />
    </>
  );
}
