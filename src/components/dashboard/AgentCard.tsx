import { LucideIcon, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentStatus } from "@/types/agent";
import { Button } from "../ui/Button";
import Image from "next/image";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    status: AgentStatus;
    imageUrl?: string;
    icon?: LucideIcon;
    isTemplate?: boolean;
    agent_type?: string;
    ai_model?: string;
    credits_per_1k?: number;
    average_rating?: number;
  };
  onDelete: (id: string, name: string) => void;
  onManage?: () => void;
  onHire?: () => void;
}

export function AgentCard({
  agent,
  onDelete,
  onManage,
  onHire,
}: AgentCardProps) {
  const IconComponent = agent.icon || MessageSquare;

  return (
    <li className="group">
      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
              agent.status === "active"
                ? "bg-green-100 text-green-700 ring-1 ring-green-600/20"
                : !agent.isTemplate
                  ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-600/20"
                  : ""
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                agent.status === "active"
                  ? "bg-green-600 animate-pulse"
                  : !agent.isTemplate
                    ? "bg-yellow-600"
                    : ""
              )}
            />
            {agent.status === "active" && "Active"}
          </span>
        </div>

        {/* Delete Button - Top Left */}
        {!agent.isTemplate && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(agent.id, agent.name);
            }}
            className="absolute top-3 left-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:scale-110"
            title="Delete agent"
          >
            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
          </button>
        )}

        {/* Icon/Image Section */}
        <div className="relative h-56 overflow-hidden flex justify-center items-center">
          {agent.imageUrl ? (
            <>
              <Image
                height={500}
                width={500}
                src={agent.imageUrl}
                alt={agent.name}
                className="absolute inset-0 object-cover h-full w-full blur-lg scale-110 opacity-30"
              />
              <Image
                height={300}
                width={300}
                src={agent.imageUrl}
                alt={agent.name}
                className="relative object-contain h-36 w-36 transition-all hover:scale-110 z-10 rounded-full"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 w-full">
              <div className="p-5 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-all group-hover:scale-110">
                <IconComponent
                  className="w-14 h-14 text-primary-600"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="p-4 bg-white border-t border-gray-100">
          <p className="text-base font-semibold text-gray-900 truncate text-center mb-1">
            {agent.name}
          </p>
          <p className="text-base font-semibold text-gray-500 truncate text-center mb-1">
            {agent.description}
          </p>
          {agent.isTemplate && (
            <div className="grid grid-cols-4 text-xs text-gray-600 mb-3">
              <div className="text-center border-r-2 border-black/20 px-3">
                <div className="font-medium">⭐ {agent.average_rating}</div>
                <div>Rating</div>
              </div>
              <div className="text-center border-r-2 border-black/20 px-3">
                <div className="font-medium">{agent.credits_per_1k}c</div>
                <div>Per 1K</div>
              </div>
              <div className="text-center border-r-2 border-black/20 px-3">
                <div className="font-medium">{agent.agent_type}</div>
                <div>Type</div>
              </div>
              <div className="text-center px-3">
                <div className="font-medium">{agent.ai_model}</div>
                <div>Model</div>
              </div>
            </div>
          )}
          <Button
            className="!rounded-full w-full"
            size="sm"
            onClick={agent.isTemplate ? onHire : onManage}
          >
            {agent.isTemplate ? "Hire" : "Manage"}
          </Button>
        </div>
      </div>
    </li>
  );
}
