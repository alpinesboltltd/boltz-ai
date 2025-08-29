import Image from "next/image";
import { BookCheck, Code, Share, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { agentsAPI } from "@/lib/api";
import { AgentActions } from "@/types/actions";

export function Actions() {
  const agentId = useParams().id as string;
  const [actionsData, setActionsData] = useState<AgentActions | null>(null);
  const [loading, setLoading] = useState(true);
  const actions = [
    {
      id: "1",
      icon: {
        src: "/slack.png",
      },
      name: "Slack",
      description:
        "Connect your Slack workspace to receive notifications and interact with your chatbot.",
    },
    {
      id: "2",
      icon: {
        src: "/whatsapp.png",
      },
      name: "Whatsapp",
      description:
        "Connect your Agent to a Whatsapp number and let it respond to messages from your customers",
    },
    {
      id: "3",
      icon: {
        src: "/messenger.png",
      },
      name: "Messenger",
      description:
        "Connect your agent to a Facebook page and let it respond to messages from your customers.",
    },
    {
      id: "4",
      icon: {
        src: "/instagram.png",
      },
      name: "Instagram",
      description:
        "Connect your agent to an Instagram page and let it respond to messages from your customers.",
    },
  ];

  const [activeTab, setActiveTab] = useState("embed");

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const { data } = await agentsAPI.getActions(agentId);
        setActionsData(data);
      } catch (error) {
        console.error('Failed to fetch actions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [agentId]);

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("embed")}
            className={`${
              activeTab === "embed"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium flex items-center gap-x-1 text-sm`}
          >
            <Code width={16} height={16} />
            Embed
          </button>
          <button
            onClick={() => setActiveTab("share")}
            className={`${
              activeTab === "share"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 flex gap-x-1 items-center font-medium text-sm`}
          >
            <Share width={16} height={16} />
            Share
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className={`${
              activeTab === "integrations"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 flex items-center gap-x-1 font-medium text-sm`}
          >
            <Layers width={16} height={16} />
            Integrations
          </button>
        </nav>
      </div>

      {activeTab === "embed" && (
        <div className="border-2 border-gray-200 mt-10 px-4 py-6 rounded-lg">
          <h2 className="text-2xl">Embed</h2>
          <p className="text-md mt-6">
            The AI agent is private, to share the agent, change the visibility
            to public.
          </p>
          <div className="flex items-end justify-end">
            <button className="bg-black py-2 px-6 text-[8px] rounded-lg text-white">
              Make Public
            </button>
          </div>
        </div>
      )}

      {activeTab === "share" && (
        <div className="border-2 border-gray-200 mt-10 px-4 py-6 rounded-lg">
          <h2 className="text-2xl">Share</h2>
          <p className="text-md mt-6">
            The AI agent is private, to share the agent, change the visibility
            to public.
          </p>
          <div className="flex items-end justify-end">
            <button className="bg-black py-2 px-6 text-[8px] rounded-lg text-white">
              Make Public
            </button>
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col items-start px-5 py-4 border shadow-md rounded-2xl bg-gray-100"
            >
              <Image
                src={action.icon.src}
                alt={action.name}
                width={48}
                height={48}
              />
              <h3 className="text-lg font-semibold text-gray-900 mt-3 ">
                {action.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              <div className="flex items-center gap-x-6 mt-10">
                <button className="bg-none rounded-lg border shadow-md px-8 py-2 text-sm font-medium text-gray-700">
                  Suscribe to enable
                </button>
                <button className="bg-none rounded-md border-2 border-gray-300 py-1 px-1">
                  <BookCheck className="w-6 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
